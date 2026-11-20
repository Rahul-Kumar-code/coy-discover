type InterestTagsProps = {
  interests: string[];
};

export function InterestTags({ interests }: InterestTagsProps) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Interests">
      {interests.map((interest) => (
        <li
          key={interest}
          className="rounded-full border-2 border-[#17131e] bg-[#ffe2d2] px-2.5 py-1 text-[10px] font-black text-[#17131e] md:px-3 md:py-1.5 md:text-[11px]"
        >
          {interest}
        </li>
      ))}
    </ul>
  );
}
