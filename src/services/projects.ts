import { supabase } from "@/lib/supabase";
import type {
  ProjectItem,
  ProjectSubmission,
  ProjectWithStatus,
  ProjectSubmissionStatus,
} from "@/types";
import { updateProfileXp } from "@/services/progress";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ─── Row mappers ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProject(row: any): ProjectItem {
  return {
    id: row.id,
    pathId: row.path_id,
    title: row.title,
    description: row.description,
    difficulty: row.difficulty,
    portfolioLevel: row.portfolio_level ?? "Beginner Portfolio",
    requirements: Array.isArray(row.requirements) ? row.requirements : [],
    skillsCovered: Array.isArray(row.skills_covered) ? row.skills_covered : [],
    estimatedHours: row.estimated_hours ?? 5,
    xpReward: row.xp_reward ?? 100,
    orderIndex: row.order_index ?? 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSubmission(row: any): ProjectSubmission {
  return {
    id: row.id,
    userId: row.user_id,
    projectId: row.project_id,
    githubUrl: row.github_url ?? "",
    demoUrl: row.demo_url ?? "",
    notes: row.notes ?? "",
    status: (row.status ?? "submitted") as ProjectSubmissionStatus,
    feedback: row.feedback ?? "",
    xpAwarded: row.xp_awarded ?? 0,
    submittedAt: row.submitted_at ?? row.created_at ?? "",
    updatedAt: row.updated_at ?? "",
  };
}

// ─── Project fetching ─────────────────────────────────────────────────────────

export async function getProjectsByPathId(
  pathId: string,
): Promise<{ data: ProjectItem[] }> {
  const { data, error } = await db
    .from("projects")
    .select(
      "id, path_id, title, description, difficulty, portfolio_level, requirements, skills_covered, estimated_hours, xp_reward, order_index",
    )
    .eq("path_id", pathId)
    .order("order_index", { ascending: true });

  if (error || !data) return { data: [] };
  return { data: (data as unknown[]).map(mapProject) };
}

export async function getProjectById(
  projectId: string,
): Promise<{ data: ProjectItem | null; error: string | null }> {
  const { data, error } = await db
    .from("projects")
    .select(
      "id, path_id, title, description, difficulty, portfolio_level, requirements, skills_covered, estimated_hours, xp_reward, order_index",
    )
    .eq("id", projectId)
    .single();

  if (error || !data)
    return { data: null, error: error?.message ?? "Not found" };
  return { data: mapProject(data), error: null };
}

// ─── Submission fetching ──────────────────────────────────────────────────────

export async function getProjectSubmission(
  userId: string,
  projectId: string,
): Promise<ProjectSubmission | null> {
  const { data, error } = await db
    .from("project_submissions")
    .select("*")
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .maybeSingle();

  if (error || !data) return null;
  return mapSubmission(data);
}

export async function getUserProjectSubmissions(
  userId: string,
): Promise<{ data: ProjectSubmission[] }> {
  const { data, error } = await db
    .from("project_submissions")
    .select("*")
    .eq("user_id", userId)
    .order("submitted_at", { ascending: false });

  if (error || !data) return { data: [] };
  return { data: (data as unknown[]).map(mapSubmission) };
}

// ─── Get projects with submission status ──────────────────────────────────────

export async function getProjectsWithStatus(
  pathId: string,
  userId: string,
): Promise<{ data: ProjectWithStatus[] }> {
  const [{ data: projects }, { data: submissions }] = await Promise.all([
    getProjectsByPathId(pathId),
    getUserProjectSubmissions(userId),
  ]);

  const subMap = new Map(submissions.map((s) => [s.projectId, s]));

  const result: ProjectWithStatus[] = projects.map((p) => {
    const sub = subMap.get(p.id) ?? null;
    return {
      ...p,
      submission: sub,
      isSubmitted: sub !== null,
      isApproved: sub?.status === "approved",
    };
  });

  return { data: result };
}

// ─── Submit a project ────────────────────────────────────────────────────────

export async function submitProject(
  userId: string,
  projectId: string,
  githubUrl: string,
  demoUrl: string,
  notes: string,
  xpReward: number,
): Promise<{
  submission: ProjectSubmission | null;
  xpAwarded: number;
  alreadySubmitted: boolean;
  error: string | null;
}> {
  // Check for existing submission
  const existing = await getProjectSubmission(userId, projectId);

  if (existing) {
    // Update existing submission (but do NOT re-award XP)
    const { data, error } = await db
      .from("project_submissions")
      .update({
        github_url: githubUrl,
        demo_url: demoUrl,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error)
      return {
        submission: null,
        xpAwarded: 0,
        alreadySubmitted: true,
        error: error.message,
      };
    return {
      submission: mapSubmission(data),
      xpAwarded: 0,
      alreadySubmitted: true,
      error: null,
    };
  }

  // First submission — insert and award XP
  const { data, error } = await db
    .from("project_submissions")
    .insert({
      user_id: userId,
      project_id: projectId,
      github_url: githubUrl,
      demo_url: demoUrl,
      notes,
      status: "submitted",
      xp_awarded: xpReward,
    })
    .select("*")
    .single();

  if (error)
    return {
      submission: null,
      xpAwarded: 0,
      alreadySubmitted: false,
      error: error.message,
    };

  // Award XP
  await updateProfileXp(userId, xpReward);

  return {
    submission: mapSubmission(data),
    xpAwarded: xpReward,
    alreadySubmitted: false,
    error: null,
  };
}

export async function updateProjectSubmission(
  submissionId: string,
  updates: Partial<Pick<ProjectSubmission, "githubUrl" | "demoUrl" | "notes">>,
): Promise<{ error: string | null }> {
  const { error } = await db
    .from("project_submissions")
    .update({
      ...(updates.githubUrl !== undefined && { github_url: updates.githubUrl }),
      ...(updates.demoUrl !== undefined && { demo_url: updates.demoUrl }),
      ...(updates.notes !== undefined && { notes: updates.notes }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  return { error: error?.message ?? null };
}

// ─── Stats for dashboard / profile ────────────────────────────────────────────

export async function getUserProjectStats(userId: string): Promise<{
  totalSubmitted: number;
  totalApproved: number;
  totalXpFromProjects: number;
  recentSubmissions: ProjectSubmission[];
}> {
  const { data } = await getUserProjectSubmissions(userId);

  return {
    totalSubmitted: data.length,
    totalApproved: data.filter((s) => s.status === "approved").length,
    totalXpFromProjects: data.reduce((sum, s) => sum + s.xpAwarded, 0),
    recentSubmissions: data.slice(0, 5),
  };
}
