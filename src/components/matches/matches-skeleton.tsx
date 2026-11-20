export function MatchesSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading matches">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-[24px] border-[3px] border-[#17131e] bg-white shadow-[7px_7px_0_#17131e]"
        >
          <div className="aspect-[4/3.15] border-b-[3px] border-[#17131e] bg-[#e9e9e9]" />
          <div className="space-y-3 p-5">
            <div className="h-6 w-2/3 rounded-full bg-[#e9e9e9]" />
            <div className="h-3 w-1/2 rounded-full bg-[#eeeeee]" />
            <div className="h-10 rounded-xl bg-[#f0f0f0]" />
            <div className="flex gap-2">
              <div className="h-7 w-16 rounded-full bg-[#e9e9e9]" />
              <div className="h-7 w-20 rounded-full bg-[#e9e9e9]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
