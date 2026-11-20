"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import { useEffect } from "react";

import type { Profile } from "@/types";

type MatchModalProps = {
  open: boolean;
  profile: Profile | null;
  onClose: () => void;
};

const demoUser = {
  name: "Demo User",
  photo:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=85",
};

export function MatchModal({ open, profile, onClose }: MatchModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && profile ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#ff347d] px-5 py-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="match-heading"
        >
          {[
            { left: "8%", top: "12%", rotate: -12, symbol: "★" },
            { left: "78%", top: "17%", rotate: 10, symbol: "♥" },
            { left: "12%", top: "72%", rotate: 8, symbol: "●" },
            { left: "82%", top: "68%", rotate: -8, symbol: "★" },
          ].map((item, index) => (
            <motion.span
              key={`${item.symbol}-${index}`}
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{
                opacity: [0, 1, 1, 0.7],
                scale: [0.4, 1.15, 1],
                y: [18, -8, 0],
                rotate: item.rotate,
              }}
              transition={{
                delay: 0.25 + index * 0.08,
                duration: 1.15,
                repeat: Infinity,
                repeatDelay: 2.2,
              }}
              className="absolute hidden size-12 place-items-center rounded-full border-[3px] border-[#17131e] bg-[#ffe45c] text-xl font-black text-[#17131e] md:grid"
              style={{ left: item.left, top: item.top }}
              aria-hidden="true"
            >
              {item.symbol}
            </motion.span>
          ))}

          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 grid size-11 place-items-center rounded-full border-[3px] border-[#17131e] bg-white text-[#17131e] shadow-[4px_4px_0_#17131e] transition hover:-translate-y-0.5 md:top-7 md:right-7"
            aria-label="Close match screen"
          >
            <X className="size-5" strokeWidth={3} aria-hidden="true" />
          </button>

          <motion.section
            initial={{ y: 30, scale: 0.94 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative w-full max-w-[620px] text-center"
          >
            <motion.div
              initial={{ scale: 0.7, rotate: -8 }}
              animate={{ scale: [0.7, 1.08, 1], rotate: [-8, 4, 0] }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mx-auto mb-5 inline-flex -rotate-3 items-center gap-2 rounded-full border-[3px] border-[#17131e] bg-[#ffe45c] px-4 py-2 text-xs font-black text-[#17131e]"
            >
              <Heart className="size-4 fill-[#ff347d] text-[#17131e]" aria-hidden="true" />
              Mutual interest
            </motion.div>

            <h1
              id="match-heading"
              className="text-[48px] leading-[0.88] font-black tracking-[-0.07em] text-[#17131e] md:text-[82px]"
            >
              It&apos;s a
              <br />
              match!
            </h1>

            <div className="mt-8 flex items-center justify-center md:mt-10">
              <motion.div
                initial={{ x: -35, rotate: -10, scale: 0.8 }}
                animate={{ x: 0, rotate: -4, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.12 }}
                className="flex flex-col items-center"
              >
                <div className="relative size-[118px] overflow-hidden rounded-full border-[4px] border-[#17131e] bg-white shadow-[7px_7px_0_#17131e] md:size-[168px]">
                  <Image
                    src={demoUser.photo}
                    alt={demoUser.name}
                    fill
                    sizes="168px"
                    className="object-cover"
                  />
                </div>
                <span className="mt-4 max-w-[120px] text-sm font-black text-[#17131e] md:text-base">
                  {demoUser.name}
                </span>
              </motion.div>

              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: [0, 1.15, 1], rotate: [-30, 8, 0] }}
                transition={{ delay: 0.38, duration: 0.55 }}
                className="z-10 -mx-4 grid size-14 place-items-center rounded-full border-[3px] border-[#17131e] bg-white shadow-[4px_4px_0_#17131e] md:size-18"
              >
                <Heart className="size-7 fill-[#ff347d] text-[#17131e]" aria-hidden="true" />
              </motion.div>

              <motion.div
                initial={{ x: 35, rotate: 10, scale: 0.8 }}
                animate={{ x: 0, rotate: 4, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.18 }}
                className="flex flex-col items-center"
              >
                <div className="relative size-[118px] overflow-hidden rounded-full border-[4px] border-[#17131e] bg-white shadow-[7px_7px_0_#17131e] md:size-[168px]">
                  <Image
                    src={profile.photo}
                    alt={profile.name}
                    fill
                    sizes="168px"
                    className="object-cover"
                  />
                </div>
                <span className="mt-4 max-w-[120px] text-sm font-black text-[#17131e] md:text-base">
                  {profile.name}
                </span>
              </motion.div>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row md:mt-10">
              <button
                type="button"
                onClick={onClose}
                className="h-12 rounded-full border-[3px] border-[#17131e] bg-white px-7 text-sm font-black text-[#17131e] shadow-[5px_5px_0_#17131e] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0_#17131e]"
              >
                Continue discovering
              </button>
              <Link
                href="/matches"
                className="h-12 rounded-full border-[3px] border-[#17131e] bg-[#ffe45c] px-7 text-sm leading-[42px] font-black text-[#17131e] shadow-[5px_5px_0_#17131e] transition hover:-translate-y-0.5"
              >
                View matches
              </Link>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
