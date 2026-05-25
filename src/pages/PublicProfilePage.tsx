import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  GitBranch,
  Link2,
  Globe,
  AlertCircle,
  ArrowLeft,
  FolderOpen,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { PublicProfile, CommunityProject } from "@/types";
import {
  getPublicProfile,
  getUserPublicProjects,
  getUserLikedProjectIds,
} from "@/services/community";
import { ProjectShowcaseCard } from "@/components/community";

export default function PublicProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [projects, setProjects] = useState<CommunityProject[]>([]);
  const [, setLikedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setNotFound(false);

    Promise.all([
      getPublicProfile(userId),
      getUserPublicProjects(userId),
      user ? getUserLikedProjectIds(user.id) : Promise.resolve([]),
    ]).then(([p, projs, liked]) => {
      if (!p) {
        setNotFound(true);
      } else {
        setProfile(p);
        const likedSet = new Set(liked);
        setLikedIds(likedSet);
        setProjects(projs.map((pr) => ({ ...pr, isLikedByMe: likedSet.has(pr.id) })));
      }
      setLoading(false);
    });
  }, [userId, user]);

  function handleLikeToggle(id: string, liked: boolean) {
    setLikedIds((prev) => {
      const next = new Set(prev);
      liked ? next.add(id) : next.delete(id);
      return next;
    });
  }

  const initials = profile?.displayName
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Back */}
        <Link
          to="/community"
          className="inline-flex items-center gap-1.5 text-sm text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Community
        </Link>

        {loading ? (
          <div className="space-y-6">
            <div className="h-32 bg-[#1e2130] rounded-xl animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-52 bg-[#1e2130] rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        ) : notFound ? (
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-[#ef4444] mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-[#f1f5f9]">Profile not found</h2>
            <p className="text-[#94a3b8] mt-2">
              This profile is private or doesn't exist.
            </p>
            <Link
              to="/community"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-[#6c63ff] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Community
            </Link>
          </div>
        ) : profile ? (
          <>
            {/* Profile Hero */}
            <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Avatar */}
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    className="w-16 h-16 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#6c63ff]/20 border border-[#6c63ff]/30 flex items-center justify-center text-[#6c63ff] text-xl font-bold shrink-0">
                    {initials || "?"}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-xl font-bold text-[#f1f5f9]">
                      {profile.displayName || "Anonymous"}
                    </h1>
                    {userId && user && userId === user.id && (
                      <span className="text-xs px-2 py-0.5 bg-[#6c63ff]/10 border border-[#6c63ff]/20 rounded-full text-[#6c63ff]">
                        You
                      </span>
                    )}
                  </div>

                  {profile.bio && (
                    <p className="text-sm text-[#94a3b8] mt-1 mb-3">{profile.bio}</p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-[#64748b]">
                    <span>{projects.length} public project{projects.length !== 1 ? "s" : ""}</span>
                  </div>

                  {/* Links */}
                  <div className="flex flex-wrap gap-3 mt-3">
                    {profile.githubUrl && (
                      <a
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                        GitHub
                      </a>
                    )}
                    {profile.linkedinUrl && (
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        LinkedIn
                      </a>
                    )}
                    {profile.portfolioUrl && (
                      <a
                        href={profile.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        Portfolio
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Projects */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <FolderOpen className="w-5 h-5 text-[#94a3b8]" />
                <h2 className="text-lg font-semibold text-[#f1f5f9]">Public Projects</h2>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-12 bg-[#1e2130] border border-[#2a2d3e] rounded-xl">
                  <FolderOpen className="w-10 h-10 text-[#2a2d3e] mx-auto mb-3" />
                  <p className="text-[#94a3b8]">No public projects yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((p) => (
                    <ProjectShowcaseCard
                      key={p.id}
                      project={p}
                      currentUserId={user?.id}
                      onLikeToggle={handleLikeToggle}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}
