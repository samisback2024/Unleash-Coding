import type { LucideIcon } from "lucide-react";

interface ActivityStatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  sub?: string;
  color?: string;
  trend?: "up" | "down" | "neutral";
}

export function ActivityStatsCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "#6c63ff",
}: ActivityStatsCardProps) {
  return (
    <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-xl p-4 flex items-start gap-3">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{
          backgroundColor: `${color}18`,
          border: `1px solid ${color}30`,
        }}
      >
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-[#64748b] mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-[#f1f5f9] leading-none">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        {sub && <p className="text-xs text-[#64748b] mt-1">{sub}</p>}
      </div>
    </div>
  );
}
