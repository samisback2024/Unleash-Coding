import { supabase } from "@/lib/supabase";
import type {
  ChallengeItem,
  ChallengeAttempt,
  ChallengeWithStatus,
} from "@/types";
import { updateProfileXp } from "@/services/progress";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ─── Row mapper ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapChallenge(row: any): ChallengeItem {
  return {
    id: row.id,
    pathId: row.path_id,
    title: row.title,
    description: row.description,
    difficulty: row.difficulty,
    challengeType: row.challenge_type ?? "multiple_choice",
    instructions: row.instructions,
    starterCode: row.starter_code ?? "",
    options: Array.isArray(row.options) ? row.options : [],
    expectedAnswer: row.expected_answer ?? "",
    hints: Array.isArray(row.hints) ? row.hints : [],
    solutionExplanation: row.solution_explanation ?? "",
    xpReward: row.xp_reward ?? row.xp ?? 25,
    orderIndex: row.order_index,
  };
}

// ─── Fetching ─────────────────────────────────────────────────────────────────

export async function getChallengesByPathId(
  pathId: string,
): Promise<{ data: ChallengeItem[] }> {
  const { data, error } = await db
    .from("challenges")
    .select(
      "id, path_id, title, description, difficulty, challenge_type, instructions, starter_code, options, expected_answer, hints, solution_explanation, xp, xp_reward, order_index",
    )
    .eq("path_id", pathId)
    .order("order_index", { ascending: true });

  if (error || !data) return { data: [] };
  return { data: (data as unknown[]).map(mapChallenge) };
}

export async function getChallengeById(
  challengeId: string,
): Promise<{ data: ChallengeItem | null; error: string | null }> {
  const { data, error } = await db
    .from("challenges")
    .select(
      "id, path_id, title, description, difficulty, challenge_type, instructions, starter_code, options, expected_answer, hints, solution_explanation, xp, xp_reward, order_index",
    )
    .eq("id", challengeId)
    .single();

  if (error || !data)
    return { data: null, error: error?.message ?? "Challenge not found" };
  return { data: mapChallenge(data), error: null };
}

// ─── Attempts ─────────────────────────────────────────────────────────────────

export async function getUserChallengeAttempts(
  userId: string,
): Promise<{ data: ChallengeAttempt[] }> {
  const { data, error } = await db
    .from("challenge_attempts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return { data: [] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return {
    data: (data as unknown[]).map((r: any) => ({
      id: r.id,
      userId: r.user_id,
      challengeId: r.challenge_id,
      submittedAnswer: r.submitted_answer,
      isCorrect: r.is_correct,
      xpAwarded: r.xp_awarded,
      completedAt: r.completed_at ?? null,
      createdAt: r.created_at,
    })),
  };
}

export async function getCompletedChallengeIds(
  userId: string,
): Promise<string[]> {
  const { data, error } = await db
    .from("challenge_attempts")
    .select("challenge_id")
    .eq("user_id", userId)
    .eq("is_correct", true);

  if (error || !data) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return [...new Set((data as any[]).map((r) => r.challenge_id as string))];
}

export async function hasCompletedChallenge(
  userId: string,
  challengeId: string,
): Promise<boolean> {
  const { data, error } = await db
    .from("challenge_attempts")
    .select("id")
    .eq("user_id", userId)
    .eq("challenge_id", challengeId)
    .eq("is_correct", true)
    .limit(1);

  if (error || !data) return false;
  return (data as unknown[]).length > 0;
}

// ─── Submission ───────────────────────────────────────────────────────────────

