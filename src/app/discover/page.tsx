import type { Metadata } from "next";
import { Suspense } from "react";

import { DiscoverExperience } from "@/components/discover/discover-experience";
import { ProfileSkeleton } from "@/components/discover/profile-skeleton";
import type { Profile } from "@/types";

export const metadata: Metadata = {
  title: "Discover | coy",
};

async function DiscoverFeed() {
  let initialProfiles: Profile[] = [];
  let initialFeedError = "";

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/feed?limit=50`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Couldn’t load profiles from the server.");
    }

    const data = (await response.json()) as { profiles: Profile[] };
    initialProfiles = data.profiles;
  } catch (error) {
    initialFeedError =
      error instanceof Error ? error.message : "Couldn’t load profiles from the server.";
  }

  return (
    <DiscoverExperience initialProfiles={initialProfiles} initialFeedError={initialFeedError} />
  );
}

export default function DiscoverPage() {
  return (
    <main className="min-h-dvh pt-[68px] md:pt-0" aria-label="Discover">
      <Suspense
        fallback={
          <div className="flex min-h-dvh items-center justify-center bg-[#f5f5f5] px-5 pt-20 pb-28">
            <ProfileSkeleton />
          </div>
        }
      >
        <DiscoverFeed />
      </Suspense>
    </main>
  );
}
