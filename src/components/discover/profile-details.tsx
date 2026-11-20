import { MapPin, GraduationCap } from "lucide-react";

import type { Profile } from "@/types";

type ProfileDetailsProps = {
  profile: Profile;
};

export function ProfileDetails({ profile }: ProfileDetailsProps) {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-[26px] leading-none font-black tracking-[-0.045em] text-[#17131e] md:text-[30px]">
          {profile.name}
          <span className="ml-2 font-bold text-[#17131e]/70">{profile.age}</span>
        </h2>
        <span className="mb-0.5 rounded-full border-2 border-[#17131e] bg-[#ffe45c] px-2.5 py-1 text-[10px] font-black tracking-[0.08em] text-[#17131e] uppercase">
          Profile
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-bold text-[#17131e]/70">
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3.5 text-[#ff347d]" aria-hidden="true" />
          {profile.city}
        </span>
        <span className="flex items-center gap-1.5">
          <GraduationCap className="size-3.5 text-[#ff347d]" aria-hidden="true" />
          {profile.college}
        </span>
      </div>
      <p className="mt-3 max-w-[390px] text-[13px] leading-[1.55] font-medium text-[#17131e]/75">
        {profile.bio}
      </p>
    </div>
  );
}
