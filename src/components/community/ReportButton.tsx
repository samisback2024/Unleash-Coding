import { useState } from "react";
import { Flag, X, AlertTriangle } from "lucide-react";
import { reportProject } from "@/services/community";

interface Props {
  submissionId: string;
  currentUserId?: string;
}

const REASONS = [
  "Inappropriate content",
  "Spam or self-promotion",
  "Plagiarism / copied work",
  "Broken / empty project",
  "Other",
];

export default function ReportButton({ submissionId, currentUserId }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!currentUserId) return null;

  async function handleReport() {
    if (!reason || submitting) return;
    setSubmitting(true);
    await reportProject(submissionId, reason);
    setDone(true);
    setSubmitting(false);
    setTimeout(() => {
      setOpen(false);
      setDone(false);
      setReason("");
    }, 1500);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-xs text-[#64748b] hover:text-[#ef4444] transition-colors"
        aria-label="Report project"
      >
        <Flag className="w-3.5 h-3.5" />
        Report
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-xl p-6 w-full max-w-sm space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />
                <h3 className="font-semibold text-[#f1f5f9]">Report Project</h3>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#64748b] hover:text-[#f1f5f9]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {done ? (
              <p className="text-sm text-[#10b981] text-center py-2">
                Thank you — your report has been submitted.
              </p>
            ) : (
              <>
                <p className="text-sm text-[#94a3b8]">Select a reason for reporting:</p>
                <div className="space-y-2">
                  {REASONS.map((r) => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="reason"
                        value={r}
                        checked={reason === r}
                        onChange={() => setReason(r)}
                        className="accent-[#6c63ff]"
                      />
                      <span className="text-sm text-[#94a3b8]">{r}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setOpen(false)}
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-[#2a2d3e] text-[#94a3b8] hover:bg-[#252840] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReport}
                    disabled={!reason || submitting}
                    className="flex-1 px-3 py-2 text-sm rounded-lg bg-[#ef4444] hover:bg-[#dc2626] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Sending..." : "Submit Report"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
