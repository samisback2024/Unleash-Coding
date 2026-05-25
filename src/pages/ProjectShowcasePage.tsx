import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  ExternalLink,
  GitBranch,
  AlertCircle,
  Star,
  Calendar,
} from "lucide-react";

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
import { useAuth } from "@/context/AuthContext";
import type { CommunityProject } from "@/types";
import {
  getProjectById,
  likeProject,
  unlikeProject,
  getUserLikedProjectIds,
} from "@/services/community";
import { ProjectComments, ReportButton } from "@/components/community";
import { clsx } from "clsx";

export default function ProjectShowcasePage() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const { user } = useAuth();

  const [project, setProject] = useState<CommunityProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    if (!submissionId) return;
    setLoading(true);

    Promise.all([
      getProjectById(submissionId),
      user ? getUserLikedProjectIds(user.id) : Promise.resolve([]),
    ]).then(([p, likedIds]) => {
      if (!p) {
        setNotFound(true);
      } else {
        setProject(p);
        setLikeCount(p.likeCount);
        setLiked(likedIds.includes(p.id));
      }
      setLoading(false);
    });
  }, [submissionId, user]);

  async function handleLike() {
    if (!user || likeLoading || !project) return;
    setLikeLoading(true);
    if (liked) {
      await unlikeProject(project.id);
      setLiked(false);
      setLikeCount((n) => n - 1);
    } else {
      await likeProject(project.id);
      setLiked(true);
      setLikeCount((n) => n + 1);
    }
    setLikeLoading(false);
  }

  const initials = project?.displayName
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Back */}
        <Link
          to="/community"
          className="inline-flex items-center gap-1.5 text-sm text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Community
        </Link>

        {loading ? (
          <div className="space-y-4">
            <div className="h-48 bg-[#1e2130] rounded-xl animate-pulse" />
            <div className="h-32 bg-[#1e2130] rounded-xl animate-pulse" />
          </div>
        ) : notFound ? (
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-[#ef4444] mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-[#f1f5f9]">Project not found</h2>
            <p className="text-[#94a3b8] mt-2">
              This project is private or has been removed.
            </p>
          </div>
        ) : project ? (
          <>
            {/* Project card */}
            <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-xl p-6 space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-xl font-bold text-[#f1f5f9]">{project.projectTitle}</h1>
                    {project.isFeatured && (
                      <Star className="w-4 h-4 text-[#f59e0b] fill-current shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-[#94a3b8]">{project.projectDescription}</p>
                </div>
                <span className="shrink-0 text-xs px-2.5 py-1 bg-[#6c63ff]/10 border border-[#6c63ff]/20 rounded-full text-[#6c63ff] font-medium">
                  {project.pathCategory || project.pathTitle}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <Link
                  to={`/u/${project.userId}`}
                  className="flex items-center gap-2.5 group"
                >
                  {project.avatarUrl ? (
                    <img
                      src={project.avatarUrl}
                      alt={project.displayName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#6c63ff]/20 flex items-center justify-center text-[#6c63ff] text-xs font-bold">
                      {initials || "?"}
                    </div>
                  )}
                  <span className="text-sm font-medium text-[#f1f5f9] group-hover:text-[#6c63ff] transition-colors">
                    {project.displayName}
                  </span>
                </Link>

                <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
                  <Calendar className="w-3.5 h-3.5" />
                  {timeAgo(project.submittedAt)}
                </div>
              </div>

              {/* Skills */}
              {project.skillsCovered.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {project.skillsCovered.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2 py-0.5 bg-[#252840] border border-[#2a2d3e] rounded text-[#94a3b8]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Notes */}
              {project.notes && (
                <div className="bg-[#252840] border border-[#2a2d3e] rounded-lg p-4">
                  <p className="text-sm text-[#94a3b8] whitespace-pre-line">{project.notes}</p>
                </div>
              )}

              {/* Links */}
              <div className="flex flex-wrap gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#252840] border border-[#2a2d3e] rounded-lg text-sm text-[#94a3b8] hover:text-[#f1f5f9] hover:border-[#6c63ff]/30 transition-all"
                  >
                    <GitBranch className="w-4 h-4" />
                    View Code
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#6c63ff]/10 border border-[#6c63ff]/20 rounded-lg text-sm text-[#6c63ff] hover:bg-[#6c63ff]/20 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-[#2a2d3e]">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    disabled={!user || likeLoading}
                    className={clsx(
                      "flex items-center gap-1.5 text-sm transition-colors",
                      liked
                        ? "text-[#ef4444]"
                        : "text-[#94a3b8] hover:text-[#ef4444]",
                      (!user || likeLoading) && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    <Heart className={clsx("w-4 h-4", liked && "fill-current")} />
                    {likeCount} {likeCount === 1 ? "like" : "likes"}
                  </button>
                  <span className="flex items-center gap-1.5 text-sm text-[#94a3b8]">
                    <MessageCircle className="w-4 h-4" />
                    {project.commentCount} {project.commentCount === 1 ? "comment" : "comments"}
                  </span>
                </div>
                <ReportButton submissionId={project.id} currentUserId={user?.id} />
              </div>
            </div>

            {/* Comments */}
            <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-xl p-6">
              <ProjectComments submissionId={project.id} currentUserId={user?.id} />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
