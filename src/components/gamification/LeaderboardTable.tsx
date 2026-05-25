import { Flame, Trophy, Zap, BookOpen, Code2, FolderOpen } from "lucide-react";
import { calculateRankTitle } from "@/lib/levels";
import type { LeaderboardEntry } from "@/types";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  className?: string;
}

const MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export function LeaderboardTable({
  entries,
  currentUserId,
  className = "",
}: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center py-16 gap-3 ${className}`}
      >
        <Trophy className="w-10 h-10 text-[#2a2d3e]" />
        <p className="text-[#64748b] text-sm">No leaderboard data yet.</p>
        <p className="text-xs text-[#475569]">
          Complete lessons and challenges to appear here!
        </p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#2a2d3e]">
            <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider w-12">
              #
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider">
              Developer
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 inline text-[#6c63ff] mr-1" />
              XP
            </th>
            <th className="hidden md:table-cell text-right py-3 px-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 inline text-[#10b981] mr-1" />
              Lessons
            </th>
            <th className="hidden md:table-cell text-right py-3 px-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider">
              <Code2 className="w-3.5 h-3.5 inline text-[#f59e0b] mr-1" />
              Challenges
            </th>
            <th className="hidden lg:table-cell text-right py-3 px-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider">
              <FolderOpen className="w-3.5 h-3.5 inline text-[#a855f7] mr-1" />
              Projects
            </th>
            <th className="hidden sm:table-cell text-right py-3 px-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 inline text-[#f97316] mr-1" />
              Streak
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const isMe = entry.userId === currentUserId;
            return (
              <tr
                key={entry.userId}
                className={`border-b border-[#2a2d3e]/50 transition-colors ${
                  isMe
                    ? "bg-[#6c63ff]/5 border-[#6c63ff]/20"
                    : "hover:bg-[#1e2130]/50"
                }`}
              >
                <td className="py-3.5 px-4 text-center">
                  {MEDAL[entry.rank] ? (
                    <span className="text-lg">{MEDAL[entry.rank]}</span>
                  ) : (
                    <span className="text-[#64748b] font-medium">
                      {entry.rank}
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c63ff] to-[#a855f7] flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {entry.displayName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-[#f1f5f9] flex items-center gap-1.5">
                        {entry.displayName}
                        {isMe && (
                          <span className="text-[10px] bg-[#6c63ff]/20 text-[#6c63ff] px-1.5 py-0.5 rounded font-medium">
                            You
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-[#64748b]">
                        Lv.{entry.level} · {calculateRankTitle(entry.level)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-[#6c63ff]">
                  {entry.xp.toLocaleString()}
                </td>
                <td className="hidden md:table-cell py-3.5 px-4 text-right text-[#94a3b8]">
                  {entry.lessonsCompleted}
                </td>
                <td className="hidden md:table-cell py-3.5 px-4 text-right text-[#94a3b8]">
                  {entry.challengesCompleted}
                </td>
                <td className="hidden lg:table-cell py-3.5 px-4 text-right text-[#94a3b8]">
                  {entry.projectsSubmitted}
                </td>
                <td className="hidden sm:table-cell py-3.5 px-4 text-right">
                  <span className="flex items-center justify-end gap-1 text-[#f97316]">
                    <Flame className="w-3.5 h-3.5" />
                    {entry.streak}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
