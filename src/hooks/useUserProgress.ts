import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getEnrollment,
  enrollInPath,
  markLessonComplete as markComplete,
} from "@/services/progress";
import type { UserProgress } from "@/types";

export function useUserProgress(pathId?: string, totalLessons = 0) {
  const { user, refreshProfile } = useAuth();
  const [enrollment, setEnrollment] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (!user || !pathId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getEnrollment(user.id, pathId).then(({ data }) => {
      if (!cancelled) {
        setEnrollment(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user, pathId]);

  const enroll = useCallback(async () => {
    if (!user || !pathId) return { error: "Not logged in" };
    setEnrolling(true);
    const { error } = await enrollInPath(user.id, pathId);
    if (!error) {
      const { data } = await getEnrollment(user.id, pathId);
      setEnrollment(data);
    }
    setEnrolling(false);
    return { error };
  }, [user, pathId]);

  const markLessonComplete = useCallback(
    async (lessonId: string, xpReward = 10) => {
      if (!user || !pathId) return;
      const { error, alreadyDone } = await markComplete(
        user.id,
        pathId,
        lessonId,
        totalLessons,
        xpReward,
      );
      if (!error && !alreadyDone) {
        const { data } = await getEnrollment(user.id, pathId);
        setEnrollment(data);
        await refreshProfile();
      }
    },
    [user, pathId, totalLessons, refreshProfile],
  );

  return {
    enrollment,
    isEnrolled: enrollment !== null,
    loading,
    enrolling,
    enroll,
    markLessonComplete,
  };
}
