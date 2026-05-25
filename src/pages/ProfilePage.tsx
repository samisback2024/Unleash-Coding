import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  Flame,
  Trophy,
  BookOpen,
  Code2,
  Calendar,
  Edit3,
  FolderOpen,
  CheckCircle,
} from "lucide-react";
import { Button, ProgressBar } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import {
  getAllEnrollments,
  type EnrollmentWithPath,
} from "@/services/progress";
import { getUserChallengeStats } from "@/services/challenges";
import { getUserProjectStats } from "@/services/projects";
import {
  getUserAchievements,
  checkAndAwardAchievements,
} from "@/services/gamification";
import {
  LevelCard,
  BadgeGrid,
  RankTitleBadge,
} from "@/components/gamification";
import type { UserAchievement } from "@/types";

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const [editMode, setEditMode] = useState(false);
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
    if (!user) return;
    getAllEnrollments(user.id).then(({ data }) => setEnrollments(data));
    getUserChallengeStats(user.id).then((s) =>
      setChallengeStats({
        totalCompleted: s.totalCompleted,
        totalXpFromChallenges: s.totalXpFromChallenges,
      }),
    );
    getUserProjectStats(user.id).then((s) =>
      setProjectStats({
        totalSubmitted: s.totalSubmitted,
        totalApproved: s.totalApproved,
        totalXpFromProjects: s.totalXpFromProjects,
      }),
    );
    getUserAchievements(user.id).then((data) => setUserAchievements(data));
    checkAndAwardAchievements(user.id);
  }, [user]);

  const username =
    profile?.username || user?.email?.split("@")[0] || "developer";
  const email = user?.email ?? "";
  const totalLessonsDone = enrollments.reduce(
    (sum, e) => sum + e.completedLessonIds.length,
    0,
  );

  const stats = {
    xp: profile?.xp ?? 0,
    level: profile?.level ?? 1,
    streak: profile?.streak ?? 0,
    lessonsCompleted: totalLessonsDone,
    challengesSolved: challengeStats.totalCompleted,
    pathsEnrolled: enrollments.length,
    joinedAt: user?.created_at ?? new Date().toISOString(),
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Profile hero */}
      <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl overflow-hidden">
        {/* Cover gradient */}
        <div className="h-28 bg-gradient-to-r from-[#6c63ff]/30 via-[#a855f7]/20 to-[#38bdf8]/20" />

        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10 mb-6">
            {/* Avatar */}
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6c63ff] to-[#a855f7] flex items-center justify-center text-3xl font-bold text-white border-4 border-[#1e2130] shrink-0">
              {username.slice(0, 2).toUpperCase()}
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditMode((v) => !v)}
            >
              <Edit3 className="w-3.5 h-3.5" />
              {editMode ? "Save Profile" : "Edit Profile"}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-[#f1f5f9] capitalize flex items-center gap-2 flex-wrap">
                {username}
                <RankTitleBadge level={stats.level} />
              </h1>
              <p className="text-sm text-[#64748b]">{email}</p>
              <p className="text-sm text-[#94a3b8] mt-2 max-w-md">
                Full-stack developer on a mission to master the craft. Currently
                focused on React & Node.js.
              </p>
              <div className="flex items-center gap-3 mt-3 text-xs text-[#64748b]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined{" "}
                  {new Date(stats.joinedAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: Zap,
            label: "Total XP",
            value: stats.xp.toLocaleString(),
            color: "#6c63ff",
          },
          {
            icon: Flame,
            label: "Day Streak",
            value: `${stats.streak}`,
            color: "#f97316",
          },
          {
            icon: BookOpen,
            label: "Lessons Done",
            value: `${stats.lessonsCompleted}`,
            color: "#10b981",
          },
          {
            icon: Code2,
            label: "Challenges",
            value: `${stats.challengesSolved}`,
            color: "#f59e0b",
          },
        ].map(({ icon: Icon, label, value, color }) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Level & XP */}
        <LevelCard xp={stats.xp} />

        {/* Badges */}
        <div className="lg:col-span-2 bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-[#f1f5f9] flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-[#f59e0b]" />
            Achievements
            <span className="ml-auto text-xs text-[#64748b]">
              {userAchievements.length} earned
            </span>
          </h2>
          <BadgeGrid achievements={userAchievements} />
        </div>
      </div>

      {/* Portfolio Projects */}
      {projectStats.totalSubmitted > 0 && (
        <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#f1f5f9] flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-[#6c63ff]" />
              Portfolio Projects
            </h2>
            <Link
              to="/portfolio"
              className="text-xs text-[#6c63ff] hover:text-[#a855f7] transition-colors"
            >
              View portfolio →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#0f1117] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#6c63ff]">
                {projectStats.totalSubmitted}
              </div>
              <div className="text-[10px] text-[#64748b] mt-1">Submitted</div>
            </div>
            <div className="bg-[#0f1117] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#10b981] flex items-center justify-center gap-1">
                <CheckCircle className="w-5 h-5" />
                {projectStats.totalApproved}
              </div>
              <div className="text-[10px] text-[#64748b] mt-1">Approved</div>
            </div>
            <div className="bg-[#0f1117] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#f59e0b] flex items-center justify-center gap-1">
                <Zap className="w-4 h-4" />
                {projectStats.totalXpFromProjects}
              </div>
              <div className="text-[10px] text-[#64748b] mt-1">XP earned</div>
            </div>
          </div>
        </div>
      )}

      {/* Enrolled paths */}
      <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#f1f5f9] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#6c63ff]" />
            Learning Paths
          </h2>
          <Link
            to="/dashboard"
            className="text-xs text-[#6c63ff] hover:text-[#a855f7] transition-colors"
          >
            Browse all →
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-xl bg-[#6c63ff]/10 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-[#6c63ff]/50" />
            </div>
            <p className="text-sm text-[#64748b] mb-4">
              You haven't started any paths yet.
            </p>
            <Link to="/dashboard">
              <Button size="sm">Explore Paths</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((e) => (
              <Link
                key={e.pathId}
                to={`/paths/${e.pathSlug}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-[#2a2d3e] hover:border-[#6c63ff]/50 transition-all"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: `${e.pathColor}20` }}
                >
                  {e.pathIcon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#f1f5f9]">
                    {e.pathTitle}
                  </p>
                  <ProgressBar
                    value={e.progressPercent}
                    size="sm"
                    className="mt-1.5"
                  />
                </div>
                <span className="text-xs text-[#64748b] shrink-0">
                  {e.progressPercent}%
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
