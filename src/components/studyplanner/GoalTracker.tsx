import { useState } from "react";
import { Plus, Trash2, Target } from "lucide-react";
import type { StudyGoal } from "@/services/studyplanner";

interface Props {
  goals: StudyGoal[];
  todayMinutes: number;
  onAdd: (title: string, minutes: number, topic?: string) => void;
  onDelete: (id: string) => void;
}

export function GoalTracker({ goals, todayMinutes, onAdd, onDelete }: Props) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState(30);
  const [topic, setTopic] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), minutes, topic.trim() || undefined);
    setTitle("");
    setMinutes(30);
    setTopic("");
    setAdding(false);
  };

  return (
    <div className="bg-[#1e2130] rounded-xl border border-[#2a2d3e] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#6c63ff]" />
          <h3 className="font-semibold text-[#f1f5f9] text-sm">Daily Goals</h3>
        </div>
        <button
          onClick={() => setAdding((v) => !v)}
          className="p-1 rounded text-[#64748b] hover:text-[#6c63ff] transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {adding && (
        <div className="bg-[#0f1117] rounded-lg border border-[#2a2d3e] p-3 space-y-2">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Goal title…"
            className="w-full px-2 py-1.5 rounded bg-transparent border border-[#2a2d3e] text-[#f1f5f9] text-sm outline-none focus:border-[#6c63ff]"
          />
          <div className="flex gap-2">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs text-[#94a3b8] whitespace-nowrap">
                Target (min):
              </span>
              <input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                min={5}
                max={480}
                className="w-16 px-2 py-1.5 rounded bg-transparent border border-[#2a2d3e] text-[#f1f5f9] text-sm outline-none focus:border-[#6c63ff]"
              />
            </div>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Topic (optional)"
              className="flex-1 px-2 py-1.5 rounded bg-transparent border border-[#2a2d3e] text-[#f1f5f9] text-sm outline-none focus:border-[#6c63ff]"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="px-3 py-1 rounded bg-[#6c63ff] text-white text-xs font-semibold hover:bg-[#5b52e0]"
            >
              Add Goal
            </button>
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1 rounded bg-[#252840] text-[#94a3b8] text-xs hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {goals.length === 0 && !adding && (
        <p className="text-[#64748b] text-sm italic">
          No goals yet. Add one to track your daily progress.
        </p>
      )}

      <div className="space-y-3">
        {goals.map((goal) => {
          const pct = Math.min(
            (todayMinutes / goal.target_minutes_daily) * 100,
            100,
          );
          return (
            <div key={goal.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-[#f1f5f9]">
                    {goal.title}
                  </span>
                  {goal.topic && (
                    <span className="ml-2 text-xs text-[#64748b]">
                      {goal.topic}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#94a3b8]">
                    {todayMinutes}m / {goal.target_minutes_daily}m
                  </span>
                  <button
                    onClick={() => onDelete(goal.id)}
                    className="text-[#64748b] hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="h-1.5 bg-[#0f1117] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-emerald-500" : "bg-[#6c63ff]"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
