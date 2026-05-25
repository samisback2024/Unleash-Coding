import { useState } from "react";
import { Lightbulb, ChevronDown } from "lucide-react";
import { clsx } from "clsx";

interface HintBoxProps {
  hints: string[];
}

export function HintBox({ hints }: HintBoxProps) {
  const [revealed, setRevealed] = useState(0);
  const [open, setOpen] = useState(false);

  if (hints.length === 0) return null;

  const revealNext = () => {
    if (revealed < hints.length) setRevealed((n) => n + 1);
  };

  return (
    <div className="mt-6 rounded-2xl border border-[#f59e0b]/30 bg-[#f59e0b]/5 overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left"
      >
        <div className="flex items-center gap-2.5">
          <Lightbulb className="w-4 h-4 text-[#f59e0b]" />
          <span className="text-sm font-semibold text-[#f59e0b]">
            Hints ({revealed}/{hints.length} revealed)
          </span>
        </div>
        <ChevronDown
          className={clsx(
            "w-4 h-4 text-[#f59e0b] transition-transform",
            open ? "rotate-180" : "",
          )}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-3">
          {/* Revealed hints */}
          {hints.slice(0, revealed).map((hint, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 bg-[#f59e0b]/10 rounded-xl px-4 py-3"
            >
              <span className="text-[#f59e0b] font-bold text-xs shrink-0 mt-0.5">
                #{i + 1}
              </span>
              <p className="text-sm text-[#e2e8f0] leading-relaxed">{hint}</p>
            </div>
          ))}

          {/* Reveal button */}
          {revealed < hints.length && (
            <button
              onClick={revealNext}
              className="text-xs font-medium text-[#f59e0b] hover:text-[#fbbf24] transition-colors underline underline-offset-2"
            >
              {revealed === 0 ? "Show first hint" : "Show next hint"}
            </button>
          )}

          {revealed === hints.length && (
            <p className="text-xs text-[#64748b]">All hints revealed.</p>
          )}
        </div>
      )}
    </div>
  );
}
