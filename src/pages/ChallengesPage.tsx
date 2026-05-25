import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, CheckCircle, BookOpen, Filter } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getChallengesWithStatus,
  getUserChallengeStats,
} from "@/services/challenges";
import { ChallengeCard } from "@/components/challenge";
import { ChallengeProgress } from "@/components/challenge";
import type { ChallengeWithStatus } from "@/types";
import { supabase } from "@/lib/supabase";

type DiffFilter = "all" | "beginner" | "intermediate" | "advanced";

interface PathGroup {
  id: string;
  title: string;
  slug: string;
  color: string;
  challenges: ChallengeWithStatus[];
}

export default function ChallengesPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<PathGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [diff, setDiff] = useState<DiffFilter>("all");
  const [stats, setStats] = useState({
    totalCompleted: 0,
    totalXpFromChallenges: 0,
  });

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any;

      // Get enrolled paths
      const { data: enrollments } = await db
        .from("user_progress")
        .select("path_id")
        .eq("user_id", user!.id);

      if (!enrollments?.length) {
        if (!cancelled) setLoading(false);
        return;
      }

      const pathIds: string[] = enrollments.map(
        (e: { path_id: string }) => e.path_id,
      );

      // Get path metadata
      const { data: paths } = await db
        .from("learning_paths")
        .select("id, title, slug, color")
        .in("id", pathIds);

      if (!paths?.length) {
        if (!cancelled) setLoading(false);
        return;
      }

      // Fetch challenges for each path
      const groupResults: PathGroup[] = [];
      for (const path of paths) {
        const { data: challenges } = await getChallengesWithStatus(
          path.id,
          user!.id,
        );
        if (challenges.length > 0) {
          groupResults.push({
            id: path.id,
            title: path.title,
            slug: path.slug,
            color: path.color,
            challenges,
          });
        }
      }

      const statsResult = await getUserChallengeStats(user!.id);

      if (!cancelled) {
        setGroups(groupResults);
        setStats({
          totalCompleted: statsResult.totalCompleted,
          totalXpFromChallenges: statsResult.totalXpFromChallenges,
        });
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const allChallenges = groups.flatMap((g) =>
    g.challenges.map((c) => ({ ...c, slug: g.slug })),
  );
  const displayGroups =
    activeTab === "all" ? groups : groups.filter((g) => g.id === activeTab);

  const totalChallenges = allChallenges.length;
  const completedCount = allChallenges.filter((c) => c.isCompleted).length;

  function filterChallenges(challenges: ChallengeWithStatus[]) {
    if (diff === "all") return challenges;
    return challenges.filter((c) => c.difficulty === diff);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-[#1e2130] rounded-xl w-48" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-[#1e2130] rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-[#1e2130] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#f1f5f9]">Challenges</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Prove your skills, earn XP, and track your progress.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#6c63ff]/15 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-[#6c63ff]" />
          </div>
          <div>
            <p className="text-xl font-bold text-[#f1f5f9]">{completedCount}</p>
            <p className="text-xs text-[#64748b]">Solved</p>
          </div>
        </div>
        <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-[#10b981]" />
          </div>
          <div>
            <p className="text-xl font-bold text-[#f1f5f9]">
              {totalChallenges}
            </p>
            <p className="text-xs text-[#64748b]">Total</p>
          </div>
        </div>
        <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-5 flex items-center gap-4 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/15 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-[#f59e0b]" />
          </div>
          <div>
            <p className="text-xl font-bold text-[#f1f5f9]">
              {stats.totalXpFromChallenges}
            </p>
            <p className="text-xs text-[#64748b]">XP from challenges</p>
          </div>
        </div>
      </div>

      {/* No enrollments */}
      {groups.length === 0 && (
        <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#6c63ff]/10 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-[#6c63ff]" />
          </div>
          <h2 className="text-lg font-semibold text-[#f1f5f9] mb-2">
            No challenges yet
          </h2>
          <p className="text-sm text-[#64748b] mb-5">
            Enroll in a learning path to unlock challenges.
          </p>
          <Link
            to="/paths"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6c63ff] hover:bg-[#5a52e0] text-white text-sm font-semibold transition-colors"
          >
            Browse Paths
          </Link>
        </div>
      )}

      {groups.length > 0 && (
        <>
          {/* Tabs + filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === "all"
                    ? "bg-[#6c63ff] text-white"
                    : "bg-[#1e2130] text-[#64748b] hover:text-[#f1f5f9] border border-[#2a2d3e]"
                }`}
              >
                All Paths
              </button>
              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActiveTab(g.id)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === g.id
                      ? "bg-[#6c63ff] text-white"
                      : "bg-[#1e2130] text-[#64748b] hover:text-[#f1f5f9] border border-[#2a2d3e]"
                  }`}
                >
                  {g.title}
                </button>
              ))}
            </div>
            <div className="sm:ml-auto flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#64748b]" />
              <select
                value={diff}
                onChange={(e) => setDiff(e.target.value as DiffFilter)}
                className="bg-[#1e2130] border border-[#2a2d3e] rounded-xl text-sm text-[#94a3b8] px-3 py-1.5 focus:outline-none focus:border-[#6c63ff]"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Challenge groups */}
          <div className="space-y-8">
            {displayGroups.map((group) => {
              const filtered = filterChallenges(group.challenges);
              const completed = group.challenges.filter(
                (c) => c.isCompleted,
              ).length;
              const xpEarned = group.challenges
                .filter((c) => c.isCompleted)
                .reduce((s, c) => s + c.xpReward, 0);
              const xpTotal = group.challenges.reduce(
                (s, c) => s + c.xpReward,
                0,
              );

              return (
                <div key={group.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: group.color }}
                    />
                    <h2 className="text-lg font-semibold text-[#f1f5f9]">
                      {group.title}
                    </h2>
                    <span className="text-xs text-[#64748b]">
                      {completed}/{group.challenges.length} solved
                    </span>
                  </div>

                  <ChallengeProgress
                    total={group.challenges.length}
                    completed={completed}
                    xpAvailable={xpTotal}
                    xpEarned={xpEarned}
                    pathColor={group.color}
                  />

                  {filtered.length === 0 ? (
                    <p className="text-sm text-[#64748b] py-4">
                      No challenges match this filter.
                    </p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {filtered.map((ch) => (
                        <ChallengeCard
                          key={ch.id}
                          challenge={ch}
                          slug={group.slug}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
