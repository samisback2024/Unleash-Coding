// ─── Domain types ────────────────────────────────────────────────────────────

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "reading" | "interactive";
  completed?: boolean;
}

// ─── Lesson engine types ──────────────────────────────────────────────────────

export interface LessonWithModule {
  id: string;
  moduleId: string;
  moduleTitle: string;
  moduleLevel: string;
  moduleOrderIndex: number;
  title: string;
  content: string;
  type: string;
  duration: string;
  orderIndex: number;
  estimatedMinutes: number;
}

export interface LessonNavItem {
  id: string;
  title: string;
}

export interface ModuleLessonItem {
  id: string;
  title: string;
  duration: string;
  orderIndex: number;
  type: string;
}

export interface ModuleWithLessons {
  id: string;
  title: string;
  level: string;
  orderIndex: number;
  lessons: ModuleLessonItem[];
}

export interface LessonQuizItem {
  id: string;
  lessonId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  orderIndex: number;
}

export interface LessonNoteData {
  userId: string;
  lessonId: string;
  note: string;
  updatedAt: string;
}

// ─── Challenge engine types ───────────────────────────────────────────────────

export type ChallengeType =
  | "multiple_choice"
  | "short_answer"
  | "code_reading"
  | "debugging"
  | "algorithm"
  | "scenario"
  | "implementation";

export interface ChallengeItem {
  id: string;
  pathId: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  challengeType: ChallengeType;
  instructions: string;
  starterCode: string;
  options: string[];
  expectedAnswer: string;
  hints: string[];
  solutionExplanation: string;
  xpReward: number;
  orderIndex: number;
}

export interface ChallengeAttempt {
  id: string;
  userId: string;
  challengeId: string;
  submittedAnswer: string;
  isCorrect: boolean;
  xpAwarded: number;
  completedAt: string | null;
  createdAt: string;
}

export interface ChallengeWithStatus extends ChallengeItem {
  isCompleted: boolean;
  attemptCount: number;
}

// ─── Portfolio project types ──────────────────────────────────────────────────

export type PortfolioLevel =
  | "Beginner Portfolio"
  | "Internship Ready"
  | "Junior Developer Ready"
  | "Advanced / Company-Level";

export interface ProjectItem {
  id: string;
  pathId: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  portfolioLevel: PortfolioLevel;
  requirements: string[];
  skillsCovered: string[];
  estimatedHours: number;
  xpReward: number;
  orderIndex: number;
}

export type ProjectSubmissionStatus =
  | "submitted"
  | "reviewed"
  | "approved"
  | "revision_requested";

export interface ProjectSubmission {
  id: string;
  userId: string;
  projectId: string;
  githubUrl: string;
  demoUrl: string;
  notes: string;
  status: ProjectSubmissionStatus;
  feedback: string;
  xpAwarded: number;
  submittedAt: string;
  updatedAt: string;
}

export interface ProjectWithStatus extends ProjectItem {
  submission: ProjectSubmission | null;
  isSubmitted: boolean;
  isApproved: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  xp: number;
  completed?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedTime: string;
  techStack: string[];
  completed?: boolean;
}

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  difficulty: Difficulty;
  estimatedTimeline: string;
  weeklyHours: number;
  totalLessons: number;
  totalChallenges: number;
  enrolled?: number;
  rating?: number;
  tags: string[];
  beginnerModules: Module[];
  intermediateModules: Module[];
  advancedModules: Module[];
  challenges: Challenge[];
  projects: Project[];
  capstoneProject: Project;
  jobReadyChecklist: string[];
}

// ─── User / Progress types ────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  xp: number;
  level: number;
  streak: number;
  joinedAt: string;
  bio?: string;
}

export interface UserProgress {
  userId: string;
  pathId: string;
  completedLessonIds: string[];
  completedChallengeIds: string[];
  completedProjectIds: string[];
  percentComplete: number;
  xpEarned: number;
  startedAt: string;
  lastActivityAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt?: string;
}

// ─── Gamification types ───────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  achievementType: string;
  requirementValue: number;
  xpReward: number;
  createdAt: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  earnedAt: string;
  achievement: Achievement;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  xp: number;
  level: number;
  streak: number;
  lessonsCompleted: number;
  challengesCompleted: number;
  projectsSubmitted: number;
  rank: number;
}

// ─── Supabase DB row types ────────────────────────────────────────────────────

export interface DbLearningPath {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  estimated_timeline: string;
  weekly_hours: string;
  weekly_hours_num: number;
  category: string;
  icon: string;
  color: string;
  tags: string[];
  enrolled: number;
  rating: number;
  total_lessons: number;
  total_challenges: number;
  job_ready_checklist: string[];
  created_at: string;
}

export interface DbModule {
  id: string;
  path_id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  order_index: number;
  created_at: string;
  lessons?: DbLesson[];
}

export interface DbLesson {
  id: string;
  module_id: string;
  title: string;
  content: string;
  type: string;
  duration: string;
  order_index: number;
  estimated_minutes: number;
  created_at: string;
}

export interface DbChallenge {
  id: string;
  path_id: string;
  title: string;
  description: string;
  difficulty: string;
  instructions: string;
  xp: number;
  order_index: number;
  created_at: string;
}

export interface DbProject {
  id: string;
  path_id: string;
  title: string;
  description: string;
  difficulty: string;
  estimated_time: string;
  tech_stack: string[];
  portfolio_level: string;
  is_capstone: boolean;
  requirements: string;
  order_index: number;
  created_at: string;
}

export interface DbBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      learning_paths: {
        Row: DbLearningPath;
        Insert: Omit<DbLearningPath, "id" | "created_at">;
        Update: Partial<
          Database["public"]["Tables"]["learning_paths"]["Insert"]
        >;
      };
      modules: {
        Row: DbModule;
        Insert: Omit<DbModule, "id" | "created_at" | "lessons">;
        Update: Partial<Database["public"]["Tables"]["modules"]["Insert"]>;
      };
      lessons: {
        Row: DbLesson;
        Insert: Omit<DbLesson, "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["lessons"]["Insert"]>;
      };
      challenges: {
        Row: DbChallenge;
        Insert: Omit<DbChallenge, "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["challenges"]["Insert"]>;
      };
      projects: {
        Row: DbProject;
        Insert: Omit<DbProject, "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      badges: {
        Row: DbBadge;
        Insert: Omit<DbBadge, "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["badges"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string;
          avatar_url: string | null;
          xp: number;
          level: number;
          streak: number;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["profiles"]["Row"],
          "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          path_id: string;
          module_id: string | null;
          lesson_id: string | null;
          completed_lesson_ids: string[];
          completed_challenge_ids: string[];
          completed_project_ids: string[];
          status: string;
          progress_percent: number;
          xp_earned: number;
          started_at: string | null;
          last_activity_at: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["user_progress"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["user_progress"]["Insert"]
        >;
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["user_badges"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["user_badges"]["Insert"]>;
      };
    };
  };
}
