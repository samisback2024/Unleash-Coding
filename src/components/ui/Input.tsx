import { type InputHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#94a3b8] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              "w-full bg-[#1a1d27] border rounded-lg text-[#f1f5f9] placeholder-[#64748b]",
              "focus:outline-none focus:ring-2 focus:ring-[#6c63ff] focus:border-[#6c63ff] transition-all",
              "py-2.5 text-sm",
              icon ? "pl-10 pr-4" : "px-4",
              error ? "border-[#ef4444]" : "border-[#2a2d3e]",
              className,
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-[#ef4444]">{error}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";
