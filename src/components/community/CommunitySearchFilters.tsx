import { Search, Filter, X } from "lucide-react";
import { clsx } from "clsx";

const PATH_FILTERS = [
  "All",
  "Python",
  "JavaScript",
  "Frontend",
  "Backend",
  "Full-Stack",
  "AI/ML",
  "DevOps",
  "Cybersecurity",
];

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  pathFilter: string;
  onPathFilterChange: (v: string) => void;
}

export default function CommunitySearchFilters({
  search,
  onSearchChange,
  pathFilter,
  onPathFilterChange,
}: Props) {
  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects, skills, creators..."
          className="w-full pl-9 pr-9 py-2.5 bg-[#1e2130] border border-[#2a2d3e] rounded-lg text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6c63ff]/50"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#f1f5f9]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Path filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-[#64748b] shrink-0" />
        {PATH_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => onPathFilterChange(f)}
            className={clsx(
              "shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-all",
              pathFilter === f
                ? "bg-[#6c63ff]/20 border-[#6c63ff]/40 text-[#6c63ff]"
                : "bg-[#1e2130] border-[#2a2d3e] text-[#94a3b8] hover:border-[#6c63ff]/30 hover:text-[#f1f5f9]",
            )}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}
