import { BookOpen, Lightbulb } from "lucide-react";
import { LessonContent } from "@/components/lesson/LessonContent";

interface SolutionPanelProps {
  explanation: string;
  correctAnswer: string;
}

export function SolutionPanel({
  explanation,
  correctAnswer,
}: SolutionPanelProps) {
  return (
    <div className="mt-6 rounded-2xl border border-[#6c63ff]/30 bg-[#6c63ff]/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#6c63ff]/20">
        <BookOpen className="w-4 h-4 text-[#6c63ff]" />
        <span className="text-sm font-semibold text-[#6c63ff]">
          Solution Explanation
        </span>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Correct answer callout */}
        <div className="flex items-start gap-2.5 bg-[#10b981]/10 border border-[#10b981]/20 rounded-xl px-4 py-3">
          <Lightbulb className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-[#64748b] mb-1">Correct Answer</p>
            <p className="text-sm font-mono font-semibold text-[#10b981]">
              {correctAnswer}
            </p>
          </div>
        </div>

        {/* Explanation body */}
        <div className="text-sm text-[#94a3b8] leading-relaxed">
          <LessonContent content={explanation} />
        </div>
      </div>
    </div>
  );
}
