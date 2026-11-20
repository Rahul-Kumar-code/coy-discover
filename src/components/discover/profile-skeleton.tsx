export function ProfileSkeleton() {
  return (
    <div
      aria-label="Loading profile"
      className="h-[clamp(420px,calc(100dvh-300px),500px)] w-full max-w-[390px] animate-pulse overflow-hidden rounded-[26px] border-[3px] border-[#17131e] bg-white shadow-[7px_8px_0_#17131e] md:h-[600px] md:max-w-[420px] md:rounded-[28px] md:shadow-[8px_9px_0_#17131e]"
    >
      <div className="h-[62%] bg-[#e9e9e9]" />
      <div className="space-y-3 px-5 py-5">
        <div className="h-7 w-40 rounded-full bg-[#292e3b]" />
        <div className="h-3 w-52 rounded-full bg-[#252a36]" />
        <div className="h-12 w-full rounded-xl bg-[#222733]" />
        <div className="flex gap-2">
          <div className="h-7 w-20 rounded-full bg-[#292e3b]" />
          <div className="h-7 w-24 rounded-full bg-[#292e3b]" />
        </div>
      </div>
    </div>
  );
}
