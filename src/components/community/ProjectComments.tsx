import { useState, useEffect } from "react";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import type { ProjectComment } from "@/types";

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(isoDate).toLocaleDateString();
}
import { getProjectComments, addProjectComment, deleteProjectComment } from "@/services/community";

interface Props {
  submissionId: string;
  currentUserId?: string;
}

export default function ProjectComments({ submissionId, currentUserId }: Props) {
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getProjectComments(submissionId).then((data) => {
      setComments(data);
      setLoading(false);
    });
  }, [submissionId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    await addProjectComment(submissionId, text);
    const updated = await getProjectComments(submissionId);
    setComments(updated);
    setText("");
    setSubmitting(false);
  }

  async function handleDelete(commentId: string) {
    await deleteProjectComment(commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-[#94a3b8]" />
        <span className="text-sm font-medium text-[#94a3b8]">
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </span>
      </div>

      {/* Comment form */}
      {currentUserId && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Leave a comment..."
            maxLength={500}
            className="flex-1 bg-[#252840] border border-[#2a2d3e] rounded-lg px-3 py-2 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6c63ff]/50"
          />
          <button
            type="submit"
            disabled={!text.trim() || submitting}
            className="px-3 py-2 bg-[#6c63ff] hover:bg-[#5b52e8] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-14 bg-[#252840] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-[#64748b] text-center py-4">
          No comments yet. Be the first!
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => {
            const initials = c.displayName
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div key={c.id} className="flex gap-3">
                {c.avatarUrl ? (
                  <img
                    src={c.avatarUrl}
                    alt={c.displayName}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#6c63ff]/20 flex items-center justify-center text-[#6c63ff] text-xs font-bold shrink-0 mt-0.5">
                    {initials || "?"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-[#f1f5f9]">{c.displayName}</span>
                    <span className="text-xs text-[#64748b]">
                      {timeAgo(c.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-[#94a3b8] mt-0.5 break-words">{c.comment}</p>
                </div>
                {currentUserId === c.userId && (
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-[#64748b] hover:text-[#ef4444] transition-colors shrink-0"
                    aria-label="Delete comment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
