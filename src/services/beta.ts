import { supabase } from "@/lib/supabase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WaitlistEntry {
  id: string;
  email: string;
  name: string;
  interestArea: string;
  status: "waiting" | "invited" | "joined" | "declined";
  createdAt: string;
}

export interface BetaInvite {
  id: string;
  email: string;
  inviteCode: string;
  status: "unused" | "used" | "revoked";
  invitedBy: string | null;
  usedBy: string | null;
  createdAt: string;
  usedAt: string | null;
}

export interface JoinWaitlistData {
  email: string;
  name?: string;
  interest_area?: string;
}

// ─── Waitlist ─────────────────────────────────────────────────────────────────

export async function joinWaitlist(
  data: JoinWaitlistData,
): Promise<{ error: string | null }> {
  const { error } = await db.from("beta_waitlist").insert({
    email: data.email.toLowerCase().trim(),
    name: data.name?.trim() ?? null,
    interest_area: data.interest_area ?? null,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "This email is already on the waitlist." };
    }
    return { error: "Failed to join waitlist. Please try again." };
  }
  return { error: null };
}

export async function getWaitlistUsers(): Promise<WaitlistEntry[]> {
  const { data, error } = await db
    .from("beta_waitlist")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map(
    (row: any): WaitlistEntry => ({
      id: row.id,
      email: row.email,
      name: row.name ?? "",
      interestArea: row.interest_area ?? "",
      status: row.status,
      createdAt: row.created_at,
    }),
  );
}

export async function updateWaitlistStatus(
  id: string,
  status: WaitlistEntry["status"],
): Promise<{ error: string | null }> {
  const { error } = await db
    .from("beta_waitlist")
    .update({ status })
    .eq("id", id);
  if (error) return { error: error.message };
  return { error: null };
}

// ─── Invites ──────────────────────────────────────────────────────────────────

export async function createBetaInvite(
  email: string,
  invitedBy: string,
): Promise<{ invite: BetaInvite | null; error: string | null }> {
  const { data, error } = await db
    .from("beta_invites")
    .insert({
      email: email.toLowerCase().trim(),
      invited_by: invitedBy,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        invite: null,
        error: "An invite already exists for this email.",
      };
    }
    return { invite: null, error: error.message };
  }

  return { invite: mapInvite(data), error: null };
}

export async function getAdminInvites(): Promise<BetaInvite[]> {
  const { data, error } = await db
    .from("beta_invites")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapInvite);
}

export async function validateInviteCode(
  code: string,
): Promise<{ valid: boolean; email: string; error: string | null }> {
  const { data, error } = await db
    .from("beta_invites")
    .select("id, email, status")
    .eq("invite_code", code)
    .single();

  if (error || !data) {
    return { valid: false, email: "", error: "Invalid invite code." };
  }
  if (data.status !== "unused") {
    return {
      valid: false,
      email: data.email,
      error: "This invite code has already been used or revoked.",
    };
  }
  return { valid: true, email: data.email, error: null };
}

export async function markInviteUsed(
  code: string,
  userId: string,
): Promise<{ error: string | null }> {
  const { error } = await db
    .from("beta_invites")
    .update({
      status: "used",
      used_by: userId,
      used_at: new Date().toISOString(),
    })
    .eq("invite_code", code)
    .eq("status", "unused");

  if (error) return { error: error.message };
  return { error: null };
}

export async function revokeInvite(
  id: string,
): Promise<{ error: string | null }> {
  const { error } = await db
    .from("beta_invites")
    .update({ status: "revoked" })
    .eq("id", id);
  if (error) return { error: error.message };
  return { error: null };
}

// ─── User Activity ────────────────────────────────────────────────────────────

export async function trackUserActivity(
  userId: string,
  activityType: string,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  try {
    await db.from("user_activity").insert({
      user_id: userId,
      activity_type: activityType,
      metadata,
    });
  } catch {
    // activity tracking is non-critical — fail silently
  }
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function mapInvite(row: any): BetaInvite {
  return {
    id: row.id,
    email: row.email,
    inviteCode: row.invite_code,
    status: row.status,
    invitedBy: row.invited_by ?? null,
    usedBy: row.used_by ?? null,
    createdAt: row.created_at,
    usedAt: row.used_at ?? null,
  };
}
