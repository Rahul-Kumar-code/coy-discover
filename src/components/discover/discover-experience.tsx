"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import type { Profile } from "@/types";
import { swipeService, type SwipeAction } from "@/services/swipe-service";
import { MatchModal } from "@/components/matches/match-modal";
import { ProfileCard } from "@/components/discover/profile-card";
import { ProfileSkeleton } from "@/components/discover/profile-skeleton";
import { SwipeActions } from "@/components/discover/swipe-actions";

type DiscoverExperienceProps = {
  initialProfiles?: Profile[];
  initialFeedError?: string;
};

export function DiscoverExperience({
  initialProfiles,
  initialFeedError = "",
}: DiscoverExperienceProps = {}) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles ?? []);
  const [loading, setLoading] = useState(initialProfiles === undefined);
  const [feedback, setFeedback] = useState<SwipeAction | null>(null);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [feedError, setFeedError] = useState(initialFeedError);
  const [swipeError, setSwipeError] = useState("");
  const swipeLockedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  const discoverAgain = async () => {
    setLoading(true);
    setFeedError("");

    try {
      const loadedProfiles = await swipeService.getProfiles();
      setProfiles(loadedProfiles);
    } catch (error) {
      setFeedError(error instanceof Error ? error.message : "Could not load profiles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialProfiles !== undefined) return;

    let cancelled = false;

    swipeService
      .getProfiles()
      .then((loadedProfiles) => {
        if (!cancelled) {
          setProfiles(loadedProfiles);
          setFeedError("");
          setLoading(false);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setFeedError(error instanceof Error ? error.message : "Could not load profiles.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, [initialProfiles]);

  const activeProfile = profiles[0];

  const handleSwipe = (action: SwipeAction) => {
    if (swipeLockedRef.current || showMatchModal || !activeProfile) return;

    swipeLockedRef.current = true;
    setSwipeError("");
    setFeedback(action);

    void swipeService
      .recordSwipe(activeProfile.id, action)
      .then((response) => {
        if (action === "LIKE" && response.matchCreated) {
          if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setMatchedProfile(activeProfile);
          setShowMatchModal(true);
          window.dispatchEvent(new Event("coy:matches-updated"));
          return;
        }

        timeoutRef.current = window.setTimeout(() => {
          setProfiles((current) => current.filter((profile) => profile.id !== activeProfile.id));
          setFeedback(null);
          swipeLockedRef.current = false;
          timeoutRef.current = null;
        }, 420);
      })
      .catch((error) => {
        setSwipeError(error instanceof Error ? error.message : "Could not record your swipe.");
        setFeedback(null);
        swipeLockedRef.current = false;
      });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleSwipe("LIKE");
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        handleSwipe("PASS");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const closeMatch = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setShowMatchModal(false);
    setMatchedProfile(null);
    setProfiles((current) => current.filter((profile) => profile.id !== activeProfile?.id));
    setFeedback(null);
    swipeLockedRef.current = false;
  };

  return (
    <>
      <div className="flex min-h-dvh flex-col items-center bg-[#f5f5f5] px-5 pt-[76px] pb-[104px] md:min-h-dvh md:px-10 md:pt-6 md:pb-6">
        <div className="mb-2 flex w-full max-w-[420px] items-center justify-between md:mb-4">
          <div>
            <p className="text-[10px] font-black tracking-[0.16em] text-[#17131e]/55 uppercase">
              Discover
            </p>
            <p className="mt-1 text-sm font-black text-[#17131e]">
              {loading ? "Finding people" : activeProfile ? "New for you" : "You’re all caught up"}
            </p>
          </div>
          {!loading && activeProfile ? (
            <span className="rounded-full border-2 border-[#17131e] bg-[#ffe45c] px-3 py-1.5 text-[11px] font-black text-[#17131e]">
              {profiles.length} remaining
            </span>
          ) : null}
        </div>

        {loading ? (
          <ProfileSkeleton />
        ) : feedError ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex h-[520px] w-full max-w-[420px] flex-col items-center justify-center rounded-[28px] border-[3px] border-[#17131e] bg-white px-8 text-center shadow-[8px_9px_0_#17131e]"
          >
            <p className="text-3xl font-black tracking-[-0.04em] text-[#17131e]">
              Couldn’t load profiles
            </p>
            <p className="mt-3 max-w-[320px] text-sm font-bold text-[#17131e]/60">{feedError}</p>
            <button
              type="button"
              onClick={() => void discoverAgain()}
              className="mt-6 h-12 rounded-full border-[3px] border-[#17131e] bg-[#ff347d] px-6 text-sm font-black text-[#17131e] shadow-[5px_5px_0_#17131e]"
            >
              Try again
            </button>
          </motion.div>
        ) : activeProfile ? (
          <div className="relative">
            <ProfileCard
              key={activeProfile.id}
              profile={activeProfile}
              disabled={Boolean(feedback)}
              onSwipe={handleSwipe}
              swipeFeedback={feedback}
            />
            {feedback ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`absolute top-8 z-40 rounded-xl border px-4 py-2 text-sm font-bold tracking-[0.12em] uppercase ${
                  feedback === "LIKE"
                    ? "right-6 rotate-6 border-[3px] border-[#17131e] bg-[#ff347d] text-[#17131e]"
                    : "left-6 -rotate-6 border-[3px] border-[#17131e] bg-white text-[#17131e]"
                }`}
                aria-live="polite"
              >
                {feedback}
              </motion.div>
            ) : null}

            <div className="absolute -bottom-[82px] left-1/2 z-30 -translate-x-1/2">
              <SwipeActions
                onPass={() => handleSwipe("PASS")}
                onLike={() => handleSwipe("LIKE")}
                disabled={Boolean(feedback)}
              />
              {swipeError ? (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="absolute top-[88px] left-1/2 w-[280px] -translate-x-1/2 rounded-full border-2 border-[#17131e] bg-white px-3 py-2 text-center text-xs font-black text-[#17131e] shadow-[3px_3px_0_#17131e]"
                >
                  {swipeError}
                </motion.p>
              ) : null}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex h-[520px] w-full max-w-[420px] flex-col items-center justify-center rounded-[28px] border-[3px] border-[#17131e] bg-white px-8 text-center shadow-[8px_9px_0_#17131e]"
          >
            <p className="text-3xl font-black tracking-[-0.04em] text-[#17131e]">
              You’re all caught up
            </p>
            <p className="mt-3 text-sm font-bold text-[#17131e]/60">
              New people will appear here soon.
            </p>
            <button
              type="button"
              onClick={() => void discoverAgain()}
              className="mt-6 h-12 rounded-full border-[3px] border-[#17131e] bg-[#ff347d] px-6 text-sm font-black text-[#17131e] shadow-[5px_5px_0_#17131e] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0_#17131e]"
            >
              Discover again
            </button>
          </motion.div>
        )}
      </div>

      <MatchModal open={showMatchModal} profile={matchedProfile} onClose={closeMatch} />
    </>
  );
}
