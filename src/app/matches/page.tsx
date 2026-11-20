import type { Metadata } from "next";

import { MatchesExperience } from "@/components/matches/matches-experience";

export const metadata: Metadata = {
  title: "Matches | coy",
};

export default function MatchesPage() {
  return (
    <main className="min-h-dvh pt-[68px] md:pt-0" aria-label="Matches">
      <MatchesExperience />
    </main>
  );
}
