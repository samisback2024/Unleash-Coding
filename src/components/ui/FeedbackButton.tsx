import { useState } from "react";
import { MessageSquarePlus, X, Send, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { submitFeedback, type FeedbackType } from "@/services/feedback";

const FEEDBACK_TYPES: { value: FeedbackType; label: string }[] = [
  { value: "bug", label: "Bug" },
  { value: "design_issue", label: "Design Issue" },
  { value: "confusing_flow", label: "Confusing Flow" },
  { value: "feature_request", label: "Feature Request" },
  { value: "content_issue", label: "Content Issue" },
  { value: "other", label: "Other" },
];

// ─── Modal ────────────────────────────────────────────────────────────────────

function FeedbackModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const [type, setType] = useState<FeedbackType>("bug");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (message.trim().length < 10) {
      toastError("Please describe the issue in at least 10 characters.");
      return;
    }

    setLoading(true);
    const { error } = await submitFeedback(user.id, {
      page_url: window.location.pathname,
      feedback_type: type,
      message: message.trim(),
    });
    setLoading(false);

    if (error) {
      toastError("Failed to submit feedback. Please try again.");
    } else {
      success("Thanks for your feedback! 🙌");
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-[#1e2130] border border-[#2a2d3e] rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2
              id="feedback-title"
              className="text-lg font-semibold text-[#f1f5f9]"
            >
              Beta Feedback
            </h2>
            <p className="text-xs text-[#64748b] mt-0.5">
              Help us improve Unleash Coding
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748b] hover:text-[#f1f5f9] transition-colors p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type selector */}
          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">
              Feedback Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {FEEDBACK_TYPES.map((ft) => (
                <button
                  key={ft.value}
                  type="button"
                  onClick={() => setType(ft.value)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    type === ft.value
                      ? "bg-[#6c63ff]/20 border-[#6c63ff] text-[#6c63ff]"
                      : "bg-[#0f1117] border-[#2a2d3e] text-[#64748b] hover:border-[#6c63ff]/50 hover:text-[#94a3b8]"
                  }`}
                >
                  {ft.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="feedback-message"
              className="block text-sm font-medium text-[#94a3b8] mb-2"
            >
              Message
            </label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Describe the issue or suggestion in detail…"
              className="w-full bg-[#0f1117] border border-[#2a2d3e] rounded-xl px-4 py-3 text-sm text-[#f1f5f9] placeholder-[#64748b] resize-none focus:outline-none focus:ring-2 focus:ring-[#6c63ff] transition"
            />
            <p className="text-xs text-[#64748b] mt-1 text-right">
              {message.length}/1000
            </p>
          </div>

          {/* Current page */}
          <p className="text-xs text-[#64748b]">
            Page:{" "}
            <span className="font-mono text-[#94a3b8]">
              {window.location.pathname}
            </span>
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || message.trim().length < 10}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6c63ff] hover:bg-[#5b52e8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {loading ? "Sending…" : "Send Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Floating Button ──────────────────────────────────────────────────────────

export function FeedbackButton() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-[9980] flex items-center gap-2 px-4 py-2.5 bg-[#1e2130] border border-[#2a2d3e] hover:border-[#6c63ff]/60 text-[#94a3b8] hover:text-[#f1f5f9] rounded-full shadow-lg transition-all hover:shadow-[#6c63ff]/20 hover:shadow-md group"
        aria-label="Open feedback"
      >
        <MessageSquarePlus className="w-4 h-4 text-[#6c63ff]" />
        <span className="text-xs font-medium hidden sm:inline">Feedback</span>
      </button>

      {open && <FeedbackModal onClose={() => setOpen(false)} />}
    </>
  );
}
