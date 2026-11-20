import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg from "pg";

import { seedProfiles } from "../src/data/seed-profiles";

const prisma = new PrismaClient({
  adapter: new PrismaPg(
    new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  ),
});

const DEMO_USER_ID = "demo-user";

const incomingLikeIds = [
  "profile-maya",
  "profile-aisha",
  "profile-neha",
  "profile-riya",
  "profile-isla",
  "profile-ananya",
  "profile-tara",
  "profile-nina",
  "profile-priya",
  "profile-kavya",
  "profile-sana",
  "profile-mira",
];

async function main() {
  await prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    update: { name: "Demo User" },
    create: { id: DEMO_USER_ID, name: "Demo User" },
  });

  for (const profile of seedProfiles) {
    await prisma.profile.upsert({
      where: { id: profile.id },
      update: {
        name: profile.name,
        age: profile.age,
        photo: profile.photo,
        bio: profile.bio,
        city: profile.city,
        college: profile.college,
        interests: profile.interests,
      },
      create: profile,
    });

    await prisma.profileLike.upsert({
      where: { profileId: profile.id },
      update: { hasLikedUser: incomingLikeIds.includes(profile.id) },
      create: {
        profileId: profile.id,
        hasLikedUser: incomingLikeIds.includes(profile.id),
      },
    });
  }

  const profileCount = await prisma.profile.count();
  const incomingLikeCount = await prisma.profileLike.count({
    where: { hasLikedUser: true },
  });

  console.log(`Seed complete: ${profileCount} profiles, ${incomingLikeCount} incoming likes.`);
}

main()
  .catch((error) => {
    console.error("Database seed failed.", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
