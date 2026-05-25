import { useState, useEffect } from "react";
import { Users, RefreshCw, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { CommunityProject } from "@/types";
import {
  getPublicProjects,
  getFeaturedProjects,
  searchProjects,
  getUserLikedProjectIds,
} from "@/services/community";
import {
  ProjectShowcaseCard,
  FeaturedProjectsSection,
  CommunitySearchFilters,
} from "@/components/community";

export default function CommunityPage() {
  const { user } = useAuth();

  const [featured, setFeatured] = useState<CommunityProject[]>([]);
  const [projects, setProjects] = useState<CommunityProject[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [pathFilter, setPathFilter] = useState("All");

  const isSearching = search.trim() !== "" || pathFilter !== "All";

  // Fetch initial data
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      getFeaturedProjects(),
      getPublicProjects(24),
      user ? getUserLikedProjectIds(user.id) : Promise.resolve([]),
    ])
      .then(([feat, all, liked]) => {
        if (cancelled) return;
        setFeatured(feat);
        const likedSet = new Set(liked);
        setLikedIds(likedSet);
        setProjects(
          all.map((p) => ({ ...p, isLikedByMe: likedSet.has(p.id) })),
        );
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load projects. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Search / filter
  useEffect(() => {
    if (!isSearching) return;
    const t = setTimeout(async () => {
      setLoading(true);
      const results = await searchProjects(search, pathFilter);
      const likedSet = likedIds;
      setProjects(
        results.map((p) => ({ ...p, isLikedByMe: likedSet.has(p.id) })),
      );
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [search, pathFilter]);

  function handleLikeToggle(id: string, liked: boolean) {
    setLikedIds((prev) => {
      const next = new Set(prev);
      liked ? next.add(id) : next.delete(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-6 h-6 text-[#6c63ff]" />
              <h1 className="text-2xl font-bold text-[#f1f5f9]">Community</h1>
            </div>
            <p className="text-sm text-[#94a3b8]">
              Discover what learners are building across all paths
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 text-sm text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Search + Filters */}
        <CommunitySearchFilters
          search={search}
          onSearchChange={setSearch}
          pathFilter={pathFilter}
          onPathFilterChange={setPathFilter}
        />

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg px-4 py-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Featured — only when not filtering */}
        {!isSearching && !loading && featured.length > 0 && (
          <FeaturedProjectsSection
            projects={featured.map((p) => ({
              ...p,
              isLikedByMe: likedIds.has(p.id),
            }))}
            currentUserId={user?.id}
          />
        )}

        {/* All Projects */}
        <section>
          {!isSearching && (
            <h2 className="text-lg font-semibold text-[#f1f5f9] mb-4">
              Recent Projects
            </h2>
          )}
          {isSearching && !loading && (
            <p className="text-sm text-[#94a3b8] mb-4">
              {projects.length} result{projects.length !== 1 ? "s" : ""} found
            </p>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-52 bg-[#1e2130] border border-[#2a2d3e] rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-12 h-12 text-[#2a2d3e] mx-auto mb-3" />
              <p className="text-[#94a3b8] font-medium">No projects found</p>
              <p className="text-sm text-[#64748b] mt-1">
                {isSearching
                  ? "Try different search terms or filters"
                  : "Be the first to share a project with the community!"}
              </p>
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
      </div>
    </div>
  );
}
