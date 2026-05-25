import { useEffect, useState } from "react";
import { X, Zap } from "lucide-react";
import type { Achievement } from "@/types";

interface CompletionCelebrationProps {
  show: boolean;
  onClose: () => void;
  xpGained?: number;
  achievements?: Achievement[];
  message?: string;
}

export function CompletionCelebration({
  show,
  onClose,
  xpGained = 0,
  achievements = [],
  message = "Well done!",
}: CompletionCelebrationProps) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (show) {
      setCurrentIdx(0);
      setVisible(true);
      setAnimating(true);

      const totalTime =
        achievements.length > 1 ? achievements.length * 2200 : 2800;
      const closeTimer = setTimeout(() => {
        setAnimating(false);
        setTimeout(() => {
          setVisible(false);
          onClose();
        }, 300);
      }, totalTime);

      return () => clearTimeout(closeTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  // Cycle through multiple achievements
  useEffect(() => {
    if (!visible || achievements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((i) => (i + 1) % achievements.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [visible, achievements.length]);

  if (!visible) return null;

  const current = achievements[currentIdx];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={() => {
        setAnimating(false);
        setTimeout(() => {
          setVisible(false);
          onClose();
        }, 200);
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        style={{
          opacity: animating ? 1 : 0,
          transition: "opacity 300ms ease",
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 bg-[#1e2130] border border-[#6c63ff]/40 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center"
        style={{
          transform: animating
            ? "scale(1) translateY(0)"
            : "scale(0.9) translateY(12px)",
          opacity: animating ? 1 : 0,
          transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          className="absolute top-3 right-3 p-1 text-[#64748b] hover:text-[#f1f5f9] transition-colors"
          onClick={() => {
            setAnimating(false);
            setTimeout(() => {
              setVisible(false);
              onClose();
            }, 200);
          }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Glow ring */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6c63ff]/10 via-transparent to-[#a855f7]/10" />
        </div>

        {current ? (
          <>
            <div className="text-5xl mb-3">{current.icon}</div>
            <div className="text-xs font-semibold text-[#6c63ff] uppercase tracking-wider mb-1">
              Achievement Unlocked!
            </div>
            <h3 className="text-lg font-bold text-[#f1f5f9] mb-1">
              {current.name}
            </h3>
            <p className="text-sm text-[#94a3b8] mb-4">{current.description}</p>
            <div className="inline-flex items-center gap-1.5 bg-[#6c63ff]/15 border border-[#6c63ff]/30 rounded-full px-4 py-1.5">
              <Zap className="w-3.5 h-3.5 text-[#6c63ff]" />
              <span className="text-sm font-bold text-[#6c63ff]">
                +{current.xpReward} XP
              </span>
            </div>
            {achievements.length > 1 && (
              <div className="flex justify-center gap-1 mt-4">
                {achievements.map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full transition-colors"
                    style={{
                      backgroundColor: i === currentIdx ? "#6c63ff" : "#2a2d3e",
                    }}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-[#f1f5f9] mb-2">{message}</h3>
            {xpGained > 0 && (
              <div className="inline-flex items-center gap-1.5 bg-[#6c63ff]/15 border border-[#6c63ff]/30 rounded-full px-4 py-1.5">
                <Zap className="w-3.5 h-3.5 text-[#6c63ff]" />
                <span className="text-sm font-bold text-[#6c63ff]">
                  +{xpGained} XP
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
