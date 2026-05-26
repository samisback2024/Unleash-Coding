import { useState, useEffect } from "react";
import { Timer, PlayCircle, X } from "lucide-react";
import {
  CalendarHeatmap,
  GoalTracker,
  TaskChecklist,
} from "@/components/studyplanner";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  getStudyGoals,
  createStudyGoal,
  deleteStudyGoal,
  getStudySessions,
  logStudySession,
  type StudyGoal,
  type StudySession,
} from "@/services/studyplanner";

export default function StudyPlannerPage() {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [logOpen, setLogOpen] = useState(false);
  const [logMinutes, setLogMinutes] = useState(30);
  const [logTopic, setLogTopic] = useState("");
  const [logNotes, setLogNotes] = useState("");
  const [logging, setLogging] = useState(false);

  const loadData = async () => {
    if (!user) return;
    try {
      const [g, s] = await Promise.all([
        getStudyGoals(user.id),
        getStudySessions(user.id),
      ]);
      setGoals(g ?? []);
      setSessions(s ?? []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const todayStr = new Date().toISOString().split("T")[0];
  const todayMinutes = sessions
    .filter((s) => s.session_date === todayStr)
    .reduce((acc, s) => acc + s.duration_minutes, 0);

  const weekMinutes = sessions
    .filter((s) => {
      const d = new Date(s.session_date);
      const now = new Date();
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff < 7;
    })
    .reduce((acc, s) => acc + s.duration_minutes, 0);

  const handleAddGoal = async (
    title: string,
    minutes: number,
    topic?: string,
  ) => {
    if (!user) return;
    try {
      await createStudyGoal(user.id, title, minutes, topic);
      await loadData();
      success("Goal added");
    } catch {
      toastError("Failed to add goal");
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await deleteStudyGoal(id);
      setGoals((g) => g.filter((x) => x.id !== id));
    } catch {
      toastError("Failed to delete goal");
    }
  };

  const handleLogSession = async () => {
    if (!user || logMinutes <= 0) return;
    setLogging(true);
    try {
      await logStudySession(
        user.id,
        logMinutes,
        logTopic || undefined,
        logNotes || undefined,
      );
      setLogOpen(false);
      setLogTopic("");
      setLogNotes("");
      setLogMinutes(30);
      await loadData();
      success(`Logged ${logMinutes} min session`);
    } catch {
      toastError("Failed to log session");
    } finally {
      setLogging(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 rounded-full border-2 border-[#6c63ff] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#f1f5f9]">Study Planner</h1>
          <p className="text-[#94a3b8] mt-1">
            Track study sessions, set daily goals, and visualize your progress.
          </p>
        </div>
        <button
          onClick={() => setLogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6c63ff] hover:bg-[#5b52e0] text-white font-semibold text-sm transition-all"
        >
          <PlayCircle className="w-4 h-4" />
          Log Session
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Today", value: `${todayMinutes}m`, sub: "minutes studied" },
          {
            label: "This Week",
            value: `${Math.floor(weekMinutes / 60)}h ${weekMinutes % 60}m`,
            sub: "total study time",
          },
          {
            label: "Sessions",
            value: sessions.length.toString(),
            sub: "all time",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#1e2130] rounded-xl border border-[#2a2d3e] p-4 text-center"
          >
            <p className="text-xs text-[#94a3b8] uppercase tracking-wide font-medium">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-[#6c63ff] mt-1">
              {stat.value}
            </p>
            <p className="text-xs text-[#64748b] mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="bg-[#1e2130] rounded-xl border border-[#2a2d3e] p-5">
        <CalendarHeatmap sessions={sessions} />
      </div>

      {/* Goals + Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GoalTracker
          goals={goals}
          todayMinutes={todayMinutes}
          onAdd={handleAddGoal}
          onDelete={handleDeleteGoal}
        />
        <TaskChecklist />
      </div>

      {/* Log Session Modal */}
      {logOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e2130] rounded-2xl border border-[#2a2d3e] p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-[#6c63ff]" />
                <h2 className="text-lg font-bold text-[#f1f5f9]">
                  Log Study Session
                </h2>
              </div>
              <button
                onClick={() => setLogOpen(false)}
                className="text-[#64748b] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#94a3b8] font-medium">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min={1}
                  max={480}
                  value={logMinutes}
                  onChange={(e) => setLogMinutes(Number(e.target.value))}
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-[#0f1117] border border-[#2a2d3e] text-[#f1f5f9] text-sm outline-none focus:border-[#6c63ff]"
                />
              </div>
              <div>
                <label className="text-xs text-[#94a3b8] font-medium">
                  Topic (optional)
                </label>
                <input
                  value={logTopic}
                  onChange={(e) => setLogTopic(e.target.value)}
                  placeholder="e.g. React, Algorithms, System Design…"
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-[#0f1117] border border-[#2a2d3e] text-[#f1f5f9] text-sm outline-none focus:border-[#6c63ff] placeholder:text-[#64748b]"
                />
              </div>
              <div>
                <label className="text-xs text-[#94a3b8] font-medium">
                  Notes (optional)
                </label>
                <textarea
                  rows={2}
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-[#0f1117] border border-[#2a2d3e] text-[#f1f5f9] text-sm outline-none focus:border-[#6c63ff] resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setLogOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#252840] text-[#94a3b8] hover:text-white text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLogSession}
                disabled={logging || logMinutes <= 0}
                className="flex-1 py-2.5 rounded-xl bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-sm font-semibold transition-all disabled:opacity-50"
              >
                {logging ? "Saving…" : "Log Session"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
