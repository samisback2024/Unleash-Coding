import { Link } from "react-router-dom";
import {
  Clock,
  Zap,
  CheckCircle,
  Upload,
  ExternalLink,
  GitBranch,
} from "lucide-react";
import { Badge } from "@/components/ui";
import type { ProjectWithStatus } from "@/types";

const DIFF_CONFIG = {
  beginner: { variant: "success" as const },
  intermediate: { variant: "warning" as const },
  advanced: { variant: "danger" as const },
};

const PORTFOLIO_COLORS: Record<string, string> = {
  "Beginner Portfolio": "#64748b",
  "Internship Ready": "#6c63ff",
  "Junior Developer Ready": "#10b981",
  "Advanced / Company-Level": "#f59e0b",
};

interface ProjectCardProps {
  project: ProjectWithStatus;
  slug: string;
}

export function ProjectCard({ project, slug }: ProjectCardProps) {
  const diff = DIFF_CONFIG[project.difficulty] ?? DIFF_CONFIG.beginner;
  const portfolioColor = PORTFOLIO_COLORS[project.portfolioLevel] ?? "#64748b";

  return (
    <Link
      to={`/paths/${slug}/project/${project.id}`}
      className={`group block bg-[#1e2130] border rounded-2xl p-5 hover:border-[#6c63ff]/60 transition-all duration-200 ${
        project.isSubmitted ? "border-[#10b981]/40" : "border-[#2a2d3e]"
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant={diff.variant}>{project.difficulty}</Badge>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: `${portfolioColor}18`,
              color: portfolioColor,
            }}
          >
            {project.portfolioLevel}
          </span>
        </div>
        {project.isSubmitted && (
          <div className="flex items-center gap-1 text-xs font-semibold text-[#10b981] shrink-0">
            <CheckCircle className="w-3.5 h-3.5" />
            {project.isApproved ? "Approved" : "Submitted"}
          </div>
        )}
      </div>

      {/* Title + description */}
      <h3 className="text-sm font-semibold text-[#f1f5f9] group-hover:text-[#6c63ff] transition-colors mb-1.5 leading-snug">
        {project.title}
      </h3>
      <p className="text-xs text-[#64748b] line-clamp-2 mb-3">
        {project.description}
      </p>

      {/* Skills */}
      {project.skillsCovered.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {project.skillsCovered.slice(0, 3).map((s) => (
            <span
              key={s}
              className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#2a2d3e] text-[#94a3b8]"
            >
              {s}
            </span>
          ))}
          {project.skillsCovered.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#2a2d3e] text-[#64748b]">
              +{project.skillsCovered.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-[#64748b]">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />~{project.estimatedHours}h
          </span>
          <span className="flex items-center gap-1 text-[#6c63ff]">
            <Zap className="w-3 h-3" />
            {project.xpReward} XP
          </span>
        </div>

        {project.isSubmitted && project.submission?.githubUrl && (
          <span className="flex items-center gap-1 text-xs text-[#94a3b8]">
            <GitBranch className="w-3 h-3" />
            Linked
          </span>
        )}
      </div>

      {/* Submission links preview */}
      {project.isSubmitted && (
        <div className="mt-3 pt-3 border-t border-[#2a2d3e] flex flex-wrap gap-2">
          {project.submission?.githubUrl && (
            <span
              onClick={(e) => {
                e.preventDefault();
                window.open(project.submission!.githubUrl, "_blank");
              }}
              className="flex items-center gap-1 text-xs text-[#94a3b8] hover:text-[#f1f5f9] transition-colors cursor-pointer"
            >
              <GitBranch className="w-3 h-3" />
              GitHub
            </span>
          )}
          {project.submission?.demoUrl && (
            <span
              onClick={(e) => {
                e.preventDefault();
                window.open(project.submission!.demoUrl, "_blank");
              }}
              className="flex items-center gap-1 text-xs text-[#94a3b8] hover:text-[#f1f5f9] transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3 h-3" />
              Demo
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

export function SubmittedProjectCard({
  project,
}: {
  project: ProjectWithStatus;
}) {
  const portfolioColor = PORTFOLIO_COLORS[project.portfolioLevel] ?? "#64748b";

  return (
    <div className="bg-[#1e2130] border border-[#10b981]/30 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium mb-2 inline-block"
            style={{
              backgroundColor: `${portfolioColor}18`,
              color: portfolioColor,
            }}
          >
            {project.portfolioLevel}
          </span>
          <h3 className="text-sm font-semibold text-[#f1f5f9]">
            {project.title}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-[#10b981] shrink-0">
          <CheckCircle className="w-3.5 h-3.5" />
          {project.isApproved ? "Approved" : "Submitted"}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <Zap className="w-3.5 h-3.5 text-[#6c63ff]" />
        <span className="text-xs text-[#94a3b8]">
          +{project.submission?.xpAwarded ?? project.xpReward} XP earned
        </span>
      </div>

      <div className="flex items-center gap-3 mt-2">
        {project.submission?.githubUrl && (
          <a
            href={project.submission.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-[#64748b] hover:text-[#f1f5f9] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <GitBranch className="w-3 h-3" />
            <Upload className="w-3 h-3 sr-only" />
            GitHub
          </a>
        )}
        {project.submission?.demoUrl && (
          <a
            href={project.submission.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-[#64748b] hover:text-[#f1f5f9] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3 h-3" />
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
}
