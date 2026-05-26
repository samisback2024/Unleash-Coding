import { supabase } from "@/lib/supabase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BetaAnalytics {
  totalUsers: number;
  activeUsers7d: number;
  lessonsCompleted: number;
  challengesCompleted: number;
  projectsSubmitted: number;
  feedbackCount: number;
  bugReports: number;
  waitlistCount: number;
  unusedInvites: number;
  usedInvites: number;
}

export interface FeedbackSummary {
  total: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  recent: RecentFeedback[];
}

export interface RecentFeedback {
  id: string;
  feedbackType: string;
  message: string;
  pageUrl: string;
  status: string;
  createdAt: string;
}

export interface ActivityBreakdown {
  activityType: string;
  count: number;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function getBetaAnalytics(): Promise<BetaAnalytics> {
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const [
    users,
    activeUsers,
    lessonsCompleted,
    challengesCompleted,
    projectsSubmitted,
    feedbackCount,
    bugReports,
    waitlist,
    unusedInvites,
    usedInvites,
  ] = await Promise.all([
    db.from("profiles").select("id", { count: "exact", head: true }),
    db
      .from("user_activity")
      .select("user_id", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo),
    db.from("lesson_completions").select("id", { count: "exact", head: true }),
    db
      .from("challenge_attempts")
      .select("id", { count: "exact", head: true })
      .eq("is_correct", true),
    db.from("project_submissions").select("id", { count: "exact", head: true }),
    db.from("beta_feedback").select("id", { count: "exact", head: true }),
    db
      .from("beta_feedback")
      .select("id", { count: "exact", head: true })
      .eq("feedback_type", "bug"),
    db.from("beta_waitlist").select("id", { count: "exact", head: true }),
    db
      .from("beta_invites")
      .select("id", { count: "exact", head: true })
      .eq("status", "unused"),
    db
      .from("beta_invites")
      .select("id", { count: "exact", head: true })
      .eq("status", "used"),
  ]);

  return {
    totalUsers: users.count ?? 0,
    activeUsers7d: activeUsers.count ?? 0,
    lessonsCompleted: lessonsCompleted.count ?? 0,
    challengesCompleted: challengesCompleted.count ?? 0,
    projectsSubmitted: projectsSubmitted.count ?? 0,
    feedbackCount: feedbackCount.count ?? 0,
    bugReports: bugReports.count ?? 0,
    waitlistCount: waitlist.count ?? 0,
    unusedInvites: unusedInvites.count ?? 0,
    usedInvites: usedInvites.count ?? 0,
  };
}

export async function getFeedbackSummary(): Promise<FeedbackSummary> {
  const { data } = await db
    .from("beta_feedback")
    .select("id, feedback_type, message, page_url, status, created_at")
    .order("created_at", { ascending: false });

  if (!data) {
    return { total: 0, byType: {}, byStatus: {}, recent: [] };
  }

  const byType: Record<string, number> = {};
  const byStatus: Record<string, number> = {};

  for (const row of data) {
    byType[row.feedback_type] = (byType[row.feedback_type] ?? 0) + 1;
    byStatus[row.status] = (byStatus[row.status] ?? 0) + 1;
  }

  const recent: RecentFeedback[] = data.slice(0, 20).map(
    (row: any): RecentFeedback => ({
      id: row.id,
      feedbackType: row.feedback_type,
      message: row.message,
      pageUrl: row.page_url ?? "",
      status: row.status,
      createdAt: row.created_at,
    }),
  );

  return {
    total: data.length,
    byType,
    byStatus,
    recent,
  };
}

export async function getActivityBreakdown(): Promise<ActivityBreakdown[]> {
  const { data } = await db.from("user_activity").select("activity_type");

  if (!data) return [];

  const counts: Record<string, number> = {};
  for (const row of data) {
    counts[row.activity_type] = (counts[row.activity_type] ?? 0) + 1;
  }

  return Object.entries(counts)
    .map(([activityType, count]) => ({ activityType, count }))
    .sort((a, b) => b.count - a.count);
}
