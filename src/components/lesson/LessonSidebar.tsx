import { Link } from "react-router-dom";
import {
  CheckCircle,
  Circle,
  BookOpen,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import type { ModuleWithLessons } from "@/types";
import { useState } from "react";
import { clsx } from "clsx";

interface LessonSidebarProps {
  modules: ModuleWithLessons[];
  currentLessonId: string;
  completedLessonIds: string[];
  slug: string;
  open: boolean;
  onClose: () => void;
}

export function LessonSidebar({
  modules,
  currentLessonId,
  completedLessonIds,
  slug,
  open,
  onClose,
}: LessonSidebarProps) {
  // Auto-expand the module that contains the current lesson
  const activeModuleId = modules.find((m) =>
    m.lessons.some((l) => l.id === currentLessonId),
  )?.id;

  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(activeModuleId ? [activeModuleId] : [modules[0]?.id ?? ""]),
  );

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const sidebar = (
    <aside className="flex flex-col h-full bg-[#151823] border-r border-[#2a2d3e] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#2a2d3e] shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#6c63ff]" />
          <span className="text-sm font-semibold text-[#f1f5f9]">Lessons</span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded text-[#64748b] hover:text-[#f1f5f9] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Module list */}
      <nav className="flex-1 overflow-y-auto py-2">
        {modules.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-[#64748b]">
            No lessons yet.
          </div>
        ) : (
          modules.map((mod) => {
            const isExpanded = expanded.has(mod.id);
            const doneCount = mod.lessons.filter((l) =>
              completedLessonIds.includes(l.id),
            ).length;

            return (
              <div key={mod.id}>
                {/* Module header */}
                <button
                  onClick={() => toggle(mod.id)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-[#1e2130] transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-[#64748b] shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-[#64748b] shrink-0" />
                  )}
                  <span className="flex-1 text-xs font-semibold text-[#94a3b8] uppercase tracking-wide truncate">
                    {mod.title}
                  </span>
                  <span className="text-[10px] text-[#64748b] shrink-0">
                    {doneCount}/{mod.lessons.length}
                  </span>
                </button>

                {/* Lessons */}
                {isExpanded && (
                  <ul className="pb-1">
                    {mod.lessons.map((lesson) => {
                      const isDone = completedLessonIds.includes(lesson.id);
                      const isCurrent = lesson.id === currentLessonId;
                      return (
                        <li key={lesson.id}>
                          <Link
                            to={`/paths/${slug}/lesson/${lesson.id}`}
                            onClick={onClose}
                            className={clsx(
                              "flex items-center gap-2.5 pl-8 pr-4 py-2 text-xs transition-all",
                              isCurrent
                                ? "bg-[#6c63ff]/15 text-[#a5a0ff] border-r-2 border-[#6c63ff]"
                                : "text-[#64748b] hover:text-[#94a3b8] hover:bg-[#1e2130]",
                            )}
                          >
                            {isDone ? (
                              <CheckCircle className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                            ) : (
                              <Circle
                                className={clsx(
                                  "w-3.5 h-3.5 shrink-0",
                                  isCurrent
                                    ? "text-[#6c63ff]"
                                    : "text-[#2a2d3e]",
                                )}
                              />
                            )}
                            <span className="flex-1 truncate leading-relaxed">
                              {lesson.title}
                            </span>
                            <span className="shrink-0 text-[10px] text-[#64748b]">
                              {lesson.duration}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })
        )}
      </nav>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-[260px] shrink-0 sticky top-0 h-screen">
        {sidebar}
      </div>

      {/* Mobile drawer overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="relative w-72 h-full">{sidebar}</div>
        </div>
      )}
    </>
  );
}
