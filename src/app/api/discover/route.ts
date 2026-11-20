import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    {
      error: {
        code: "NOT_IMPLEMENTED",
        message: "Discover is ready for feature implementation.",
      },
    },
    { status: 501 },
  );
}
