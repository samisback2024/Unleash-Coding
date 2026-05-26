import { Play, RotateCcw, Save } from "lucide-react";
import type { PlaygroundLanguage } from "@/services/playground";

interface Props {
  language: PlaygroundLanguage;
  onLanguageChange: (lang: PlaygroundLanguage) => void;
  onRun: () => void;
  onReset: () => void;
  onSave: () => void;
  isRunning: boolean;
}

const LANGUAGES: { value: PlaygroundLanguage; label: string; badge: string }[] =
  [
    { value: "javascript", label: "JavaScript", badge: "JS" },
    { value: "typescript", label: "TypeScript", badge: "TS" },
    { value: "python", label: "Python", badge: "PY" },
    { value: "sql", label: "SQL (SQLite)", badge: "SQL" },
  ];

const badgeColors: Record<PlaygroundLanguage, string> = {
  javascript: "bg-yellow-500/20 text-yellow-300",
  typescript: "bg-blue-500/20 text-blue-300",
  python: "bg-green-500/20 text-green-300",
  sql: "bg-orange-500/20 text-orange-300",
};

export function RunControls({
  language,
  onLanguageChange,
  onRun,
  onReset,
  onSave,
  isRunning,
}: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1d27] border-b border-[#2a2d3e] shrink-0">
      {/* Language selector */}
      <div className="flex items-center gap-1 bg-[#0f1117] border border-[#2a2d3e] rounded-lg p-1">
        {LANGUAGES.map((l) => (
          <button
            key={l.value}
            onClick={() => onLanguageChange(l.value)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              language === l.value
                ? `${badgeColors[l.value]} ring-1 ring-current/30`
                : "text-[#64748b] hover:text-[#94a3b8]"
            }`}
          >
            {l.badge}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#252840] transition-all"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset
      </button>
      <button
        onClick={onSave}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#252840] transition-all"
      >
        <Save className="w-3.5 h-3.5" />
        Save
      </button>
      <button
        onClick={onRun}
        disabled={isRunning}
        className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Play className="w-3.5 h-3.5 fill-current" />
        {isRunning ? "Running…" : "Run"}
      </button>
    </div>
  );
}
