import "dotenv/config";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg from "pg";

import {
  DEMO_USER_ID,
  ensureDemoUser,
  getFeed,
  getMutualMatches,
  recordSwipe,
} from "@/lib/discovery";

const prisma = new PrismaClient({
  adapter: new PrismaPg(
    new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  ),
});

beforeAll(async () => {
  await ensureDemoUser();
  await prisma.swipe.deleteMany({ where: { userId: DEMO_USER_ID } });
});

beforeEach(async () => {
  await prisma.swipe.deleteMany({ where: { userId: DEMO_USER_ID } });
});

afterAll(async () => {
  await prisma.swipe.deleteMany({ where: { userId: DEMO_USER_ID } });
  await prisma.$disconnect();
});

describe("Coy discovery persistence", () => {
  it("returns at least 30 eligible seeded profiles initially", async () => {
    const profileCount = await prisma.profile.count();
    const feed = await getFeed(DEMO_USER_ID, 1, 50);

    expect(profileCount).toBeGreaterThanOrEqual(30);
    expect(feed.profiles.length).toBeGreaterThanOrEqual(30);
  });

  it("excludes liked profiles and passed profiles from the feed", async () => {
    await recordSwipe(DEMO_USER_ID, "profile-maya", "LIKE");
    await recordSwipe(DEMO_USER_ID, "profile-liam", "PASS");

    const feed = await getFeed(DEMO_USER_ID, 1, 50);
    const ids = feed.profiles.map((profile) => profile.id);

    expect(ids).not.toContain("profile-maya");
    expect(ids).not.toContain("profile-liam");
  });

  it("never exposes incoming-like flags in feed profiles", async () => {
    const feed = await getFeed(DEMO_USER_ID, 1, 50);

    for (const profile of feed.profiles) {
      expect(profile).not.toHaveProperty("hasLikedUser");
      expect(profile).not.toHaveProperty("profileLike");
    }
  });

  it("records LIKE and PASS persistently", async () => {
    const like = await recordSwipe(DEMO_USER_ID, "profile-aisha", "LIKE");
    const pass = await recordSwipe(DEMO_USER_ID, "profile-noah", "PASS");

    expect(like.kind).toBe("SWIPED");
    expect(pass.kind).toBe("SWIPED");

    const stored = await prisma.swipe.findMany({
      where: { userId: DEMO_USER_ID },
    });
    expect(
      stored.some((swipe) => swipe.profileId === "profile-aisha" && swipe.action === "LIKE"),
    ).toBe(true);
    expect(
      stored.some((swipe) => swipe.profileId === "profile-noah" && swipe.action === "PASS"),
    ).toBe(true);
  });

  it("rejects duplicate swipes and invalid profile IDs", async () => {
    await recordSwipe(DEMO_USER_ID, "profile-zara", "PASS");
    const duplicate = await recordSwipe(DEMO_USER_ID, "profile-zara", "LIKE");
    const invalid = await recordSwipe(DEMO_USER_ID, "profile-does-not-exist", "LIKE");

    expect(duplicate.kind).toBe("DUPLICATE_SWIPE");
    expect(invalid.kind).toBe("PROFILE_NOT_FOUND");

    const count = await prisma.swipe.count({
      where: { userId: DEMO_USER_ID, profileId: "profile-zara" },
    });
    expect(count).toBe(1);
  });

  it("creates a mutual match only for reciprocal likes", async () => {
    const mutual = await recordSwipe(DEMO_USER_ID, "profile-maya", "LIKE");
    const oneSided = await recordSwipe(DEMO_USER_ID, "profile-liam", "LIKE");

    expect(mutual.kind).toBe("SWIPED");
    expect(mutual.kind === "SWIPED" && mutual.matchCreated).toBe(true);
    expect(oneSided.kind).toBe("SWIPED");
    expect(oneSided.kind === "SWIPED" && oneSided.matchCreated).toBe(false);
  });

  it("never creates a match for PASS", async () => {
    const result = await recordSwipe(DEMO_USER_ID, "profile-aisha", "PASS");

    expect(result.kind).toBe("SWIPED");
    expect(result.kind === "SWIPED" && result.matchCreated).toBe(false);
  });

  it("allows mutual matches and hides one-sided likes", async () => {
    await prisma.swipe.deleteMany({ where: { userId: DEMO_USER_ID } });
    await recordSwipe(DEMO_USER_ID, "profile-maya", "LIKE");
    await recordSwipe(DEMO_USER_ID, "profile-liam", "LIKE");

    const matches = await getMutualMatches(DEMO_USER_ID);
    const ids = matches.map((profile) => profile.id);

    expect(ids).toContain("profile-maya");
    expect(ids).not.toContain("profile-liam");
    expect(matches).toEqual(
      matches.filter(
        (profile, index, all) => all.findIndex((item) => item.id === profile.id) === index,
      ),
    );
  });

  it("returns an empty mutual-match list after resetting swipes", async () => {
    await prisma.swipe.deleteMany({ where: { userId: DEMO_USER_ID } });
    await expect(getMutualMatches(DEMO_USER_ID)).resolves.toEqual([]);
  });

  it("handles concurrent duplicate requests without duplicate records", async () => {
    await prisma.swipe.deleteMany({
      where: { userId: DEMO_USER_ID, profileId: "profile-zara" },
    });

    const results = await Promise.allSettled([
      recordSwipe(DEMO_USER_ID, "profile-zara", "LIKE"),
      recordSwipe(DEMO_USER_ID, "profile-zara", "PASS"),
    ]);

    const count = await prisma.swipe.count({
      where: { userId: DEMO_USER_ID, profileId: "profile-zara" },
    });

    expect(results.filter((result) => result.status === "fulfilled").length).toBeGreaterThanOrEqual(
      1,
    );
    expect(count).toBe(1);
  });
});
