import { supabase } from "@/lib/supabase";

export type FeedbackType =
  | "bug"
  | "design_issue"
  | "confusing_flow"
  | "feature_request"
  | "content_issue"
  | "other";

export interface BetaFeedback {
  id: string;
  userId: string | null;
  pageUrl: string;
  feedbackType: FeedbackType;
  message: string;
  status: "new" | "reviewed" | "resolved" | "dismissed";
  createdAt: string;
}

export interface SubmitFeedbackPayload {
  page_url: string;
  feedback_type: FeedbackType;
  message: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export async function submitFeedback(
  userId: string,
  payload: SubmitFeedbackPayload,
): Promise<{ error: string | null }> {
  const { error } = await db.from("beta_feedback").insert({
    user_id: userId,
    page_url: payload.page_url,
    feedback_type: payload.feedback_type,
    message: payload.message,
  });

  if (error) return { error: error.message };
  return { error: null };
}

export async function getAdminFeedback(): Promise<BetaFeedback[]> {
  const { data, error } = await db
    .from("beta_feedback")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map(
    (row: any): BetaFeedback => ({
      id: row.id,
      userId: row.user_id,
      pageUrl: row.page_url ?? "",
      feedbackType: row.feedback_type,
      message: row.message,
      status: row.status,
      createdAt: row.created_at,
    }),
  );
}

export async function updateFeedbackStatus(
  id: string,
  status: BetaFeedback["status"],
): Promise<{ error: string | null }> {
  const { error } = await db
    .from("beta_feedback")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };
  return { error: null };
}
