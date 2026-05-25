import type { LucideIcon } from "lucide-react";

interface AdminStatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color?: string;
  subtext?: string;
}

export default function AdminStatsCard({
  icon: Icon,
  label,
  value,
  color = "#6c63ff",
  subtext,
}: AdminStatsCardProps) {
  return (
    <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-xl p-5 flex items-start gap-4">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-[#f1f5f9]">{value}</p>
        <p className="text-sm text-[#94a3b8] mt-0.5">{label}</p>
        {subtext && <p className="text-xs text-[#64748b] mt-1">{subtext}</p>}
      </div>
    </div>
  );
}
