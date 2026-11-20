"use client";

import { Heart, X } from "lucide-react";

type SwipeActionsProps = {
  onLike: () => void;
  onPass: () => void;
  disabled?: boolean;
};

export function SwipeActions({ onLike, onPass, disabled }: SwipeActionsProps) {
  return (
    <div className="flex items-center justify-center gap-4" aria-label="Profile actions">
      <button
        type="button"
        onClick={onPass}
        disabled={disabled}
        className="group grid size-[58px] place-items-center rounded-full border-[3px] border-[#17131e] bg-white text-[#17131e] shadow-[5px_5px_0_#17131e] transition duration-200 hover:-translate-y-1 hover:shadow-[7px_7px_0_#17131e] active:translate-y-1 active:shadow-[2px_2px_0_#17131e] disabled:pointer-events-none disabled:opacity-50"
        aria-label="Pass on profile"
      >
        <X
          className="size-6 transition group-hover:scale-110"
          strokeWidth={2.2}
          aria-hidden="true"
        />
      </button>
      <button
        type="button"
        onClick={onLike}
        disabled={disabled}
        className="group grid size-[68px] place-items-center rounded-full border-[3px] border-[#17131e] bg-[#ff347d] text-[#17131e] shadow-[6px_6px_0_#17131e] transition duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0_#17131e] active:translate-y-1 active:shadow-[2px_2px_0_#17131e] disabled:pointer-events-none disabled:opacity-50"
        aria-label="Like profile"
      >
        <Heart
          className="size-7 fill-current transition group-hover:scale-110"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
