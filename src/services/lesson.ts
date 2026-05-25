import { supabase } from "@/lib/supabase";
import type {
  LessonWithModule,
  ModuleWithLessons,
  LessonNavItem,
  LessonQuizItem,
} from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ─── Lesson fetching ──────────────────────────────────────────────────────────

export async function getLessonById(
  lessonId: string,
): Promise<{ data: LessonWithModule | null; error: string | null }> {
  const { data, error } = await db
    .from("lessons")
    .select(
      `id, title, content, type, duration, order_index, estimated_minutes,
       modules ( id, title, level, order_index )`,
    )
    .eq("id", lessonId)
    .single();

  if (error || !data)
    return { data: null, error: error?.message ?? "Lesson not found" };

  return {
    data: {
      id: data.id,
      moduleId: data.modules.id,
      moduleTitle: data.modules.title,
      moduleLevel: data.modules.level,
      moduleOrderIndex: data.modules.order_index,
      title: data.title,
      content: data.content,
      type: data.type,
      duration: data.duration,
      orderIndex: data.order_index,
      estimatedMinutes: data.estimated_minutes,
    },
    error: null,
  };
}

export async function getModulesWithLessons(
  pathId: string,
): Promise<{ data: ModuleWithLessons[] }> {
  const { data, error } = await db
    .from("modules")
    .select(
      `id, title, level, order_index,
       lessons ( id, title, duration, order_index, type )`,
    )
    .eq("path_id", pathId)
    .order("order_index", { ascending: true });

  if (error || !data) return { data: [] };

  return {
    data: (data as any[]).map((m) => ({
      id: m.id,
      title: m.title,
      level: m.level,
      orderIndex: m.order_index,
      lessons: ((m.lessons ?? []) as any[])
        .sort((a, b) => a.order_index - b.order_index)
        .map((l) => ({
          id: l.id,
          title: l.title,
          duration: l.duration,
          orderIndex: l.order_index,
          type: l.type,
        })),
    })),
  };
}

export async function getAdjacentLessons(
  currentLessonId: string,
  pathId: string,
): Promise<{ prev: LessonNavItem | null; next: LessonNavItem | null }> {
  const { data } = await db
    .from("modules")
    .select(`order_index, lessons ( id, title, order_index )`)
    .eq("path_id", pathId)
    .order("order_index", { ascending: true });

  if (!data) return { prev: null, next: null };

  // Flatten all lessons across all modules in order
  const allLessons: LessonNavItem[] = [];
  for (const mod of (data as any[]).sort(
    (a, b) => a.order_index - b.order_index,
  )) {
    for (const lesson of ((mod.lessons ?? []) as any[]).sort(
      (a: any, b: any) => a.order_index - b.order_index,
    )) {
      allLessons.push({ id: lesson.id, title: lesson.title });
    }
  }

  const idx = allLessons.findIndex((l) => l.id === currentLessonId);
  if (idx === -1) return { prev: null, next: null };

  return {
    prev: idx > 0 ? allLessons[idx - 1] : null,
    next: idx < allLessons.length - 1 ? allLessons[idx + 1] : null,
  };
}

// ─── Quizzes ─────────────────────────────────────────────────────────────────

export async function getLessonQuizzes(
  lessonId: string,
): Promise<{ data: LessonQuizItem[] }> {
  const { data, error } = await db
    .from("lesson_quizzes")
    .select("*")
    .eq("lesson_id", lessonId)
    .order("order_index", { ascending: true });

  if (error || !data) return { data: [] };

  return {
    data: (data as any[]).map((q) => ({
      id: q.id,
      lessonId: q.lesson_id,
      question: q.question,
      options: Array.isArray(q.options) ? q.options : [],
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
      orderIndex: q.order_index,
    })),
  };
}

export async function submitQuizAnswer(
  userId: string,
  quizId: string,
  selectedAnswer: string,
  correctAnswer: string,
): Promise<{ isCorrect: boolean; error: string | null }> {
  const isCorrect = selectedAnswer === correctAnswer;
  const { error } = await db.from("quiz_attempts").insert({
    user_id: userId,
    quiz_id: quizId,
    selected_answer: selectedAnswer,
    is_correct: isCorrect,
  });
  return { isCorrect, error: error?.message ?? null };
}

// ─── Notes ───────────────────────────────────────────────────────────────────

export async function getLessonNote(
  userId: string,
  lessonId: string,
): Promise<{ note: string }> {
  const { data } = await db
    .from("lesson_notes")
    .select("note")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .single();
  return { note: data?.note ?? "" };
}

export async function saveLessonNote(
  userId: string,
  lessonId: string,
  note: string,
): Promise<{ error: string | null }> {
  const { error } = await db.from("lesson_notes").upsert(
    {
      user_id: userId,
      lesson_id: lessonId,
      note,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" },
  );
  return { error: error?.message ?? null };
}
