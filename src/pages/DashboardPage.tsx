import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Star,
  Users,
  Clock,
  Flame,
  Zap,
  TrendingUp,
  Filter,
  AlertCircle,
  BookOpen,
  Play,
  Trophy,
} from "lucide-react";
import { Badge, ProgressBar, PathCardSkeleton } from "@/components/ui";
import { getLearningPaths } from "@/services/learningPaths";
import {
  getAllEnrollments,
  type EnrollmentWithPath,
} from "@/services/progress";
import { getUserChallengeStats } from "@/services/challenges";
import { getUserProjectStats } from "@/services/projects";
import {
  updateDailyStreak,
  checkAndAwardAchievements,
  getUserAchievements,
} from "@/services/gamification";
import { LevelCard, StreakCard } from "@/components/gamification";
import { useAuth } from "@/context/AuthContext";
import type { LearningPath, UserAchievement } from "@/types";

const FILTERS = ["All", "Beginner", "Intermediate", "Advanced"];
const TAGS = [
  "All",
  "Python",
  "JavaScript",
  "React",
  "Algorithms",
  "Security",
  "Cloud",
  "Mobile",
  "AI/ML",
];

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");

  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [enrollments, setEnrollments] = useState<EnrollmentWithPath[]>([]);
  const [challengeStats, setChallengeStats] = useState({
    totalCompleted: 0,
    totalXpFromChallenges: 0,
  });
  const [projectStats, setProjectStats] = useState({
    totalSubmitted: 0,
    totalApproved: 0,
    totalXpFromProjects: 0,
  });
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>(
    [],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFetchError(null);
    getLearningPaths().then(({ data, error }) => {
      if (cancelled) return;
      if (error) {
        setFetchError(error);
      } else {
        setPaths(data ?? []);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getAllEnrollments(user.id).then(({ data }) => {
      if (!cancelled) setEnrollments(data);
    });
    getUserChallengeStats(user.id).then((s) => {
      if (!cancelled)
        setChallengeStats({
          totalCompleted: s.totalCompleted,
          totalXpFromChallenges: s.totalXpFromChallenges,
        });
    });
    getUserProjectStats(user.id).then((s) => {
      if (!cancelled)
        setProjectStats({
          totalSubmitted: s.totalSubmitted,
          totalApproved: s.totalApproved,
          totalXpFromProjects: s.totalXpFromProjects,
        });
    });
    getUserAchievements(user.id).then((data) => {
      if (!cancelled) setUserAchievements(data);
    });
    // Update daily streak + check achievements on dashboard visit
    updateDailyStreak(user.id);
    checkAndAwardAchievements(user.id);
    return () => {
      cancelled = true;
    };
  }, [user]);

  const firstName =
    profile?.username || user?.email?.split("@")[0] || "Developer";
  const totalLessonsDone = enrollments.reduce(
    (sum, e) => sum + e.completedLessonIds.length,
    0,
  );
  const progressMap = new Map(
    enrollments.map((e) => [e.pathId, e.progressPercent]),
  );

  const filtered = paths.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchDiff =
      diffFilter === "All" || p.difficulty === diffFilter.toLowerCase();
    const matchTag =
      tagFilter === "All" ||
      p.tags.some((t) => t.toLowerCase().includes(tagFilter.toLowerCase()));
    return matchSearch && matchDiff && matchTag;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Greeting banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#6c63ff]/20 via-[#1e2130] to-[#a855f7]/10 border border-[#6c63ff]/30 rounded-2xl p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6c63ff]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-[#94a3b8] text-sm mb-1">Welcome back,</p>
            <h1 className="text-2xl md:text-3xl font-bold text-[#f1f5f9] mb-2 capitalize">
              {firstName} 👋
            </h1>
            <p className="text-[#64748b] text-sm">
              Pick a path and continue building your skills. You've got this!
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end gap-3 shrink-0">
            <div className="flex items-center gap-2 bg-[#0f1117]/60 border border-[#2a2d3e] rounded-xl px-4 py-2.5 text-sm">
              <Flame className="w-4 h-4 text-[#f97316]" />
              <span className="text-[#94a3b8]">
                {profile?.streak ?? 0} day streak
              </span>
            </div>
            <div className="flex items-center gap-2 bg-[#0f1117]/60 border border-[#2a2d3e] rounded-xl px-4 py-2.5 text-sm">
              <Zap className="w-4 h-4 text-[#6c63ff]" />
              <span className="text-[#94a3b8]">
                {(profile?.xp ?? 0).toLocaleString()} XP earned
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Paths Enrolled",
            value: String(enrollments.length),
            icon: TrendingUp,
            color: "#6c63ff",
          },
          {
            label: "Lessons Done",
            value: String(totalLessonsDone),
            icon: Zap,
            color: "#10b981",
          },
          {
            label: "Current XP",
            value: (profile?.xp ?? 0).toLocaleString(),
            icon: Star,
            color: "#f59e0b",
          },
          {
            label: "Day Streak",
            value: String(profile?.streak ?? 0),
            icon: Flame,
            color: "#f97316",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#64748b]">{label}</span>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color }} />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#f1f5f9]">{value}</div>
          </div>
        ))}
      </div>

      {/* Gamification row: Level + Streak + Recent Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LevelCard xp={profile?.xp ?? 0} />
        <StreakCard streak={profile?.streak ?? 0} />
        <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-[#f1f5f9] flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#f59e0b]" />
            Recent Achievements
            <span className="ml-auto text-xs text-[#64748b]">
              {userAchievements.length} earned
            </span>
          </h3>
          {userAchievements.length === 0 ? (
            <p className="text-xs text-[#64748b]">
              Complete your first lesson to unlock achievements!
            </p>
          ) : (
            <div className="space-y-1.5">
              {userAchievements.slice(0, 3).map((ua) => (
                <div
                  key={ua.id}
                  className="flex items-center gap-2 text-xs text-[#94a3b8]"
                >
                  <span className="text-base">{ua.achievement.icon}</span>
                  <span className="truncate">{ua.achievement.name}</span>
                  <span className="ml-auto text-[#6c63ff] shrink-0 font-medium">
                    +{ua.achievement.xpReward} XP
                  </span>
                </div>
              ))}
              {userAchievements.length > 3 && (
                <Link
                  to="/profile"
                  className="text-[10px] text-[#6c63ff] hover:underline"
                >
                  View all {userAchievements.length} →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Continue Learning */}
      {enrollments.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#f1f5f9]">
              Continue Learning
            </h2>
            <span className="text-xs text-[#64748b]">
              {enrollments.length} path{enrollments.length !== 1 ? "s" : ""}{" "}
              enrolled
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.slice(0, 3).map((e) => (
              <Link
                key={e.pathId}
                to={`/paths/${e.pathSlug}/lesson/start`}
                className="group flex items-center gap-4 bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-4 hover:border-[#6c63ff]/60 transition-all"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: `${e.pathColor}20` }}
                >
                  {e.pathIcon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#f1f5f9] truncate group-hover:text-[#6c63ff] transition-colors">
                    {e.pathTitle}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <ProgressBar
                      value={e.progressPercent}
                      size="sm"
                      className="flex-1"
                    />
                    <span className="text-xs text-[#6c63ff] shrink-0">
                      {e.progressPercent}%
                    </span>
                  </div>
                  <p className="text-[10px] text-[#64748b] mt-1">
                    {e.completedLessonIds.length} / {e.totalLessons} lessons
                  </p>
                </div>
                <Play className="w-4 h-4 text-[#6c63ff] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* My Challenges */}
      {challengeStats.totalCompleted > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#f1f5f9]">My Challenges</h2>
            <Link
              to="/challenges"
              className="text-xs text-[#6c63ff] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-5">
              <div className="w-8 h-8 rounded-xl bg-[#10b981]/15 flex items-center justify-center mb-2">
                <BookOpen className="w-4 h-4 text-[#10b981]" />
              </div>
              <p className="text-2xl font-bold text-[#f1f5f9]">
                {challengeStats.totalCompleted}
              </p>
              <p className="text-xs text-[#64748b] mt-0.5">Challenges solved</p>
            </div>
            <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-5">
              <div className="w-8 h-8 rounded-xl bg-[#6c63ff]/15 flex items-center justify-center mb-2">
                <Zap className="w-4 h-4 text-[#6c63ff]" />
              </div>
              <p className="text-2xl font-bold text-[#f1f5f9]">
                {challengeStats.totalXpFromChallenges}
              </p>
              <p className="text-xs text-[#64748b] mt-0.5">
                XP from challenges
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-5 flex items-center justify-center">
              <Link
                to="/challenges"
                className="text-sm font-semibold text-[#6c63ff] hover:text-[#5a52e0] transition-colors"
              >
                Solve more →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* My Projects */}
      {projectStats.totalSubmitted > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#f1f5f9]">My Projects</h2>
            <Link
              to="/portfolio"
              className="text-xs text-[#6c63ff] hover:underline"
            >
              View portfolio
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-5">
              <div className="w-8 h-8 rounded-xl bg-[#6c63ff]/15 flex items-center justify-center mb-2">
                <TrendingUp className="w-4 h-4 text-[#6c63ff]" />
              </div>
              <p className="text-2xl font-bold text-[#f1f5f9]">
                {projectStats.totalSubmitted}
              </p>
              <p className="text-xs text-[#64748b] mt-0.5">Submitted</p>
            </div>
            <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-5">
              <div className="w-8 h-8 rounded-xl bg-[#10b981]/15 flex items-center justify-center mb-2">
                <Star className="w-4 h-4 text-[#10b981]" />
              </div>
              <p className="text-2xl font-bold text-[#f1f5f9]">
                {projectStats.totalApproved}
              </p>
              <p className="text-xs text-[#64748b] mt-0.5">Approved</p>
            </div>
            <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-5">
              <div className="w-8 h-8 rounded-xl bg-[#f59e0b]/15 flex items-center justify-center mb-2">
                <Zap className="w-4 h-4 text-[#f59e0b]" />
              </div>
              <p className="text-2xl font-bold text-[#f1f5f9]">
                {projectStats.totalXpFromProjects}
              </p>
              <p className="text-xs text-[#64748b] mt-0.5">XP earned</p>
            </div>
            <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-5 flex items-center justify-center">
              <Link
                to="/projects"
                className="text-sm font-semibold text-[#6c63ff] hover:text-[#5a52e0] transition-colors"
              >
                View projects →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Community Widget */}
      <div className="bg-gradient-to-br from-[#1e2130] to-[#252840] border border-[#2a2d3e] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#6c63ff]/20 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5 text-[#6c63ff]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#f1f5f9]">
            Community Showcase
          </h3>
          <p className="text-xs text-[#64748b] mt-0.5">
            Share your projects and discover what other learners are building
          </p>
        </div>
        <Link
          to="/community"
          className="shrink-0 px-4 py-2 bg-[#6c63ff] hover:bg-[#5b52e8] rounded-lg text-sm font-medium text-white transition-colors"
        >
          Explore Community →
        </Link>
      </div>

      {/* Paths section */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#f1f5f9]">
              All Learning Paths
            </h2>
            <p className="text-sm text-[#64748b] mt-0.5">
              {filtered.length} paths available
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            <input
              type="search"
              placeholder="Search paths, tags…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1e2130] border border-[#2a2d3e] rounded-lg pl-9 pr-4 py-2 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#6c63ff]"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
            <Filter className="w-3.5 h-3.5" />
            Difficulty:
          </div>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setDiffFilter(f)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                diffFilter === f
                  ? "bg-[#6c63ff]/20 border-[#6c63ff] text-[#6c63ff]"
                  : "bg-transparent border-[#2a2d3e] text-[#64748b] hover:border-[#6c63ff]/50"
              }`}
            >
              {f}
            </button>
          ))}

          <div className="flex items-center gap-1.5 text-xs text-[#64748b] ml-4">
            Tag:
          </div>
          {TAGS.map((t) => (
            <button
              key={t}
              onClick={() => setTagFilter(t)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                tagFilter === t
                  ? "bg-[#6c63ff]/20 border-[#6c63ff] text-[#6c63ff]"
                  : "bg-transparent border-[#2a2d3e] text-[#64748b] hover:border-[#6c63ff]/50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <PathCardSkeleton key={i} />
            ))}
          </div>
        ) : fetchError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#ef4444]/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-[#ef4444]" />
            </div>
            <div>
              <p className="text-[#f1f5f9] font-medium mb-1">
                Failed to load learning paths
              </p>
              <p className="text-xs text-[#64748b] max-w-sm">{fetchError}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-[#6c63ff] hover:underline"
            >
              Try again
            </button>
          </div>
        ) : filtered.length === 0 && paths.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#6c63ff]/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-[#6c63ff]" />
            </div>
            <div>
              <p className="text-[#f1f5f9] font-medium mb-1">
                No learning paths yet
              </p>
              <p className="text-xs text-[#64748b]">
                Run the seed SQL in Supabase to populate the database.
              </p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-[#64748b]">
            <Search className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p>No paths match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((path) => (
              <Link key={path.id} to={`/paths/${path.slug}`} className="group">
                <div className="h-full bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-6 hover:border-[#6c63ff] hover:shadow-[0_0_24px_rgba(108,99,255,0.12)] transition-all duration-200 flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ backgroundColor: `${path.color}20` }}
                    >
                      {path.icon}
                    </div>
                    <Badge
                      variant={
                        path.difficulty === "beginner"
                          ? "success"
                          : path.difficulty === "intermediate"
                            ? "warning"
                            : "danger"
                      }
                    >
                      {path.difficulty}
                    </Badge>
                  </div>

                  <h3 className="text-base font-semibold text-[#f1f5f9] mb-2 group-hover:text-[#6c63ff] transition-colors">
                    {path.title}
                  </h3>
                  <p className="text-xs text-[#64748b] leading-relaxed mb-4 flex-1 line-clamp-2">
                    {path.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {path.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-[#2a2d3e] text-[#94a3b8]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Progress bar (real % if enrolled) */}
                  <ProgressBar
                    value={progressMap.get(path.id) ?? 0}
                    size="sm"
                    className="mb-4"
                  />

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-[#64748b]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {path.estimatedTimeline}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {path.enrolled?.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#f59e0b] text-[#f59e0b]" />
                      {path.rating}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
