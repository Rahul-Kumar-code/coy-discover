import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { apiError } from "@/lib/api/errors";
import { feedQuerySchema } from "@/lib/api/validation";
import { DEMO_USER_ID, ensureDemoUser, getFeed } from "@/lib/discovery";

export async function GET(request: NextRequest) {
  const parsed = feedQuerySchema.safeParse({
    page: request.nextUrl.searchParams.get("page") ?? undefined,
    limit: request.nextUrl.searchParams.get("limit") ?? undefined,
  });

  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", "Invalid pagination parameters.");
  }

  try {
    await ensureDemoUser();
    const result = await getFeed(DEMO_USER_ID, parsed.data.page, parsed.data.limit);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return apiError(503, "DATABASE_ERROR", "The database request could not be completed.");
    }

    console.error("GET /api/feed failed", error);
    return apiError(500, "INTERNAL_ERROR", "An unexpected error occurred.");
  }
}
