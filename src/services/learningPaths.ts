import { supabase } from "@/lib/supabase";
import type {
  LearningPath,
  Module,
  Lesson,
  Challenge,
  Project,
  DbLearningPath,
  DbModule,
  DbLesson,
  DbChallenge,
  DbProject,
} from "@/types";

// ─── Mappers ─────────────────────────────────────────────────────────────────

function mapLesson(row: DbLesson): Lesson {
  return {
    id: row.id,
    title: row.title,
    duration: row.duration || `${row.estimated_minutes} min`,
    type: (row.type as Lesson["type"]) ?? "video",
  };
}

function mapModule(row: DbModule): Module {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    duration: row.duration,
    lessons: (row.lessons ?? []).map(mapLesson),
  };
}

function mapChallenge(row: DbChallenge): Challenge {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    difficulty: row.difficulty as Challenge["difficulty"],
    xp: row.xp,
  };
}

function mapProject(row: DbProject): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    difficulty: row.difficulty as Project["difficulty"],
    estimatedTime: row.estimated_time,
    techStack: row.tech_stack ?? [],
  };
}

function mapPath(
  row: DbLearningPath,
  modules: DbModule[],
  challenges: DbChallenge[],
  projects: DbProject[],
): LearningPath {
  const beginnerModules = modules
    .filter((m) => m.level === "beginner")
    .map(mapModule);
  const intermediateModules = modules
    .filter((m) => m.level === "intermediate")
    .map(mapModule);
  const advancedModules = modules
    .filter((m) => m.level === "advanced")
    .map(mapModule);

  const regularProjects = projects.filter((p) => !p.is_capstone);
  const capstoneRow = projects.find((p) => p.is_capstone);

  const capstoneProject: Project = capstoneRow
    ? mapProject(capstoneRow)
    : {
        id: `${row.id}-cap`,
        title: "Capstone Project",
        description: "Coming soon.",
        difficulty: "advanced",
        estimatedTime: "",
        techStack: [],
      };

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    icon: row.icon,
    color: row.color,
    difficulty: row.difficulty as LearningPath["difficulty"],
    estimatedTimeline: row.estimated_timeline,
    weeklyHours: row.weekly_hours_num,
    totalLessons: row.total_lessons,
    totalChallenges: row.total_challenges,
    enrolled: row.enrolled,
    rating: row.rating,
    tags: row.tags ?? [],
    beginnerModules,
    intermediateModules,
    advancedModules,
    challenges: challenges.map(mapChallenge),
    projects: regularProjects.map(mapProject),
    capstoneProject,
    jobReadyChecklist: row.job_ready_checklist ?? [],
  };
}

// ─── Query Functions ──────────────────────────────────────────────────────────

/**
 * Fetch all learning paths (summary – no modules/challenges/projects).
 * Used by the Dashboard to render path cards.
 */
export async function getLearningPaths(): Promise<{
  data: LearningPath[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("learning_paths")
    .select("*")
    .order("enrolled", { ascending: false });

  if (error) {
    console.error("[getLearningPaths]", error.message);
    return { data: null, error: error.message };
  }

  const paths = (data as DbLearningPath[]).map((row) =>
    mapPath(row, [], [], []),
  );
  return { data: paths, error: null };
}

/**
 * Fetch a single path by slug, including its modules (with lessons),
 * challenges, and projects.
 */
export async function getLearningPathBySlug(slug: string): Promise<{
  data: LearningPath | null;
  error: string | null;
}> {
  // Step 1: fetch the path row
  const { data: pathRow, error: pathError } = await supabase
    .from("learning_paths")
    .select("*")
    .eq("slug", slug)
    .single();

  if (pathError) {
    if (pathError.code === "PGRST116") return { data: null, error: null }; // not found
    return { data: null, error: pathError.message };
  }

  const path = pathRow as DbLearningPath;

  // Step 2: fetch related data in parallel
  const [modulesRes, challengesRes, projectsRes] = await Promise.all([
    supabase
      .from("modules")
      .select("*, lessons(*)")
      .eq("path_id", path.id)
      .order("order_index"),

    supabase
      .from("challenges")
      .select("*")
      .eq("path_id", path.id)
      .order("order_index"),

    supabase
      .from("projects")
      .select("*")
      .eq("path_id", path.id)
      .order("order_index"),
  ]);

  if (modulesRes.error)
    console.error("[getLearningPathBySlug] modules:", modulesRes.error.message);
  if (challengesRes.error)
    console.error(
      "[getLearningPathBySlug] challenges:",
      challengesRes.error.message,
    );
  if (projectsRes.error)
    console.error(
      "[getLearningPathBySlug] projects:",
      projectsRes.error.message,
    );

  const mapped = mapPath(
    path,
    (modulesRes.data ?? []) as DbModule[],
    (challengesRes.data ?? []) as DbChallenge[],
    (projectsRes.data ?? []) as DbProject[],
  );

  return { data: mapped, error: null };
}

/** Fetch modules for a path (with nested lessons). */
export async function getModulesByPathId(pathId: string): Promise<{
  data: Module[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("modules")
    .select("*, lessons(*)")
    .eq("path_id", pathId)
    .order("order_index");

  if (error) return { data: null, error: error.message };
  return { data: (data as DbModule[]).map(mapModule), error: null };
}

/** Fetch lessons for a module. */
export async function getLessonsByModuleId(moduleId: string): Promise<{
  data: Lesson[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("module_id", moduleId)
    .order("order_index");

  if (error) return { data: null, error: error.message };
  return { data: (data as DbLesson[]).map(mapLesson), error: null };
}

/** Fetch challenges for a path. */
export async function getChallengesByPathId(pathId: string): Promise<{
  data: Challenge[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("path_id", pathId)
    .order("order_index");

  if (error) return { data: null, error: error.message };
  return { data: (data as DbChallenge[]).map(mapChallenge), error: null };
}

/** Fetch projects for a path. */
export async function getProjectsByPathId(pathId: string): Promise<{
  data: Project[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("path_id", pathId)
    .order("order_index");

  if (error) return { data: null, error: error.message };
  return { data: (data as DbProject[]).map(mapProject), error: null };
}
