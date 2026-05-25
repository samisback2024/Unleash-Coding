import { clsx } from "clsx";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "accent";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-[#2a2d3e] text-[#94a3b8]",
  success: "bg-[#10b981]/20 text-[#10b981]",
  warning: "bg-[#f59e0b]/20 text-[#f59e0b]",
  danger: "bg-[#ef4444]/20 text-[#ef4444]",
  info: "bg-[#3b82f6]/20 text-[#3b82f6]",
  accent: "bg-[#6c63ff]/20 text-[#6c63ff]",
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
