"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ImageOff } from "lucide-react";

import type { Profile } from "@/types";
import { InterestTags } from "@/components/discover/interest-tags";
import { ProfileDetails } from "@/components/discover/profile-details";

type ProfileCardProps = {
  profile: Profile;
  disabled?: boolean;
  onSwipe: (action: "LIKE" | "PASS") => void;
  swipeFeedback?: "LIKE" | "PASS" | null;
};

export function ProfileCard({ profile, disabled, onSwipe, swipeFeedback }: ProfileCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, time: 0 });

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (disabled) return;
    dragStartRef.current = { x: event.clientX, time: performance.now() };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!dragging || disabled) return;
    setOffset(event.clientX - dragStartRef.current.x);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    if (!dragging || disabled) return;

    const finalOffset = event.clientX - dragStartRef.current.x;
    const elapsed = Math.max(performance.now() - dragStartRef.current.time, 1);
    const velocity = finalOffset / elapsed;
    const shouldSwipe = Math.abs(finalOffset) > 110 || Math.abs(velocity) * 1000 > 700;

    setDragging(false);

    if (shouldSwipe) {
      onSwipe(finalOffset > 0 || velocity > 0 ? "LIKE" : "PASS");
    } else {
      setOffset(0);
    }
  };

  const likeOpacity = swipeFeedback === "LIKE" ? 1 : Math.min(Math.max(offset / 110, 0), 1);
  const passOpacity = swipeFeedback === "PASS" ? 1 : Math.min(Math.max(-offset / 110, 0), 1);
  const exitOffset = swipeFeedback === "LIKE" ? 380 : swipeFeedback === "PASS" ? -380 : offset;
  const rotation =
    swipeFeedback === "LIKE" ? 10 : swipeFeedback === "PASS" ? -10 : offset / 34;

  return (
    <article
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        setDragging(false);
        setOffset(0);
      }}
      className="relative z-10 h-[clamp(420px,calc(100dvh-300px),500px)] w-full max-w-[390px] cursor-grab touch-pan-y overflow-hidden rounded-[26px] border-[3px] border-[#17131e] bg-white shadow-[7px_8px_0_#17131e] select-none md:h-[600px] md:max-w-[420px] md:rounded-[28px] md:shadow-[8px_9px_0_#17131e]"
      style={{
        display: "block",
        position: "relative",
        width: "390px",
        maxWidth: "calc(100vw - 40px)",
        height: "520px",
        maxHeight: "calc(100dvh - 250px)",
        opacity: 1,
        visibility: "visible",
        zIndex: 20,
        background: "#ffffff",
        border: "3px solid #17131e",
        borderRadius: "26px",
        boxShadow: "7px 8px 0 #17131e",
        overflow: "hidden",
        transform: `translate3d(${exitOffset}px, 0, 0) rotate(${rotation}deg)`,
        transition: dragging
          ? "none"
          : swipeFeedback
            ? "transform 380ms cubic-bezier(.22,1,.36,1)"
            : "transform 220ms cubic-bezier(.22,1,.36,1)",
      }}
    >
      <div className="absolute inset-0 bg-[#ffe2d2]" />

      {!imageFailed ? (
        <Image
          src={profile.photo}
          alt={`${profile.name}, age ${profile.age}`}
          fill
          sizes="(max-width: 768px) calc(100vw - 40px), 420px"
          className="object-cover object-[50%_24%]"
          priority
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div
          className="absolute inset-0 grid place-items-center bg-[#ffe2d2] text-[#17131e]"
          role="img"
          aria-label="Profile photo unavailable"
        >
          <div className="flex flex-col items-center gap-3">
            <ImageOff className="size-8" aria-hidden="true" />
            <span className="text-xs">Photo unavailable</span>
          </div>
        </div>
      )}

      <div className="absolute inset-x-3 bottom-3 rounded-[18px] border-[3px] border-[#17131e] bg-white p-4 shadow-[5px_5px_0_#17131e] md:inset-x-4 md:bottom-4 md:rounded-[20px] md:p-5">
        <ProfileDetails profile={profile} />
        <div className="mt-4">
          <InterestTags interests={profile.interests} />
        </div>
      </div>

      <div
        className="absolute top-8 right-6 z-20 rotate-6 rounded-xl border-[3px] border-[#17131e] bg-[#ff347d] px-4 py-2 text-sm font-black tracking-[0.12em] text-[#17131e] uppercase"
        style={{ opacity: likeOpacity }}
        aria-hidden="true"
      >
        LIKE
      </div>
      <div
        className="absolute top-8 left-6 z-20 -rotate-6 rounded-xl border-[3px] border-[#17131e] bg-white px-4 py-2 text-sm font-black tracking-[0.12em] text-[#17131e] uppercase"
        style={{ opacity: passOpacity }}
        aria-hidden="true"
      >
        PASS
      </div>
    </article>
  );
}
