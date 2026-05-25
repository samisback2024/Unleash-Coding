import { Star } from "lucide-react";
import type { CommunityProject } from "@/types";
import ProjectShowcaseCard from "./ProjectShowcaseCard";

interface Props {
  projects: CommunityProject[];
  currentUserId?: string;
}

export default function FeaturedProjectsSection({ projects, currentUserId }: Props) {
  if (!projects.length) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-[#f59e0b] fill-current" />
        <h2 className="text-lg font-semibold text-[#f1f5f9]">Featured Projects</h2>
        <span className="text-xs px-2 py-0.5 bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-full text-[#f59e0b] font-medium">
          Hand-picked
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <ProjectShowcaseCard key={p.id} project={p} currentUserId={currentUserId} />
        ))}
      </div>
    </section>
  );
}
