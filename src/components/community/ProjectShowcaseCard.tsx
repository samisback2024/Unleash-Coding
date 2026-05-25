import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  ExternalLink,
  Star,
  GitBranch,
} from "lucide-react";
import { clsx } from "clsx";
import type { CommunityProject } from "@/types";
import { likeProject, unlikeProject } from "@/services/community";

interface Props {
  project: CommunityProject;
  currentUserId?: string;
  onLikeToggle?: (id: string, liked: boolean) => void;
}

const PATH_COLORS: Record<string, string> = {
  Python: "text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/20",
  JavaScript: "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20",
  Frontend: "text-[#ec4899] bg-[#ec4899]/10 border-[#ec4899]/20",
  Backend: "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20",
  "Full-Stack": "text-[#6c63ff] bg-[#6c63ff]/10 border-[#6c63ff]/20",
  "AI/ML": "text-[#f97316] bg-[#f97316]/10 border-[#f97316]/20",
  DevOps: "text-[#06b6d4] bg-[#06b6d4]/10 border-[#06b6d4]/20",
  Cybersecurity: "text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/20",
};

function getPathColor(category: string): string {
  for (const key of Object.keys(PATH_COLORS)) {
    if (category?.toLowerCase().includes(key.toLowerCase()))
      return PATH_COLORS[key];
  }
  return "text-[#94a3b8] bg-[#94a3b8]/10 border-[#94a3b8]/20";
}

export default function ProjectShowcaseCard({
  project,
  currentUserId,
  onLikeToggle,
}: Props) {
  const [liked, setLiked] = useState(project.isLikedByMe ?? false);
  const [likeCount, setLikeCount] = useState(project.likeCount);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    if (!currentUserId || loading) return;
    setLoading(true);
    if (liked) {
      await unlikeProject(project.id);
      setLiked(false);
      setLikeCount((n) => n - 1);
      onLikeToggle?.(project.id, false);
    } else {
      await likeProject(project.id);
      setLiked(true);
      setLikeCount((n) => n + 1);
      onLikeToggle?.(project.id, true);
    }
    setLoading(false);
  }

  const initials = project.displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-xl p-5 flex flex-col gap-4 hover:border-[#6c63ff]/40 transition-colors">
      {/* Header: author */}
      <div className="flex items-start justify-between gap-3">
        <Link
          to={`/u/${project.userId}`}
          className="flex items-center gap-2.5 min-w-0 group"
        >
          {project.avatarUrl ? (
            <img
              src={project.avatarUrl}
              alt={project.displayName}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#6c63ff]/20 border border-[#6c63ff]/30 flex items-center justify-center text-[#6c63ff] text-xs font-bold shrink-0">
              {initials || "?"}
            </div>
          )}
          <span className="text-sm font-medium text-[#f1f5f9] truncate group-hover:text-[#6c63ff] transition-colors">
            {project.displayName}
          </span>
        </Link>

        <span
          className={clsx(
            "text-xs px-2 py-0.5 rounded-full border font-medium shrink-0",
            getPathColor(project.pathCategory),
          )}
        >
          {project.pathCategory || project.pathTitle}
        </span>
      </div>

      {/* Title + description */}
      <div>
        <Link to={`/showcase/${project.id}`} className="block group">
          <h3 className="font-semibold text-[#f1f5f9] group-hover:text-[#6c63ff] transition-colors leading-snug">
            {project.projectTitle}
          </h3>
        </Link>
        {project.notes && (
          <p className="mt-1 text-sm text-[#64748b] line-clamp-2">
            {project.notes}
          </p>
        )}
      </div>

      {/* Skills */}
      {project.skillsCovered.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.skillsCovered.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-xs px-2 py-0.5 bg-[#252840] border border-[#2a2d3e] rounded text-[#94a3b8]"
            >
              {skill}
            </span>
          ))}
          {project.skillsCovered.length > 4 && (
            <span className="text-xs px-2 py-0.5 text-[#64748b]">
              +{project.skillsCovered.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#2a2d3e] mt-auto">
        {/* Links */}
        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5" />
              Code
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Demo
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to={`/showcase/${project.id}`}
            className="flex items-center gap-1 text-xs text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            {project.commentCount}
          </Link>
          <button
            onClick={handleLike}
            disabled={!currentUserId || loading}
            className={clsx(
              "flex items-center gap-1 text-xs transition-colors",
              liked ? "text-[#ef4444]" : "text-[#94a3b8] hover:text-[#ef4444]",
              (!currentUserId || loading) && "opacity-50 cursor-not-allowed",
            )}
          >
            <Heart className={clsx("w-3.5 h-3.5", liked && "fill-current")} />
            {likeCount}
          </button>
          {project.isFeatured && (
            <Star
              className="w-3.5 h-3.5 text-[#f59e0b] fill-current"
              aria-label="Featured"
            />
          )}
        </div>
      </div>
    </div>
  );
}
