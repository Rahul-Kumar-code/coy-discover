import { describe, expect, it } from "vitest";

import { feedQuerySchema, swipeRequestSchema } from "@/lib/api/validation";

describe("API validation", () => {
  it("accepts LIKE and PASS", () => {
    expect(swipeRequestSchema.parse({ profileId: "profile-maya", action: "LIKE" }).action).toBe(
      "LIKE",
    );
    expect(swipeRequestSchema.parse({ profileId: "profile-maya", action: "PASS" }).action).toBe(
      "PASS",
    );
  });

  it("rejects invalid actions and blank profile IDs", () => {
    expect(swipeRequestSchema.safeParse({ profileId: "", action: "LIKE" }).success).toBe(false);
    expect(
      swipeRequestSchema.safeParse({ profileId: "profile-maya", action: "SKIP" }).success,
    ).toBe(false);
  });

  it("validates feed pagination", () => {
    expect(feedQuerySchema.parse({ page: "2", limit: "10" })).toEqual({ page: 2, limit: 10 });
    expect(feedQuerySchema.safeParse({ page: "0", limit: "10" }).success).toBe(false);
    expect(feedQuerySchema.safeParse({ page: "1", limit: "51" }).success).toBe(false);
  });
});
