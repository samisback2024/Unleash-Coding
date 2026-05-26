import { supabase } from "@/lib/supabase";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export interface StudyGoal {
  id: string;
  user_id: string;
  title: string;
  target_minutes_daily: number;
  topic: string | null;
  is_active: boolean;
  created_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  duration_minutes: number;
  session_date: string;
  topic: string | null;
  notes: string | null;
  created_at: string;
}

// ── Goals ──────────────────────────────────────────────
export async function getStudyGoals(userId: string): Promise<StudyGoal[]> {
  const { data, error } = await db
    .from("study_goals")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createStudyGoal(
  userId: string,
  title: string,
  targetMinutes: number,
  topic?: string,
): Promise<StudyGoal> {
  const { data, error } = await db
    .from("study_goals")
    .insert({
      user_id: userId,
      title,
      target_minutes_daily: targetMinutes,
      topic: topic ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteStudyGoal(id: string): Promise<void> {
  const { error } = await db
    .from("study_goals")
    .update({ is_active: false })
    .eq("id", id);
  if (error) throw error;
}

// ── Sessions ───────────────────────────────────────────
export async function getStudySessions(
  userId: string,
  days = 90,
): Promise<StudySession[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const { data, error } = await db
    .from("study_sessions")
    .select("*")
    .eq("user_id", userId)
    .gte("session_date", since.toISOString().split("T")[0])
    .order("session_date", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function logStudySession(
  userId: string,
  durationMinutes: number,
  topic?: string,
  notes?: string,
): Promise<StudySession> {
  const { data, error } = await db
    .from("study_sessions")
    .insert({
      user_id: userId,
      duration_minutes: durationMinutes,
      topic: topic ?? null,
      notes: notes ?? null,
      session_date: new Date().toISOString().split("T")[0],
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteStudySession(id: string): Promise<void> {
  const { error } = await db.from("study_sessions").delete().eq("id", id);
  if (error) throw error;
}
