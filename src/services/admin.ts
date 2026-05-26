import { supabase } from "@/lib/supabase";
import type {
  AdminStats,
  AdminUser,
  AdminReport,
  AdminShowcaseSubmission,
} from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ─── Admin check ──────────────────────────────────────────────────────────────

export async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await db
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  return data?.role === "admin";
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function getAdminStats(): Promise<AdminStats> {
  const [paths, lessons, challenges, projects, users, submissions, reports] =
    await Promise.all([
      db.from("learning_paths").select("id", { count: "exact", head: true }),
      db.from("lessons").select("id", { count: "exact", head: true }),
      db.from("challenges").select("id", { count: "exact", head: true }),
      db.from("projects").select("id", { count: "exact", head: true }),
      db.from("profiles").select("id", { count: "exact", head: true }),
      db
        .from("project_submissions")
        .select("id", { count: "exact", head: true }),
      db
        .from("project_reports")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
    ]);
  return {
    totalPaths: paths.count ?? 0,
    totalLessons: lessons.count ?? 0,
    totalChallenges: challenges.count ?? 0,
    totalProjects: projects.count ?? 0,
    totalUsers: users.count ?? 0,
    totalSubmissions: submissions.count ?? 0,
    pendingReports: reports.count ?? 0,
  };
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getAllUsers(): Promise<AdminUser[]> {
  const { data } = await db
    .from("profiles")
    .select("id, username, full_name, role, xp, level, streak, created_at")
    .order("created_at", { ascending: false });
  if (!data) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((r: any) => ({
    id: r.id,
    username: r.username ?? "",
    fullName: r.full_name ?? "",
    role: r.role ?? "user",
    xp: r.xp ?? 0,
    level: r.level ?? 1,
    streak: r.streak ?? 0,
    createdAt: r.created_at,
  }));
}

export async function updateUserRole(
  userId: string,
  role: "user" | "admin",
): Promise<{ error: string | null }> {
  const { error } = await db.from("profiles").update({ role }).eq("id", userId);
  return { error: error?.message ?? null };
}

// ─── Learning Paths ───────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAllLearningPaths(): Promise<Record<string, any>[]> {
  const { data } = await db
    .from("learning_paths")
    .select(
      "id, title, slug, description, category, difficulty, enrolled, rating, created_at",
    )
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function createLearningPath(
  data: Record<string, unknown>,
): Promise<{ error: string | null }> {
  const { error } = await db.from("learning_paths").insert(data);
  return { error: error?.message ?? null };
}

export async function updateLearningPath(
  id: string,
  data: Record<string, unknown>,
): Promise<{ error: string | null }> {
  const { error } = await db.from("learning_paths").update(data).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteLearningPath(
  id: string,
): Promise<{ error: string | null }> {
  const { error } = await db.from("learning_paths").delete().eq("id", id);
  return { error: error?.message ?? null };
}

// ─── Modules ──────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAllModules(): Promise<Record<string, any>[]> {
  const { data } = await db
    .from("modules")
    .select(
      "id, path_id, title, description, level, duration, order_index, created_at, learning_paths(title)",
    )
    .order("order_index", { ascending: true });
  if (!data) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((r: any) => ({
    ...r,
    pathTitle: r.learning_paths?.title ?? "",
  }));
}

export async function createModule(
  data: Record<string, unknown>,
): Promise<{ error: string | null }> {
  const { error } = await db.from("modules").insert(data);
  return { error: error?.message ?? null };
}

export async function updateModule(
  id: string,
  data: Record<string, unknown>,
): Promise<{ error: string | null }> {
  const { error } = await db.from("modules").update(data).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteModule(
  id: string,
): Promise<{ error: string | null }> {
  const { error } = await db.from("modules").delete().eq("id", id);
  return { error: error?.message ?? null };
}

// ─── Lessons ──────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAllLessons(): Promise<Record<string, any>[]> {
  const { data } = await db
    .from("lessons")
    .select(
      "id, module_id, title, type, duration, order_index, estimated_minutes, created_at, modules(title)",
    )
    .order("order_index", { ascending: true });
  if (!data) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((r: any) => ({
    ...r,
    moduleTitle: r.modules?.title ?? "",
  }));
}

export async function getLessonContent(
  id: string,
): Promise<{ content: string }> {
  const { data } = await db
    .from("lessons")
    .select("content")
    .eq("id", id)
    .single();
  return { content: data?.content ?? "" };
}

export async function createLesson(
  data: Record<string, unknown>,
): Promise<{ error: string | null }> {
  const { error } = await db.from("lessons").insert(data);
  return { error: error?.message ?? null };
}

export async function updateLesson(
  id: string,
  data: Record<string, unknown>,
): Promise<{ error: string | null }> {
  const { error } = await db.from("lessons").update(data).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteLesson(
  id: string,
): Promise<{ error: string | null }> {
  const { error } = await db.from("lessons").delete().eq("id", id);
  return { error: error?.message ?? null };
}

// ─── Challenges ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAllChallenges(): Promise<Record<string, any>[]> {
  const { data } = await db
    .from("challenges")
    .select(
      "id, path_id, title, description, difficulty, challenge_type, xp_reward, order_index, created_at, learning_paths(title)",
    )
    .order("order_index", { ascending: true });
  if (!data) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((r: any) => ({
    ...r,
    pathTitle: r.learning_paths?.title ?? "",
  }));
}

export async function getChallengeDetail(
  id: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Record<string, any> | null> {
  const { data } = await db
    .from("challenges")
    .select(
      "id, path_id, title, description, difficulty, challenge_type, instructions, starter_code, options, expected_answer, hints, solution_explanation, xp_reward, order_index",
    )
    .eq("id", id)
    .single();
  return data ?? null;
}

export async function createChallenge(
  data: Record<string, unknown>,
): Promise<{ error: string | null }> {
  const { error } = await db.from("challenges").insert(data);
  return { error: error?.message ?? null };
}

export async function updateChallenge(
  id: string,
  data: Record<string, unknown>,
): Promise<{ error: string | null }> {
  const { error } = await db.from("challenges").update(data).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteChallenge(
  id: string,
): Promise<{ error: string | null }> {
  const { error } = await db.from("challenges").delete().eq("id", id);
  return { error: error?.message ?? null };
}

// ─── Portfolio Projects ───────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAllProjects(): Promise<Record<string, any>[]> {
  const { data } = await db
    .from("projects")
    .select(
      "id, path_id, title, description, difficulty, portfolio_level, xp_reward, order_index, is_capstone, created_at, learning_paths(title)",
    )
    .order("order_index", { ascending: true });
  if (!data) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((r: any) => ({
    ...r,
    pathTitle: r.learning_paths?.title ?? "",
  }));
}

export async function createProject(
  data: Record<string, unknown>,
): Promise<{ error: string | null }> {
  const { error } = await db.from("projects").insert(data);
  return { error: error?.message ?? null };
}

export async function updateProject(
  id: string,
  data: Record<string, unknown>,
): Promise<{ error: string | null }> {
  const { error } = await db.from("projects").update(data).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteProject(
  id: string,
): Promise<{ error: string | null }> {
  const { error } = await db.from("projects").delete().eq("id", id);
  return { error: error?.message ?? null };
}

// ─── Showcase Submissions ─────────────────────────────────────────────────────

export async function getShowcaseSubmissions(): Promise<
  AdminShowcaseSubmission[]
> {
  const { data } = await db
    .from("project_submissions")
    .select(
      "id, user_id, project_id, github_url, status, is_public, is_featured, submitted_at, projects(title, learning_paths(title))",
    )
    .order("submitted_at", { ascending: false })
    .limit(200);
  if (!data) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((r: any) => ({
    id: r.id,
    userId: r.user_id,
    projectId: r.project_id,
    githubUrl: r.github_url ?? "",
    status: r.status ?? "submitted",
    isPublic: r.is_public ?? false,
    isFeatured: r.is_featured ?? false,
    submittedAt: r.submitted_at ?? "",
    projectTitle: r.projects?.title ?? "Unknown",
    pathTitle: r.projects?.learning_paths?.title ?? "",
  }));
}

export async function featureProject(
  submissionId: string,
): Promise<{ error: string | null }> {
  const { error } = await db
    .from("project_submissions")
    .update({ is_featured: true, is_public: true })
    .eq("id", submissionId);
  return { error: error?.message ?? null };
}

export async function unfeatureProject(
  submissionId: string,
): Promise<{ error: string | null }> {
  const { error } = await db
    .from("project_submissions")
    .update({ is_featured: false })
    .eq("id", submissionId);
  return { error: error?.message ?? null };
}

export async function setSubmissionPublic(
  submissionId: string,
  isPublic: boolean,
): Promise<{ error: string | null }> {
  const { error } = await db
    .from("project_submissions")
    .update({ is_public: isPublic })
    .eq("id", submissionId);
  return { error: error?.message ?? null };
}

export async function updateSubmissionStatus(
  submissionId: string,
  status: string,
): Promise<{ error: string | null }> {
  const { error } = await db
    .from("project_submissions")
    .update({ status })
    .eq("id", submissionId);
  return { error: error?.message ?? null };
}

// ─── Project Reports ─────────────────────────────────────────────────────────

export async function getProjectReports(): Promise<AdminReport[]> {
  const { data } = await db
    .from("project_reports")
    .select(
      "id, reporter_id, project_submission_id, reason, status, created_at, project_submissions(projects(title))",
    )
    .order("created_at", { ascending: false });
  if (!data) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((r: any) => ({
    id: r.id,
    reporterId: r.reporter_id,
    projectSubmissionId: r.project_submission_id,
    reason: r.reason,
    status: r.status ?? "pending",
    createdAt: r.created_at,
    projectTitle: r.project_submissions?.projects?.title ?? "Unknown Project",
  }));
}

export async function updateReportStatus(
  reportId: string,
  status: string,
): Promise<{ error: string | null }> {
  const { error } = await db
    .from("project_reports")
    .update({ status })
    .eq("id", reportId);
  return { error: error?.message ?? null };
}
