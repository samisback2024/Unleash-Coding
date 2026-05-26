import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  ClipboardList,
} from "lucide-react";

interface Task {
  id: string;
  text: string;
  done: boolean;
}

function getStorageKey() {
  return `study-tasks-${new Date().toISOString().split("T")[0]}`;
}

function loadTasks(): Task[] {
  try {
    return JSON.parse(localStorage.getItem(getStorageKey()) ?? "[]");
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(getStorageKey(), JSON.stringify(tasks));
}

export function TaskChecklist() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [input, setInput] = useState("");

  const update = (next: Task[]) => {
    setTasks(next);
    saveTasks(next);
  };

  const add = () => {
    const t = input.trim();
    if (!t) return;
    update([...tasks, { id: `${Date.now()}`, text: t, done: false }]);
    setInput("");
  };

  const toggle = (id: string) =>
    update(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id: string) => update(tasks.filter((t) => t.id !== id));

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div className="bg-[#1e2130] rounded-xl border border-[#2a2d3e] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-[#6c63ff]" />
          <h3 className="font-semibold text-[#f1f5f9] text-sm">
            Today's Tasks
          </h3>
        </div>
        {tasks.length > 0 && (
          <span className="text-xs text-[#94a3b8]">
            {doneCount}/{tasks.length}
          </span>
        )}
      </div>

      {/* Add task */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a task…"
          className="flex-1 px-3 py-1.5 rounded-lg bg-[#0f1117] border border-[#2a2d3e] text-[#f1f5f9] text-sm outline-none focus:border-[#6c63ff] placeholder:text-[#64748b]"
        />
        <button
          onClick={add}
          className="px-3 py-1.5 rounded-lg bg-[#6c63ff] text-white hover:bg-[#5b52e0] transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task list */}
      {tasks.length === 0 && (
        <p className="text-[#64748b] text-sm italic">No tasks for today yet.</p>
      )}

      {tasks.length > 0 && (
        <div className="w-full h-1 bg-[#0f1117] rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{
              width: `${tasks.length ? (doneCount / tasks.length) * 100 : 0}%`,
            }}
          />
        </div>
      )}

      <div className="space-y-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all group ${
              task.done ? "opacity-60" : "hover:bg-[#252840]"
            }`}
          >
            <button onClick={() => toggle(task.id)} className="shrink-0">
              {task.done ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <Circle className="w-4 h-4 text-[#64748b] hover:text-[#6c63ff]" />
              )}
            </button>
            <span
              className={`flex-1 text-sm ${task.done ? "line-through text-[#64748b]" : "text-[#f1f5f9]"}`}
            >
              {task.text}
            </span>
            <button
              onClick={() => remove(task.id)}
              className="opacity-0 group-hover:opacity-100 text-[#64748b] hover:text-rose-400 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
