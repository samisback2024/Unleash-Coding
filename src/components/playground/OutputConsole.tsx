import { useRef, useEffect } from "react";
import { Terminal, Trash2 } from "lucide-react";

export type OutputLine = {
  type: "log" | "error" | "warn" | "info" | "system" | "table";
  text: string;
};

interface Props {
  lines: OutputLine[];
  onClear: () => void;
  isRunning: boolean;
}

const lineColor: Record<OutputLine["type"], string> = {
  log: "text-[#f1f5f9]",
  error: "text-[#f87171]",
  warn: "text-[#fbbf24]",
  info: "text-[#60a5fa]",
  system: "text-[#6c63ff]",
  table: "text-[#34d399] font-mono text-xs",
};

export function OutputConsole({ lines, onClear, isRunning }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  return (
    <div className="flex flex-col h-full bg-[#0d0f14] border-l border-[#2a2d3e]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2a2d3e] shrink-0">
        <div className="flex items-center gap-2 text-[#94a3b8] text-sm font-medium">
          <Terminal className="w-4 h-4" />
          Output
          {isRunning && (
            <span className="flex items-center gap-1 text-[#6c63ff] text-xs">
              <span className="w-2 h-2 rounded-full bg-[#6c63ff] animate-pulse" />
              running…
            </span>
          )}
        </div>
        <button
          onClick={onClear}
          title="Clear console"
          className="text-[#64748b] hover:text-[#f1f5f9] transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Lines */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-sm">
        {lines.length === 0 && (
          <p className="text-[#64748b] italic text-xs">
            Run your code to see output here.
          </p>
        )}
        {lines.map((line, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap leading-relaxed ${lineColor[line.type]}`}
          >
            {line.type === "error" && "✗ "}
            {line.type === "warn" && "⚠ "}
            {line.type === "system" && "› "}
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
