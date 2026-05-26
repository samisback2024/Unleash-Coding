import { useState } from "react";
import { X, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BetaBannerProps {
  /** Override message */
  message?: string;
}

export function BetaBanner({ message }: BetaBannerProps) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem("beta-banner-dismissed") === "1";
    } catch {
      return false;
    }
  });

  function dismiss() {
    try {
      localStorage.setItem("beta-banner-dismissed", "1");
    } catch {
      // ignore
    }
    setDismissed(true);
  }

  if (dismissed) return null;

  return (
    <div className="w-full bg-gradient-to-r from-[#6c63ff]/20 via-[#a855f7]/15 to-[#6c63ff]/20 border-b border-[#6c63ff]/30 px-4 py-2.5 flex items-center justify-between gap-3 relative">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Zap className="w-4 h-4 text-[#6c63ff] shrink-0" />
        <p className="text-sm text-[#c4bfff] truncate">
          {message ??
            "You're using an early beta build of Unleash Coding — your feedback shapes the product!"}
        </p>
        <Link
          to="/onboarding"
          className="hidden sm:inline-flex items-center gap-1 text-xs text-[#6c63ff] hover:text-[#a78bfa] whitespace-nowrap shrink-0 transition-colors"
        >
          Take the tour <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <button
        onClick={dismiss}
        className="text-[#64748b] hover:text-[#f1f5f9] transition-colors shrink-0 p-0.5"
        aria-label="Dismiss beta banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
