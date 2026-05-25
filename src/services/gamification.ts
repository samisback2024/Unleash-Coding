import { supabase } from "@/lib/supabase";
import {
  calculateLevel,
  calculateRankTitle,
  getLevelProgress,
  type LevelInfo,
} from "@/lib/levels";
import { updateProfileXp } from "@/services/progress";
import type {
  Achievement,
  UserAchievement,
  LeaderboardEntry,
} from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export { calculateLevel, calculateRankTitle, getLevelProgress };
export type { LevelInfo };

// ─── User Achievements ────────────────────────────────────────────────────────

export async function getUserAchievements(
  userId: string,
): Promise<UserAchievement[]> {
  const { data } = await db
    .from("user_achievements")
    .select("*, achievements(*)")
    .eq("user_id", userId)
    .order("earned_at", { ascending: false });

  if (!data) return [];

  return data.map(
    (row: any): UserAchievement => ({
      id: row.id,
      userId: row.user_id,
      achievementId: row.achievement_id,
      earnedAt: row.earned_at,
      achievement: {
        id: row.achievements.id,
        name: row.achievements.name,
        description: row.achievements.description,
        icon: row.achievements.icon,
        achievementType: row.achievements.achievement_type,
        requirementValue: row.achievements.requirement_value,
        xpReward: row.achievements.xp_reward,
        createdAt: row.achievements.created_at,
      },
    }),
  );
}

// ─── Check & Award Achievements ───────────────────────────────────────────────

export async function checkAndAwardAchievements(
  userId: string,
): Promise<Achievement[]> {
  // 1. Fetch all achievements
  const { data: allAchievements } = await db.from("achievements").select("*");
  if (!allAchievements?.length) return [];

  // 2. Already-earned achievement IDs
  const { data: earned } = await db
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", userId);
  const earnedIds = new Set<string>(
    (earned ?? []).map((e: any) => e.achievement_id as string),
  );

  // 3. Fetch user stats in parallel
  const [progressRes, challengeRes, projectRes, approvedRes, profileRes] =
    await Promise.all([
      db
        .from("user_progress")
        .select("completed_lesson_ids, path_id, learning_paths(slug)")
        .eq("user_id", userId),
      db
        .from("user_challenges")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_correct", true),
      db
        .from("project_submissions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
      db
        .from("project_submissions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "approved"),
      db.from("profiles").select("streak").eq("id", userId).single(),
    ]);

  const progressRows: any[] = progressRes.data ?? [];
  const totalLessons = progressRows.reduce(
    (sum: number, row: any) => sum + (row.completed_lesson_ids?.length ?? 0),
    0,
  );
  const totalChallenges: number = challengeRes.count ?? 0;
  const totalProjects: number = projectRes.count ?? 0;
  const totalApproved: number = approvedRes.count ?? 0;
  const streak: number = profileRes.data?.streak ?? 0;

  // Path-specific enrollments
  const enrolledSlugs = new Set<string>(
    progressRows
      .filter((r: any) => r.learning_paths?.slug)
      .map((r: any) => r.learning_paths.slug as string),
  );

  // 4. Award qualifying un-earned achievements
  const newlyEarned: Achievement[] = [];

  for (const ach of allAchievements) {
    if (earnedIds.has(ach.id)) continue;

    let qualifies = false;
    switch (ach.achievement_type) {
      case "lesson_count":
        qualifies = totalLessons >= ach.requirement_value;
        break;
      case "challenge_count":
        qualifies = totalChallenges >= ach.requirement_value;
        break;
      case "project_count":
        qualifies = totalProjects >= ach.requirement_value;
        break;
      case "project_approved":
        qualifies = totalApproved >= ach.requirement_value;
        break;
      case "streak_days":
        qualifies = streak >= ach.requirement_value;
        break;
      case "path_python":
        qualifies = enrolledSlugs.has("python-developer");
        break;
      case "path_javascript":
        qualifies = enrolledSlugs.has("javascript-developer");
        break;
      case "path_fullstack":
        qualifies = enrolledSlugs.has("fullstack-developer");
        break;
    }

    if (!qualifies) continue;

    const { error } = await db.from("user_achievements").insert({
      user_id: userId,
      achievement_id: ach.id,
      earned_at: new Date().toISOString(),
    });

    if (!error) {
      newlyEarned.push({
        id: ach.id,
        name: ach.name,
        description: ach.description,
        icon: ach.icon,
        achievementType: ach.achievement_type,
        requirementValue: ach.requirement_value,
        xpReward: ach.xp_reward,
        createdAt: ach.created_at,
      });

      if (ach.xp_reward > 0) {
        await updateProfileXp(userId, ach.xp_reward);
      }
    }
  }

  return newlyEarned;
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export async function getLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  const { data } = await db
    .from("leaderboard_view")
    .select("*")
    .order("xp", { ascending: false })
    .limit(limit);

  if (!data) return [];

  return data.map(
    (row: any, index: number): LeaderboardEntry => ({
      userId: row.user_id,
      displayName: row.display_name,
      xp: row.xp,
      level: row.level,
      streak: row.streak,
      lessonsCompleted: row.lessons_completed,
      challengesCompleted: row.challenges_completed,
      projectsSubmitted: row.projects_submitted,
      rank: index + 1,
    }),
  );
}

// ─── Daily Streak ─────────────────────────────────────────────────────────────

export async function updateDailyStreak(
  userId: string,
): Promise<{ streak: number }> {
  const { data: profile } = await db
    .from("profiles")
    .select("streak, last_streak_date")
    .eq("id", userId)
    .single();

  if (!profile) return { streak: 0 };

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const yesterday = new Date(Date.now() - 86_400_000)
    .toISOString()
    .split("T")[0];

  if (profile.last_streak_date === today) {
    return { streak: profile.streak ?? 0 };
  }

  const newStreak =
    profile.last_streak_date === yesterday ? (profile.streak ?? 0) + 1 : 1;

  await db
    .from("profiles")
    .update({ streak: newStreak, last_streak_date: today })
    .eq("id", userId);

  return { streak: newStreak };
}
