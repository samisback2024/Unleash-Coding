import { supabase } from "@/lib/supabase";
import type { UserProfile, UserProgress } from "@/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProgress(row: any): UserProgress {
  return {
    userId: row.user_id,
    pathId: row.path_id,
    completedLessonIds: row.completed_lesson_ids ?? [],
    completedChallengeIds: row.completed_challenge_ids ?? [],
    completedProjectIds: row.completed_project_ids ?? [],
    percentComplete: row.progress_percent ?? 0,
    xpEarned: row.xp_earned ?? 0,
    startedAt: row.started_at ?? row.created_at ?? "",
    lastActivityAt: row.last_activity_at ?? "",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function getUserProfile(
  userId: string,
): Promise<{ data: UserProfile | null; error: string | null }> {
  const { data, error } = await db
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return { data: null, error: null };
    return { data: null, error: error.message };
  }

  return {
    data: {
      id: data.id,
      username: data.username ?? "",
      fullName: data.full_name ?? "",
      avatarUrl: data.avatar_url ?? undefined,
      xp: data.xp ?? 0,
      level: data.level ?? 1,
      streak: data.streak ?? 0,
      joinedAt: data.created_at,
      bio: data.bio ?? undefined,
    },
    error: null,
  };
}

export async function updateProfileXp(
  userId: string,
  xpToAdd: number,
): Promise<void> {
  const { data: profile } = await db
    .from("profiles")
    .select("xp")
    .eq("id", userId)
    .single();

  if (!profile) return;

  const newXp = (profile.xp ?? 0) + xpToAdd;
  const newLevel = Math.max(1, Math.floor(newXp / 1000) + 1);

  await db
    .from("profiles")
    .update({
      xp: newXp,
      level: newLevel,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
}

// ─── Enrollment / Progress ───────────────────────────────────────────────────

export async function enrollInPath(
  userId: string,
  pathId: string,
): Promise<{ error: string | null }> {
  const { error } = await db.from("user_progress").insert({
    user_id: userId,
    path_id: pathId,
    completed_lesson_ids: [],
    completed_challenge_ids: [],
    completed_project_ids: [],
    status: "in_progress",
    progress_percent: 0,
    xp_earned: 0,
    started_at: new Date().toISOString(),
    last_activity_at: new Date().toISOString(),
  });

  // 23505 = unique violation (already enrolled) — treat as success
  if (error && error.code !== "23505") return { error: error.message };
  return { error: null };
}

export async function getEnrollment(
  userId: string,
  pathId: string,
): Promise<{ data: UserProgress | null }> {
  const { data, error } = await db
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("path_id", pathId)
    .single();

  if (error || !data) return { data: null };
  return { data: mapProgress(data) };
}

export interface EnrollmentWithPath {
  pathId: string;
  pathSlug: string;
  pathTitle: string;
  pathIcon: string;
  pathColor: string;
  totalLessons: number;
  completedLessonIds: string[];
  progressPercent: number;
  xpEarned: number;
  lastActivityAt: string;
}

export async function getAllEnrollments(
  userId: string,
): Promise<{ data: EnrollmentWithPath[] }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await db
    .from("user_progress")
    .select(
      `path_id, completed_lesson_ids, progress_percent, xp_earned, last_activity_at,
       learning_paths ( id, title, slug, icon, color, total_lessons )`,
    )
    .eq("user_id", userId)
    .order("last_activity_at", { ascending: false });

  if (error || !data) return { data: [] };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return {
    data: (data as any[])
      .filter((row) => row.learning_paths)
      .map((row) => ({
        pathId: row.path_id,
        pathSlug: row.learning_paths.slug,
        pathTitle: row.learning_paths.title,
        pathIcon: row.learning_paths.icon,
        pathColor: row.learning_paths.color,
        totalLessons: row.learning_paths.total_lessons,
        completedLessonIds: row.completed_lesson_ids ?? [],
        progressPercent: row.progress_percent ?? 0,
        xpEarned: row.xp_earned ?? 0,
        lastActivityAt: row.last_activity_at ?? "",
      })),
  };
}

export async function markLessonComplete(
  userId: string,
  pathId: string,
  lessonId: string,
  totalLessons: number,
  xpReward = 10,
): Promise<{ error: string | null; alreadyDone: boolean }> {
  const { data: current } = await db
    .from("user_progress")
    .select("completed_lesson_ids, xp_earned")
    .eq("user_id", userId)
    .eq("path_id", pathId)
    .single();

  if (!current)
    return { error: "Not enrolled in this path", alreadyDone: false };

  const completedIds: string[] = current.completed_lesson_ids ?? [];
  if (completedIds.includes(lessonId))
    return { error: null, alreadyDone: true };

  const newCompleted = [...completedIds, lessonId];
  const newXp = (current.xp_earned ?? 0) + xpReward;
  const progressPercent =
    totalLessons > 0
      ? Math.min(100, Math.round((newCompleted.length / totalLessons) * 100))
      : 0;

  const { error } = await db
    .from("user_progress")
    .update({
      completed_lesson_ids: newCompleted,
      xp_earned: newXp,
      progress_percent: progressPercent,
      last_activity_at: new Date().toISOString(),
      status: progressPercent >= 100 ? "completed" : "in_progress",
    })
    .eq("user_id", userId)
    .eq("path_id", pathId);

  if (error) return { error: error.message, alreadyDone: false };

  await updateProfileXp(userId, xpReward);
  return { error: null, alreadyDone: false };
}
