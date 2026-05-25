import { CheckCircle, Layers } from "lucide-react";
import { ProgressBar } from "@/components/ui";

interface ProjectProgressProps {
  total: number;
  submitted: number;
  approved: number;
  xpAvailable: number;
  xpEarned: number;
  pathColor: string;
}

export function ProjectProgress({
  total,
  submitted,
  approved,
  xpAvailable,
  xpEarned,
  pathColor,
}: ProjectProgressProps) {
  const pct = total > 0 ? Math.round((submitted / total) * 100) : 0;

  return (
    <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-4 h-4 text-[#94a3b8]" />
        <span className="text-sm font-semibold text-[#f1f5f9]">
          Project Progress
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className="text-xl font-bold text-[#f1f5f9]">{total}</div>
          <div className="text-[10px] text-[#64748b] mt-0.5">Total</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-[#6c63ff]">{submitted}</div>
          <div className="text-[10px] text-[#64748b] mt-0.5">Submitted</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-[#10b981]">{approved}</div>
          <div className="text-[10px] text-[#64748b] mt-0.5">Approved</div>
        </div>
      </div>

      <ProgressBar
        value={pct}
        size="sm"
        colorClass="bg-gradient-to-r from-[#6c63ff] to-[#a855f7]"
      />

      {/* XP summary */}
      <div className="flex items-center justify-between mt-4 text-xs text-[#64748b]">
        <div className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: pathColor }}
          />
          <span>
            {xpEarned} / {xpAvailable} XP earned
          </span>
        </div>
        {submitted === total && total > 0 && (
          <div className="flex items-center gap-1 text-[#10b981] font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            All submitted!
          </div>
        )}
      </div>
    </div>
  );
}
