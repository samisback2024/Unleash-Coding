import { supabase } from "@/lib/supabase";
import type { PublicProfile, CommunityProject, ProjectComment } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapProject(row: any): CommunityProject {
  return {
    id: row.id,
    userId: row.user_id,
    projectId: row.project_id,
    githubUrl: row.github_url ?? "",
    demoUrl: row.demo_url ?? "",
    notes: row.notes ?? "",
    status: row.status,
    submittedAt: row.submitted_at,
    isFeatured: row.is_featured ?? false,
    displayName: row.display_name ?? "Anonymous",
    avatarUrl: row.avatar_url ?? "",
    profileGithubUrl: row.profile_github_url ?? "",
    projectTitle: row.project_title ?? "",
    projectDescription: row.project_description ?? "",
    portfolioLevel: row.portfolio_level ?? "",
    skillsCovered: Array.isArray(row.skills_covered) ? row.skills_covered : [],
    pathTitle: row.path_title ?? "",
    pathSlug: row.path_slug ?? "",
    pathCategory: row.path_category ?? "",
    likeCount: row.like_count ?? 0,
    commentCount: row.comment_count ?? 0,
  };
}

function mapProfile(row: any): PublicProfile {
  return {
    id: row.id,
    userId: row.user_id,
    displayName: row.display_name ?? "",
    bio: row.bio ?? "",
    avatarUrl: row.avatar_url ?? "",
    githubUrl: row.github_url ?? "",
    linkedinUrl: row.linkedin_url ?? "",
    portfolioUrl: row.portfolio_url ?? "",
    isPublic: row.is_public ?? true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getPublicProjects(
  limit = 20,
  offset = 0,
): Promise<CommunityProject[]> {
  const { data } = await db
    .from("community_projects_view")
    .select("*")
    .order("submitted_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (!data) return [];
  return data.map(mapProject);
}

export async function getFeaturedProjects(): Promise<CommunityProject[]> {
  const { data } = await db
    .from("community_projects_view")
    .select("*")
    .eq("is_featured", true)
    .order("submitted_at", { ascending: false })
    .limit(6);

  if (!data) return [];
  return data.map(mapProject);
}

export async function searchProjects(
  query: string,
  pathFilter: string,
): Promise<CommunityProject[]> {
  let req = db.from("community_projects_view").select("*");

  if (query.trim()) {
    req = req.or(
      `project_title.ilike.%${query}%,display_name.ilike.%${query}%,path_title.ilike.%${query}%`,
    );
  }

  if (pathFilter && pathFilter !== "All") {
    req = req.ilike("path_category", `%${pathFilter}%`);
  }

  const { data } = await req
    .order("submitted_at", { ascending: false })
    .limit(50);

  if (!data) return [];
  return data.map(mapProject);
}

export async function getProjectById(
  submissionId: string,
): Promise<CommunityProject | null> {
  const { data } = await db
    .from("community_projects_view")
    .select("*")
    .eq("id", submissionId)
    .maybeSingle();

  return data ? mapProject(data) : null;
}

// ─── Likes ────────────────────────────────────────────────────────────────────

export async function likeProject(projectSubmissionId: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await db.from("project_likes").insert({
    user_id: user.id,
    project_submission_id: projectSubmissionId,
  });
}

export async function unlikeProject(
  projectSubmissionId: string,
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await db
    .from("project_likes")
    .delete()
    .eq("user_id", user.id)
    .eq("project_submission_id", projectSubmissionId);
}

export async function getUserLikedProjectIds(
  userId: string,
): Promise<string[]> {
  const { data } = await db
    .from("project_likes")
    .select("project_submission_id")
    .eq("user_id", userId);

  if (!data) return [];
  return data.map((r: any) => r.project_submission_id as string);
}

// ─── Comments ─────────────────────────────────────────────────────────────────

export async function getProjectComments(
  projectSubmissionId: string,
): Promise<ProjectComment[]> {
  const { data } = await db
    .from("project_comments")
    .select("*, public_profiles(display_name, avatar_url)")
    .eq("project_submission_id", projectSubmissionId)
    .order("created_at", { ascending: true });

  if (!data) return [];

  return data.map(
    (row: any): ProjectComment => ({
      id: row.id,
      userId: row.user_id,
      projectSubmissionId: row.project_submission_id,
      comment: row.comment,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      displayName: row.public_profiles?.display_name ?? "Anonymous",
      avatarUrl: row.public_profiles?.avatar_url ?? "",
    }),
  );
}

export async function addProjectComment(
  projectSubmissionId: string,
  comment: string,
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !comment.trim()) return;

  await db.from("project_comments").insert({
    user_id: user.id,
    project_submission_id: projectSubmissionId,
    comment: comment.trim(),
  });
}

export async function deleteProjectComment(commentId: string): Promise<void> {
  await db.from("project_comments").delete().eq("id", commentId);
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export async function reportProject(
  projectSubmissionId: string,
  reason: string,
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !reason.trim()) return;

  await db.from("project_reports").insert({
    reporter_id: user.id,
    project_submission_id: projectSubmissionId,
    reason: reason.trim(),
  });
}

// ─── Public Profiles ──────────────────────────────────────────────────────────

export async function getPublicProfile(
  userId: string,
): Promise<PublicProfile | null> {
  const { data } = await db
    .from("public_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  return data ? mapProfile(data) : null;
}

export async function getMyPublicProfile(): Promise<PublicProfile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return getPublicProfile(user.id);
}

export async function upsertPublicProfile(
  data: Partial<
    Omit<PublicProfile, "id" | "userId" | "createdAt" | "updatedAt">
  >,
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await db.from("public_profiles").upsert(
    {
      user_id: user.id,
      display_name: data.displayName ?? "",
      bio: data.bio ?? "",
      avatar_url: data.avatarUrl ?? "",
      github_url: data.githubUrl ?? "",
      linkedin_url: data.linkedinUrl ?? "",
      portfolio_url: data.portfolioUrl ?? "",
      is_public: data.isPublic ?? true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
}

export async function getUserPublicProjects(
  userId: string,
): Promise<CommunityProject[]> {
  const { data } = await db
    .from("community_projects_view")
    .select("*")
    .eq("user_id", userId)
    .order("submitted_at", { ascending: false });

  if (!data) return [];
  return data.map(mapProject);
}

// ─── Toggle project public visibility ────────────────────────────────────────

export async function setProjectPublic(
  submissionId: string,
  isPublic: boolean,
): Promise<void> {
  await db
    .from("project_submissions")
    .update({ is_public: isPublic })
    .eq("id", submissionId);
}
