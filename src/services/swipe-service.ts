import type { Profile } from "@/types";

export type SwipeAction = "LIKE" | "PASS";

type FeedResponse = {
  success: boolean;
  profiles: Profile[];
};

export type SwipeResponse = {
  success: boolean;
  matchCreated: boolean;
  match?: {
    id: string;
  };
};

export class SwipeApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
  }
}

export const swipeService = {
  async getProfiles(): Promise<Profile[]> {
    const response = await fetch("/api/feed?limit=50", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      let message = "Could not load the discovery feed.";

      try {
        const data = (await response.json()) as {
          error?: { message?: string; code?: string };
        };
        message = data.error?.message ?? message;
      } catch {
        // Keep the user-facing fallback message.
      }

      throw new Error(message);
    }

    const data = (await response.json()) as FeedResponse;
    return data.profiles;
  },

  async recordSwipe(profileId: string, action: SwipeAction): Promise<SwipeResponse> {
    const response = await fetch("/api/swipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profileId, action }),
      cache: "no-store",
    });

    if (!response.ok) {
      let message = "Could not record the swipe.";
      let code: string | undefined;

      try {
        const data = (await response.json()) as {
          error?: { message?: string; code?: string };
        };
        message = data.error?.message ?? message;
        code = data.error?.code;
      } catch {
        // Keep the user-facing fallback message.
      }

      throw new SwipeApiError(message, response.status, code);
    }

    return (await response.json()) as SwipeResponse;
  },

  async reset(): Promise<void> {
    // Frontend state is not reset by this service; swipes remain persisted in PostgreSQL.
  },
};