export async function submitChallengeAnswer(
  userId: string,
  pathId: string,
  challengeId: string,
  submittedAnswer: string,
  expectedAnswer: string,
  xpReward: number,
): Promise<{
  isCorrect: boolean;
  xpAwarded: number;
  alreadyDone: boolean;
  error: string | null;
}> {
  // Normalise comparison: lowercase + trim for both answers
  const isCorrect =
    submittedAnswer.trim().toLowerCase() ===
    expectedAnswer.trim().toLowerCase();

  // Check if already correctly completed (prevent duplicate XP)
  const alreadyDone = await hasCompletedChallenge(userId, challengeId);

  const xpToAward = isCorrect && !alreadyDone ? xpReward : 0;

  // Insert attempt record
  const { error: insertError } = await db.from("challenge_attempts").insert({
    user_id: userId,
    challenge_id: challengeId,
    submitted_answer: submittedAnswer,
    is_correct: isCorrect,
    xp_awarded: xpToAward,
    completed_at: isCorrect ? new Date().toISOString() : null,
  });

  if (insertError)
    return { isCorrect, xpAwarded: 0, alreadyDone, error: insertError.message };

  // If first-time correct: award XP to profile and update path progress
  if (isCorrect && !alreadyDone) {
    await updateProfileXp(userId, xpToAward);
    await updatePathChallengeProgress(userId, pathId, challengeId);
  }

  return { isCorrect, xpAwarded: xpToAward, alreadyDone, error: null };
}

// ─── Path progress update ─────────────────────────────────────────────────────

async function updatePathChallengeProgress(
  userId: string,
  pathId: string,
  challengeId: string,
): Promise<void> {
  const { data: current } = await db
    .from("user_progress")
    .select("completed_challenge_ids")
    .eq("user_id", userId)
    .eq("path_id", pathId)
    .single();

  if (!current) return;

  const ids: string[] = current.completed_challenge_ids ?? [];
  if (ids.includes(challengeId)) return;

  await db
    .from("user_progress")
    .update({
      completed_challenge_ids: [...ids, challengeId],
      last_activity_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("path_id", pathId);
}

// ─── Challenges with completion status ───────────────────────────────────────

export async function getChallengesWithStatus(
  pathId: string,
  userId: string,
): Promise<{ data: ChallengeWithStatus[] }> {
  const [{ data: challenges }, completedIds] = await Promise.all([
    getChallengesByPathId(pathId),
    getCompletedChallengeIds(userId),
  ]);

  // Get attempt counts
  const { data: attempts } = await db
    .from("challenge_attempts")
    .select("challenge_id")
    .eq("user_id", userId)
    .in(
      "challenge_id",
      challenges.map((c) => c.id),
    );

  const attemptCounts: Record<string, number> = {};
  if (attempts) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (attempts as any[]).forEach((a) => {
      attemptCounts[a.challenge_id] = (attemptCounts[a.challenge_id] ?? 0) + 1;
    });
  }

  return {
    data: challenges.map((c) => ({
      ...c,
      isCompleted: completedIds.includes(c.id),
      attemptCount: attemptCounts[c.id] ?? 0,
    })),
  };
}

// ─── Global challenge stats for a user ───────────────────────────────────────

export async function getUserChallengeStats(userId: string): Promise<{
  totalCompleted: number;
  totalXpFromChallenges: number;
  recentAttempts: (ChallengeAttempt & { challengeTitle: string })[];
}> {
  const { data: attempts } = await db
    .from("challenge_attempts")
    .select("*, challenges(title)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (!attempts)
    return { totalCompleted: 0, totalXpFromChallenges: 0, recentAttempts: [] };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = attempts as any[];
  const completedIds = new Set(
    rows.filter((r) => r.is_correct).map((r) => r.challenge_id as string),
  );
  const totalXp = rows.reduce((sum: number, r) => sum + (r.xp_awarded ?? 0), 0);

  return {
    totalCompleted: completedIds.size,
    totalXpFromChallenges: totalXp,
    recentAttempts: rows.slice(0, 5).map((r) => ({
      id: r.id,
      userId: r.user_id,
      challengeId: r.challenge_id,
      submittedAnswer: r.submitted_answer,
      isCorrect: r.is_correct,
      xpAwarded: r.xp_awarded,
      completedAt: r.completed_at ?? null,
      createdAt: r.created_at,
      challengeTitle: r.challenges?.title ?? "Unknown Challenge",
    })),
  };
}
