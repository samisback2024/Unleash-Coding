import { calculateRankTitle } from "@/lib/levels";

interface RankTitleBadgeProps {
  level: number;
  className?: string;
}

export function RankTitleBadge({ level, className = "" }: RankTitleBadgeProps) {
  const title = calculateRankTitle(level);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#6c63ff]/15 text-[#a78bfa] border border-[#6c63ff]/30 ${className}`}
    >
      {title}
    </span>
  );
}
