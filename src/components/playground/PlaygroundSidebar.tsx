import { Code2, Trash2, Plus, Clock } from "lucide-react";
import type { CodeSnippet } from "@/services/playground";

interface Props {
  snippets: CodeSnippet[];
  activeId: string | null;
  onSelect: (s: CodeSnippet) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

const langColor: Record<string, string> = {
  javascript: "text-yellow-400",
  typescript: "text-blue-400",
  python: "text-green-400",
  sql: "text-orange-400",
};

export function PlaygroundSidebar({
  snippets,
  activeId,
  onSelect,
  onDelete,
  onNew,
}: Props) {
  return (
    <aside className="w-56 shrink-0 flex flex-col bg-[#1a1d27] border-r border-[#2a2d3e] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2d3e]">
        <div className="flex items-center gap-2 text-[#f1f5f9] text-sm font-semibold">
          <Code2 className="w-4 h-4 text-[#6c63ff]" />
          Snippets
        </div>
        <button
          onClick={onNew}
          title="New snippet"
          className="p-1 rounded text-[#64748b] hover:text-[#6c63ff] transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-2">
        {snippets.length === 0 && (
          <p className="text-[#64748b] text-xs px-4 py-3 italic">
            No saved snippets yet.
          </p>
        )}
        {snippets.map((s) => (
          <div
            key={s.id}
            onClick={() => onSelect(s)}
            className={`group flex items-start gap-2 px-3 py-2.5 mx-2 rounded-lg cursor-pointer transition-all ${
              activeId === s.id
                ? "bg-[#6c63ff]/20 border border-[#6c63ff]/30"
                : "hover:bg-[#252840]"
            }`}
          >
            <div className="flex-1 min-w-0">
              <p
                className={`text-xs font-semibold truncate ${
                  activeId === s.id ? "text-[#6c63ff]" : "text-[#f1f5f9]"
                }`}
              >
                {s.title}
              </p>
              <p
                className={`text-[10px] font-medium mt-0.5 ${langColor[s.language] ?? "text-[#94a3b8]"}`}
              >
                {s.language.toUpperCase()}
              </p>
              <div className="flex items-center gap-1 mt-0.5 text-[#64748b] text-[10px]">
                <Clock className="w-2.5 h-2.5" />
                {new Date(s.updated_at).toLocaleDateString()}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(s.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 text-[#64748b] hover:text-[#f87171] transition-all"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="px-4 py-3 border-t border-[#2a2d3e] text-[10px] text-[#64748b] space-y-0.5">
        <p>JS/TS — sandboxed iframe</p>
        <p>Python — Pyodide (CDN)</p>
        <p>SQL — sql.js (in-memory)</p>
      </div>
    </aside>
  );
}
