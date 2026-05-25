import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import type { UserProgress } from "@/types";

export function useUserProgress(pathId?: string) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [allProgress, setAllProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetch = async () => {
      const query = supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id);

      const { data } = pathId
        ? await query.eq("path_id", pathId).single()
        : await query;

      if (pathId) {
        setProgress(data as UserProgress | null);
      } else {
        setAllProgress((data as UserProgress[]) ?? []);
      }
      setLoading(false);
    };

    fetch();
  }, [user, pathId]);

  const markLessonComplete = async (lessonId: string, xpReward = 10) => {
    if (!user || !pathId || !progress) return;
    const updated = {
      completed_lesson_ids: [...(progress.completedLessonIds ?? []), lessonId],
      xp_earned: (progress.xpEarned ?? 0) + xpReward,
      last_activity_at: new Date().toISOString(),
    };
    await (
      supabase as unknown as {
        from: (t: string) => {
          update: (d: unknown) => {
            eq: (
              a: string,
              b: string,
            ) => { eq: (a: string, b: string) => Promise<unknown> };
          };
        };
      }
    )
      .from("user_progress")
      .update(updated)
      .eq("user_id", user.id)
      .eq("path_id", pathId);
    setProgress((prev) =>
      prev ? { ...prev, ...(updated as Partial<UserProgress>) } : prev,
    );
  };

  return { progress, allProgress, loading, markLessonComplete };
}
