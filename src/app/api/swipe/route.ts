import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { apiError } from "@/lib/api/errors";
import { swipeRequestSchema } from "@/lib/api/validation";
import { DEMO_USER_ID, ensureDemoUser, recordSwipe } from "@/lib/discovery";

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return apiError(400, "INVALID_JSON", "Request body must contain valid JSON.");
  }

  const parsed = swipeRequestSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(
      400,
      "VALIDATION_ERROR",
      parsed.error.issues.map((issue) => issue.message).join(", "),
    );
  }

  try {
    await ensureDemoUser();
    const result = await recordSwipe(DEMO_USER_ID, parsed.data.profileId, parsed.data.action);

    if (result.kind === "PROFILE_NOT_FOUND") {
      return apiError(404, "PROFILE_NOT_FOUND", "The requested profile does not exist.");
    }

    if (result.kind === "DUPLICATE_SWIPE") {
      return apiError(409, "DUPLICATE_SWIPE", "This profile has already been swiped.");
    }

    return NextResponse.json(
      {
        success: true,
        matchCreated: result.matchCreated,
        ...(result.matchCreated
          ? {
              match: {
                id: result.swipe.id,
              },
            }
          : {}),
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return apiError(409, "DUPLICATE_SWIPE", "This profile has already been swiped.");
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return apiError(404, "PROFILE_NOT_FOUND", "The requested profile does not exist.");
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return apiError(503, "DATABASE_ERROR", "The database request could not be completed.");
    }

    console.error("POST /api/swipe failed", error);
    return apiError(500, "INTERNAL_ERROR", "An unexpected error occurred.");
  }
}
