"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import type { Profile } from "@/types";
import { MatchCard } from "@/components/matches/match-card";
import { MatchesSkeleton } from "@/components/matches/matches-skeleton";

export function MatchesExperience() {
  const [matches, setMatches] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMatches = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/matches", {
        method: "GET",
        cache: "no-store",
      });
      const data = (await response.json()) as Profile[] | { error?: { message?: string } };

      if (!response.ok) {
        const message =
          "error" in data && data.error?.message
            ? data.error.message
            : "We couldn’t load your matches.";
        throw new Error(message);
      }

      setMatches(Array.isArray(data) ? data : []);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "We couldn’t load your matches.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const frame = window.requestAnimationFrame(() => {
      if (!cancelled) void loadMatches();
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [loadMatches]);

  useEffect(() => {
    const handleFocus = () => void loadMatches();
    const handleMatchUpdated = () => void loadMatches();
    window.addEventListener("focus", handleFocus);
    window.addEventListener("coy:matches-updated", handleMatchUpdated);
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("coy:matches-updated", handleMatchUpdated);
    };
  }, [loadMatches]);

  return (
    <div className="min-h-dvh bg-[#f5f5f5] px-5 pt-[92px] pb-[112px] md:px-10 md:pt-8 md:pb-10">
      <div className="mx-auto max-w-[1120px]">
        <header className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black tracking-[0.16em] text-[#17131e]/55 uppercase">
              Your connections
            </p>
            <div className="mt-1 flex items-center gap-3">
              <h1 className="text-[38px] leading-none font-black tracking-[-0.055em] text-[#17131e] md:text-[52px]">
                Matches
              </h1>
              {!loading && !error ? (
                <span className="grid h-10 min-w-10 place-items-center rounded-full border-[3px] border-[#17131e] bg-[#ff347d] px-3 text-sm font-black text-[#17131e] shadow-[3px_3px_0_#17131e]">
                  {matches.length}
                </span>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={() => void loadMatches()}
            disabled={loading}
            className="grid size-11 shrink-0 place-items-center rounded-full border-[3px] border-[#17131e] bg-white text-[#17131e] shadow-[4px_4px_0_#17131e] transition hover:-translate-y-0.5 disabled:opacity-50"
            aria-label="Refresh matches"
          >
            <RefreshCw className={loading ? "size-5 animate-spin" : "size-5"} aria-hidden="true" />
          </button>
        </header>

        {loading ? (
          <MatchesSkeleton />
        ) : error ? (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[420px] flex-col items-center justify-center rounded-[28px] border-[3px] border-[#17131e] bg-white px-6 text-center shadow-[8px_9px_0_#17131e]"
          >
            <span className="grid size-16 place-items-center rounded-full border-[3px] border-[#17131e] bg-[#ffe2d2]">
              <Heart className="size-7 text-[#17131e]" aria-hidden="true" />
            </span>
            <h2 className="mt-6 text-3xl font-black tracking-[-0.04em] text-[#17131e]">
              Matches are taking a break
            </h2>
            <p className="mt-3 max-w-md text-sm font-bold text-[#17131e]/60">{error}</p>
            <button
              type="button"
              onClick={() => void loadMatches()}
              className="mt-6 h-12 rounded-full border-[3px] border-[#17131e] bg-[#ff347d] px-6 text-sm font-black text-[#17131e] shadow-[5px_5px_0_#17131e]"
            >
              Try again
            </button>
          </motion.section>
        ) : matches.length === 0 ? (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[420px] flex-col items-center justify-center rounded-[28px] border-[3px] border-[#17131e] bg-white px-6 text-center shadow-[8px_9px_0_#17131e]"
          >
            <motion.span
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className="relative grid size-20 place-items-center rounded-full border-[3px] border-[#17131e] bg-[#ffe45c] shadow-[5px_5px_0_#17131e]"
              aria-hidden="true"
            >
              <Heart className="size-9 fill-[#ff347d] text-[#17131e]" />
            </motion.span>
            <h2 className="mt-7 text-3xl font-black tracking-[-0.04em] text-[#17131e]">
              No matches yet
            </h2>
            <p className="mt-3 max-w-md text-sm font-bold text-[#17131e]/60">
              When you and another person both like each other, they’ll appear here.
            </p>
            <Link
              href="/discover"
              className="mt-6 flex h-12 items-center rounded-full border-[3px] border-[#17131e] bg-[#ff347d] px-6 text-sm font-black text-[#17131e] shadow-[5px_5px_0_#17131e] transition hover:-translate-y-0.5"
            >
              Return to Discover
            </Link>
          </motion.section>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((profile, index) => (
              <MatchCard key={profile.id} profile={profile} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
