"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, MapPin } from "lucide-react";
import { useState } from "react";

import type { Profile } from "@/types";

type MatchCardProps = {
  profile: Profile;
  index: number;
};

export function MatchCard({ profile, index }: MatchCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.38 }}
      className="group overflow-hidden rounded-[24px] border-[3px] border-[#17131e] bg-white shadow-[7px_7px_0_#17131e] transition duration-200 hover:-translate-y-1 hover:shadow-[9px_10px_0_#17131e]"
    >
      <div className="relative aspect-[4/3.15] overflow-hidden border-b-[3px] border-[#17131e] bg-[#ffe2d2]">
        {!imageFailed ? (
          <Image
            src={profile.photo}
            alt={`${profile.name}, age ${profile.age}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className="absolute inset-0 grid place-items-center bg-[#ffe2d2] text-sm font-black text-[#17131e]"
            role="img"
            aria-label="Profile photo unavailable"
          >
            Photo unavailable
          </div>
        )}
        <span className="absolute top-3 right-3 grid size-10 place-items-center rounded-full border-[3px] border-[#17131e] bg-[#ffe45c] text-[#17131e] shadow-[3px_3px_0_#17131e]">
          <Heart className="size-4 fill-[#ff347d]" aria-hidden="true" />
        </span>
      </div>

      <div className="p-5">
        <h2 className="text-[24px] leading-none font-black tracking-[-0.04em] text-[#17131e]">
          {profile.name}
          <span className="ml-2 text-[#17131e]/55">{profile.age}</span>
        </h2>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs font-black text-[#17131e]/65">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-[#ff347d]" aria-hidden="true" />
            {profile.city}
          </span>
          <span>{profile.college}</span>
        </div>

        <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 font-medium text-[#17131e]/70">
          {profile.bio}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Interests">
          {profile.interests.slice(0, 3).map((interest) => (
            <li
              key={interest}
              className="rounded-full border-2 border-[#17131e] bg-[#ffe2d2] px-2.5 py-1 text-[10px] font-black text-[#17131e]"
            >
              {interest}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}
