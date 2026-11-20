import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Profile } from "@/types";

const profile: Profile = {
  id: "profile-match",
  name: "Match Profile",
  age: 24,
  photo: "https://example.com/match.jpg",
  bio: "Mutual match bio.",
  city: "Bangalore",
  college: "IIT Delhi",
  interests: ["React", "Music", "Travel"],
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("MatchesExperience", () => {
  it("renders mutual matches returned by the API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [profile],
      }),
    );

    const { MatchesExperience } = await import("@/components/matches/matches-experience");
    render(<MatchesExperience />);

    await waitFor(() => {
      expect(screen.getByText("Match Profile")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });

  it("renders an empty state for an empty match array", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      }),
    );

    const { MatchesExperience } = await import("@/components/matches/matches-experience");
    render(<MatchesExperience />);

    await screen.findByText("No matches yet");
  });

  it("renders an API error with retry action", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          error: { message: "Database unavailable" },
        }),
      }),
    );

    const { MatchesExperience } = await import("@/components/matches/matches-experience");
    render(<MatchesExperience />);

    await screen.findByText("Database unavailable");
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });
});
