import { useState, useEffect } from "react";
import { Trophy, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getLeaderboard } from "@/services/gamification";
import { LeaderboardTable } from "@/components/gamification";
import type { LeaderboardEntry } from "@/types";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeaderboard(100);
      setEntries(data);
    } catch {
      setError("Failed to load leaderboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const myEntry = entries.find((e) => e.userId === user?.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#f1f5f9] flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-[#f59e0b]" />
            Leaderboard
          </h1>
          <p className="text-sm text-[#64748b] mt-1">
            Top developers ranked by XP earned
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 text-xs text-[#64748b] hover:text-[#f1f5f9] transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* My rank highlight */}
      {myEntry && (
        <div className="bg-[#6c63ff]/10 border border-[#6c63ff]/30 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6c63ff] to-[#a855f7] flex items-center justify-center text-sm font-bold text-white">
              {myEntry.displayName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#f1f5f9]">Your rank</p>
              <p className="text-xs text-[#94a3b8]">{myEntry.displayName}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-[#6c63ff]">#{myEntry.rank}</p>
            <p className="text-xs text-[#64748b]">
              {myEntry.xp.toLocaleString()} XP
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#6c63ff] animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <AlertCircle className="w-8 h-8 text-[#ef4444]" />
            <p className="text-[#94a3b8] text-sm">{error}</p>
            <button
              onClick={load}
              className="text-xs text-[#6c63ff] hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <LeaderboardTable entries={entries} currentUserId={user?.id} />
        )}
      </div>

      <p className="text-center text-xs text-[#475569]">
        Showing top {entries.length} developers · Updates in real time
      </p>
    </div>
  );
}
