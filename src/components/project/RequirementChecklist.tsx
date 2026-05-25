import { useState } from "react";
import { CheckSquare, Square } from "lucide-react";

interface RequirementChecklistProps {
  requirements: string[];
  /** Controlled checked IDs — if provided, use controlled mode */
  checked?: Set<number>;
  onChange?: (checked: Set<number>) => void;
}

export function RequirementChecklist({
  requirements,
  checked,
  onChange,
}: RequirementChecklistProps) {
  // Uncontrolled fallback state
  const [localChecked, setLocalChecked] = useState<Set<number>>(new Set());

  const checkedSet = checked ?? localChecked;
  const setChecked = onChange
    ? (next: Set<number>) => onChange(next)
    : (next: Set<number>) => setLocalChecked(new Set(next));

  const toggle = (i: number) => {
    const next = new Set(checkedSet);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setChecked(next);
  };

  const doneCount = checkedSet.size;
  const total = requirements.length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="flex items-center justify-between text-xs text-[#64748b] mb-1">
        <span>
          {doneCount}/{total} requirements checked
        </span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-1.5 bg-[#2a2d3e] rounded-full overflow-hidden mb-4">
        <div
          className="h-full rounded-full bg-[#6c63ff] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* List */}
      <ul className="space-y-2">
        {requirements.map((req, i) => {
          const done = checkedSet.has(i);
          return (
            <li key={i}>
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-start gap-3 text-left group"
              >
                {done ? (
                  <CheckSquare className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-[#2a2d3e] group-hover:text-[#6c63ff]/60 shrink-0 mt-0.5 transition-colors" />
                )}
                <span
                  className={`text-sm transition-colors ${
                    done
                      ? "line-through text-[#64748b]"
                      : "text-[#94a3b8] group-hover:text-[#f1f5f9]"
                  }`}
                >
                  {req}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
