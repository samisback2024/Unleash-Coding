import { clsx } from "clsx";

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  colorClass?: string;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function ProgressBar({
  value,
  className,
  colorClass = "bg-[#6c63ff]",
  showLabel,
  size = "md",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={clsx("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-[#94a3b8] mb-1">
          <span>Progress</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div
        className={clsx(
          "w-full bg-[#2a2d3e] rounded-full overflow-hidden",
          size === "sm" ? "h-1.5" : "h-2.5",
        )}
      >
        <div
          className={clsx(
            "h-full rounded-full transition-all duration-500",
            colorClass,
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
