import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Profile } from "@/types";

const profile: Profile = {
  id: "profile-test",
  name: "Test Profile",
  age: 23,
  photo: "https://example.com/profile.jpg",
  bio: "Test profile bio.",
  city: "Test City",
  college: "Test College",
  interests: ["Testing", "TypeScript", "UI"],
};

const mocks = vi.hoisted(() => ({
  getProfiles: vi.fn(),
  recordSwipe: vi.fn(),
  reset: vi.fn(),
}));

vi.mock("@/services/swipe-service", () => ({
  swipeService: mocks,
}));

import { DiscoverExperience } from "@/components/discover/discover-experience";

beforeEach(() => {
  mocks.getProfiles.mockReset();
  mocks.recordSwipe.mockReset();
  mocks.reset.mockReset();
  mocks.getProfiles.mockResolvedValue([profile]);
  mocks.recordSwipe.mockResolvedValue({ success: true, matchCreated: false });
});

describe("DiscoverExperience", () => {
  it("renders loading then an API profile", async () => {
    render(<DiscoverExperience />);
    expect(screen.getByLabelText("Loading profile")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Test Profile")).toBeInTheDocument();
    });
  });

  it("uses the API for Like and advances only after success", async () => {
    render(<DiscoverExperience />);
    await screen.findByText("Test Profile");

    fireEvent.click(screen.getByRole("button", { name: "Like profile" }));

    await waitFor(() => {
      expect(mocks.recordSwipe).toHaveBeenCalledWith("profile-test", "LIKE");
    });

    await act(async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 450));
    });

    await waitFor(() => {
      expect(screen.getAllByText("You’re all caught up").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("does not advance on a failed swipe and shows an error", async () => {
    mocks.recordSwipe.mockRejectedValue(new Error("Could not record the swipe."));
    render(<DiscoverExperience />);
    await screen.findByText("Test Profile");

    fireEvent.click(screen.getByRole("button", { name: "Pass on profile" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Could not record the swipe.");
    });
    expect(screen.getByText("Test Profile")).toBeInTheDocument();
  });

  it("shows the match screen only when matchCreated is true", async () => {
    mocks.recordSwipe.mockResolvedValue({ success: true, matchCreated: true });
    render(<DiscoverExperience />);
    await screen.findByText("Test Profile");

    fireEvent.click(screen.getByRole("button", { name: "Like profile" }));

    await screen.findByRole("heading", { name: /It.?s a match/i });
  });

  it("renders feed loading and API error states", async () => {
    mocks.getProfiles.mockRejectedValue(new Error("Database unavailable"));
    render(<DiscoverExperience />);

    await waitFor(() => {
      expect(screen.getByText("Couldn’t load profiles")).toBeInTheDocument();
      expect(screen.getByText("Database unavailable")).toBeInTheDocument();
    });
  });
});
