import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const publicProfileSelect = Prisma.validator<Prisma.ProfileSelect>()({
  id: true,
  name: true,
  age: true,
  photo: true,
  bio: true,
  city: true,
  college: true,
  interests: true,
});

export type SwipeAction = "LIKE" | "PASS";

export const DEMO_USER_ID = "demo-user";

export async function ensureDemoUser() {
  await prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    update: { name: "Demo User" },
    create: { id: DEMO_USER_ID, name: "Demo User" },
  });
}

export async function getFeed(userId: string, page: number, limit: number) {
  const skip = (page - 1) * limit;

  const [profiles, total] = await prisma.$transaction([
    prisma.profile.findMany({
      where: {
        swipes: {
          none: {
            userId,
          },
        },
      },
      select: publicProfileSelect,
      orderBy: { createdAt: "asc" },
      skip,
      take: limit,
    }),
    prisma.profile.count({
      where: {
        swipes: {
          none: {
            userId,
          },
        },
      },
    }),
  ]);

  return {
    profiles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: skip + profiles.length < total,
    },
  };
}

export async function recordSwipe(userId: string, profileId: string, action: SwipeAction) {
  return prisma.$transaction(async (tx) => {
    const profile = await tx.profile.findUnique({
      where: { id: profileId },
      select: { id: true },
    });

    if (!profile) {
      return { kind: "PROFILE_NOT_FOUND" as const };
    }

    const existingSwipe = await tx.swipe.findUnique({
      where: {
        userId_profileId: { userId, profileId },
      },
      select: { id: true },
    });

    if (existingSwipe) {
      return { kind: "DUPLICATE_SWIPE" as const };
    }

    const swipe = await tx.swipe.create({
      data: { userId, profileId, action },
    });

    if (action === "PASS") {
      return {
        kind: "SWIPED" as const,
        matchCreated: false,
        swipe,
      };
    }

    const incomingLike = await tx.profileLike.findUnique({
      where: { profileId },
      select: { hasLikedUser: true },
    });

    const matchCreated = incomingLike?.hasLikedUser === true;

    return {
      kind: "SWIPED" as const,
      matchCreated,
      swipe,
    };
  });
}

export async function getMutualMatches(userId: string) {
  return prisma.profile.findMany({
    where: {
      profileLike: {
        is: {
          hasLikedUser: true,
        },
      },
      swipes: {
        some: {
          userId,
          action: "LIKE",
        },
      },
    },
    select: publicProfileSelect,
    orderBy: { createdAt: "desc" },
  });
}
