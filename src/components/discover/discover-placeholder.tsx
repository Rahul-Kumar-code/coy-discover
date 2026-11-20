"use client";

import { motion } from "framer-motion";
import { Compass } from "lucide-react";

export function DiscoverPlaceholder() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-5 pt-8 pb-28 md:min-h-dvh md:px-10 md:pb-10">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative flex w-full max-w-[520px] flex-col items-center overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#151925]/80 px-6 py-10 text-center shadow-[0_30px_90px_rgba(0,0,0,0.34)] backdrop-blur md:py-14"
        aria-labelledby="discover-heading"
      >
        <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#9d7af2]/70 to-transparent" />
        <div className="grid size-14 place-items-center rounded-[18px] bg-gradient-to-br from-[#806ae5] to-[#a278ef] text-white shadow-[0_14px_38px_rgba(124,102,232,0.28)]">
          <Compass className="size-6" strokeWidth={1.8} aria-hidden="true" />
        </div>
        <h1
          id="discover-heading"
          className="mt-7 text-[28px] font-semibold tracking-[-0.035em] text-white"
        >
          Discover
        </h1>
        <p className="mt-3 max-w-[340px] text-sm leading-6 text-[#969aac]">
          The discovery experience is ready to be built.
        </p>
      </motion.section>
    </div>
  );
}
