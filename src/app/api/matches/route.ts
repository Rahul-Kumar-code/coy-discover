import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { apiError } from "@/lib/api/errors";
import { DEMO_USER_ID, ensureDemoUser, getMutualMatches } from "@/lib/discovery";

export async function GET() {
  try {
    await ensureDemoUser();
    const matches = await getMutualMatches(DEMO_USER_ID);
    return NextResponse.json(matches);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return apiError(503, "DATABASE_ERROR", "The database request could not be completed.");
    }

    console.error("GET /api/matches failed", error);
    return apiError(500, "INTERNAL_ERROR", "An unexpected error occurred.");
  }
}
