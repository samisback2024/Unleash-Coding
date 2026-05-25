import { useState } from "react";
import {
  GitBranch,
  ExternalLink,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { ProjectSubmission } from "@/types";

interface ProjectSubmissionFormProps {
  projectTitle: string;
  xpReward: number;
  existing: ProjectSubmission | null;
  onSubmit: (githubUrl: string, demo: string, notes: string) => Promise<void>;
  submitting: boolean;
  /** Called after successful submission */
  submitted: boolean;
  xpJustEarned: number;
}

export function ProjectSubmissionForm({
  projectTitle,
  xpReward,
  existing,
  onSubmit,
  submitting,
  submitted,
  xpJustEarned,
}: ProjectSubmissionFormProps) {
  const [githubUrl, setGithubUrl] = useState(existing?.githubUrl ?? "");
  const [demo, setDemo] = useState(existing?.demoUrl ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!githubUrl.trim()) {
      setError("GitHub repository URL is required.");
      return;
    }

    // Basic URL validation
    try {
      const url = new URL(githubUrl.trim());
      if (!url.hostname.includes("github.com")) {
        setError("Please enter a valid GitHub URL.");
        return;
      }
    } catch {
      setError("Please enter a valid URL (e.g. https://github.com/you/repo).");
      return;
    }

    if (demo.trim() && !/^https?:\/\//.test(demo.trim())) {
      setError("Demo URL must start with http:// or https://");
      return;
    }

    await onSubmit(githubUrl.trim(), demo.trim(), notes.trim());
  };

  const isUpdate = existing !== null;

  return (
    <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#2a2d3e] flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#f1f5f9] flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#6c63ff]" />
          {isUpdate ? "Update Submission" : "Submit Your Project"}
        </h2>
        {!isUpdate && (
          <span className="text-xs text-[#6c63ff] font-semibold">
            +{xpReward} XP on submit
          </span>
        )}
      </div>

      {/* Success banner */}
      {submitted && (
        <div className="mx-6 mt-4 flex items-start gap-3 bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl px-4 py-3">
          <CheckCircle className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#10b981]">
              {isUpdate
                ? "Submission updated!"
                : `"${projectTitle}" submitted successfully!`}
            </p>
            {xpJustEarned > 0 && (
              <p className="text-xs text-[#64748b] mt-0.5">
                +{xpJustEarned} XP added to your profile.
              </p>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
        {/* GitHub URL */}
        <div>
          <label className="block text-xs font-semibold text-[#f1f5f9] mb-2">
            <span className="flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" />
              GitHub Repository URL *
            </span>
          </label>
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/yourname/project-name"
            className="w-full bg-[#0f1117] border border-[#2a2d3e] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6c63ff] transition-colors"
          />
        </div>

        {/* Demo URL */}
        <div>
          <label className="block text-xs font-semibold text-[#f1f5f9] mb-2">
            <span className="flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" />
              Live Demo URL{" "}
              <span className="text-[#64748b] font-normal">(optional)</span>
            </span>
          </label>
          <input
            type="url"
            value={demo}
            onChange={(e) => setDemo(e.target.value)}
            placeholder="https://your-project.vercel.app"
            className="w-full bg-[#0f1117] border border-[#2a2d3e] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6c63ff] transition-colors"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-[#f1f5f9] mb-2">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Notes{" "}
              <span className="text-[#64748b] font-normal">(optional)</span>
            </span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Anything you want to share about your implementation, challenges you faced, or what you'd improve next..."
            className="w-full bg-[#0f1117] border border-[#2a2d3e] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6c63ff] transition-colors resize-none"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-xs text-[#ef4444]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#6c63ff] hover:bg-[#5a52e0] text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting…
            </>
          ) : isUpdate ? (
            "Update Submission"
          ) : (
            "Submit Project"
          )}
        </button>

        {isUpdate && (
          <p className="text-center text-xs text-[#64748b]">
            You already submitted this project. Updating won't re-award XP.
          </p>
        )}
      </form>
    </div>
  );
}
