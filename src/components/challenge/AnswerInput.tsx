import { clsx } from "clsx";

interface AnswerInputProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  correctAnswer?: string; // shown after submission
  submitted: boolean;
}

export function AnswerInput({
  options,
  value,
  onChange,
  disabled,
  correctAnswer,
  submitted,
}: AnswerInputProps) {
  // Multiple choice if options provided
  if (options.length > 0) {
    return (
      <ul className="space-y-2.5">
        {options.map((option) => {
          const isSelected = value === option;
          const isCorrect = option === correctAnswer;

          let cls =
            "border-[#2a2d3e] text-[#94a3b8] hover:border-[#6c63ff]/50 hover:text-[#e2e8f0]";
          if (submitted && isCorrect)
            cls = "border-[#10b981] bg-[#10b981]/10 text-[#10b981]";
          else if (submitted && isSelected && !isCorrect)
            cls = "border-[#ef4444] bg-[#ef4444]/10 text-[#ef4444]";
          else if (!submitted && isSelected)
            cls = "border-[#6c63ff] bg-[#6c63ff]/10 text-[#a5a0ff]";

          return (
            <li key={option}>
              <button
                disabled={disabled}
                onClick={() => onChange(option)}
                className={clsx(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all disabled:cursor-default",
                  cls,
                )}
              >
                {/* Radio indicator */}
                <span
                  className={clsx(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                    submitted && isCorrect
                      ? "border-[#10b981]"
                      : submitted && isSelected && !isCorrect
                        ? "border-[#ef4444]"
                        : isSelected
                          ? "border-[#6c63ff]"
                          : "border-[#2a2d3e]",
                  )}
                >
                  {!submitted && isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6c63ff]" />
                  )}
                  {submitted && isCorrect && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                  )}
                  {submitted && isSelected && !isCorrect && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                  )}
                </span>
                <span className="flex-1">{option}</span>
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  // Free-text input
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      rows={3}
      placeholder="Type your answer here…"
      className={clsx(
        "w-full resize-y rounded-xl border px-4 py-3 text-sm font-mono leading-relaxed",
        "bg-[#151823] text-[#e2e8f0] placeholder-[#3a3f52]",
        "focus:outline-none focus:ring-1 transition-colors",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        submitted &&
          value.trim().toLowerCase() === correctAnswer?.trim().toLowerCase()
          ? "border-[#10b981] focus:border-[#10b981] focus:ring-[#10b981]/20"
          : submitted
            ? "border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]/20"
            : "border-[#2a2d3e] focus:border-[#6c63ff]/60 focus:ring-[#6c63ff]/20",
      )}
    />
  );
}
