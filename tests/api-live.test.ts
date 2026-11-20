import "dotenv/config";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg from "pg";

const baseUrl = process.env.COY_TEST_BASE_URL ?? "http://localhost:3000";
const prisma = new PrismaClient({
  adapter: new PrismaPg(
    new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  ),
});

beforeAll(async () => {
  await prisma.swipe.deleteMany({ where: { userId: "demo-user" } });
});

afterAll(async () => {
  await prisma.swipe.deleteMany({ where: { userId: "demo-user" } });
  await prisma.$disconnect();
});

describe("Live API integration", () => {
  it("returns at least 30 eligible profiles and no incoming-like fields", async () => {
    const response = await fetch(`${baseUrl}/api/feed?page=1&limit=50`);
    expect(response.ok).toBe(true);

    const data = (await response.json()) as {
      profiles: Array<Record<string, unknown>>;
      pagination: { total: number };
    };

    expect(data.pagination.total).toBeGreaterThanOrEqual(30);
    expect(data.profiles.length).toBeGreaterThanOrEqual(30);
    for (const profile of data.profiles) {
      expect(profile).not.toHaveProperty("hasLikedUser");
      expect(profile).not.toHaveProperty("profileLike");
    }
  });

  it("records PASS, excludes it from feed, and never creates a match", async () => {
    const response = await fetch(`${baseUrl}/api/swipe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId: "profile-liam", action: "PASS" }),
    });

    expect(response.ok).toBe(true);
    expect(await response.json()).toEqual({ success: true, matchCreated: false });

    const feed = await fetch(`${baseUrl}/api/feed?limit=50`);
    const data = (await feed.json()) as { profiles: Array<{ id: string }> };
    expect(data.profiles.map((profile) => profile.id)).not.toContain("profile-liam");
  });

  it("records normal LIKE without creating a match", async () => {
    await prisma.swipe.deleteMany({
      where: { userId: "demo-user", profileId: "profile-liam" },
    });

    const response = await fetch(`${baseUrl}/api/swipe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId: "profile-liam", action: "LIKE" }),
    });
    expect(await response.json()).toEqual({ success: true, matchCreated: false });
  });

  it("creates mutual match only for reciprocal interest", async () => {
    await prisma.swipe.deleteMany({
      where: { userId: "demo-user", profileId: "profile-maya" },
    });

    const response = await fetch(`${baseUrl}/api/swipe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId: "profile-maya", action: "LIKE" }),
    });
    const data = (await response.json()) as {
      success: boolean;
      matchCreated: boolean;
      match?: { id: string };
    };

    expect(data.success).toBe(true);
    expect(data.matchCreated).toBe(true);
    expect(data.match?.id).toBeTruthy();
  });

  it("rejects invalid profile, invalid action, and duplicate swipe", async () => {
    const invalidProfile = await fetch(`${baseUrl}/api/swipe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId: "missing-profile", action: "LIKE" }),
    });
    expect(invalidProfile.status).toBe(404);

    const invalidAction = await fetch(`${baseUrl}/api/swipe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId: "profile-maya", action: "SKIP" }),
    });
    expect(invalidAction.status).toBe(400);

    const duplicate = await fetch(`${baseUrl}/api/swipe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId: "profile-maya", action: "PASS" }),
    });
    expect(duplicate.status).toBe(409);
  });

  it("returns only mutual matches and no duplicates", async () => {
    const response = await fetch(`${baseUrl}/api/matches`);
    const matches = (await response.json()) as Array<{ id: string }>;
    expect(response.ok).toBe(true);
    expect(matches.map((profile) => profile.id)).toContain("profile-maya");
    expect(matches.map((profile) => profile.id)).not.toContain("profile-liam");
    expect(new Set(matches.map((profile) => profile.id)).size).toBe(matches.length);
  });

  it("handles concurrent duplicate requests safely", async () => {
    await prisma.swipe.deleteMany({
      where: { userId: "demo-user", profileId: "profile-zara" },
    });

    const requests = await Promise.all([
      fetch(`${baseUrl}/api/swipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: "profile-zara", action: "LIKE" }),
      }),
      fetch(`${baseUrl}/api/swipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: "profile-zara", action: "PASS" }),
      }),
    ]);

    expect(requests.filter((response) => response.ok).length).toBe(1);
    expect(requests.some((response) => response.status === 409)).toBe(true);

    const count = await prisma.swipe.count({
      where: { userId: "demo-user", profileId: "profile-zara" },
    });
    expect(count).toBe(1);
  });

  it("swipes persist and excluded profiles do not reappear", async () => {
    await prisma.swipe.deleteMany({ where: { userId: "demo-user" } });
    await fetch(`${baseUrl}/api/swipe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId: "profile-arjun", action: "PASS" }),
    });
    await fetch(`${baseUrl}/api/swipe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId: "profile-sofia", action: "LIKE" }),
    });

    const feed = await fetch(`${baseUrl}/api/feed?limit=50`);
    const data = (await feed.json()) as { profiles: Array<{ id: string }> };
    expect(data.profiles.map((profile) => profile.id)).not.toContain("profile-arjun");
    expect(data.profiles.map((profile) => profile.id)).not.toContain("profile-sofia");

    const count = await prisma.swipe.count({ where: { userId: "demo-user" } });
    expect(count).toBe(2);
  });

  it("returns empty matches after resetting swipes", async () => {
    await prisma.swipe.deleteMany({ where: { userId: "demo-user" } });
    const response = await fetch(`${baseUrl}/api/matches`);
    expect(await response.json()).toEqual([]);
  });
});
