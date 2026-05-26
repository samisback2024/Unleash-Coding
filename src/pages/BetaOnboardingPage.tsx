import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Rocket,
  BookOpen,
  Code2,
  Trophy,
  Users,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { trackUserActivity } from "@/services/beta";

const STEPS = [
  {
    icon: Rocket,
    title: "Welcome to Unleash Coding Beta!",
    subtitle: "Thanks for being an early adopter.",
    body: "You're one of the first people to experience the platform. Your feedback will shape the future of Unleash Coding.",
    color: "#6c63ff",
  },
  {
    icon: BookOpen,
    title: "Start with a Learning Path",
    subtitle: "Structured, beginner-to-advanced roadmaps.",
    body: "Pick a path that matches your goal — Frontend, Backend, Full-Stack, and more. Each path has lessons, challenges, and portfolio projects.",
    color: "#10b981",
  },
  {
    icon: Code2,
    title: "Solve Real Challenges",
    subtitle: "Build problem-solving skills that employers value.",
    body: "Every path comes with coding challenges and quizzes. Earn XP for each correct answer and track your streak.",
    color: "#f59e0b",
  },
  {
    icon: Trophy,
    title: "Build & Submit Projects",
    subtitle: "Create a portfolio that gets you hired.",
    body: "Complete real-world projects, submit your GitHub URL, and add them to your public portfolio. Show employers what you can build.",
    color: "#a855f7",
  },
  {
    icon: Users,
    title: "Join the Community",
    subtitle: "You're not learning alone.",
    body: "Share your projects in the Community Showcase, like and comment on others' work, and climb the global leaderboard.",
    color: "#3b82f6",
  },
];

export default function BetaOnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  async function handleNext() {
    if (isLast) {
      if (user) {
        await trackUserActivity(user.id, "onboarding_completed", {
          steps: STEPS.length,
        });
      }
      navigate("/dashboard");
    } else {
      setStep((s) => s + 1);
    }
  }

  const Icon = current.icon;

  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col items-center justify-center p-6">
      {/* Progress dots */}
      <div className="flex gap-2 mb-10">
        {STEPS.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`rounded-full transition-all ${
              i === step
                ? "w-6 h-2 bg-[#6c63ff]"
                : i < step
                  ? "w-2 h-2 bg-[#6c63ff]/50"
                  : "w-2 h-2 bg-[#2a2d3e]"
            }`}
            aria-label={`Step ${i + 1}`}
          />
        ))}
      </div>

      {/* Card */}
      <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-8 max-w-md w-full text-center">
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{
            backgroundColor: `${current.color}18`,
            border: `1px solid ${current.color}30`,
          }}
        >
          <Icon className="w-8 h-8" style={{ color: current.color }} />
        </div>

        <h2 className="text-xl font-bold text-[#f1f5f9] mb-1">
          {current.title}
        </h2>
        <p
          className="text-sm font-medium mb-4"
          style={{ color: current.color }}
        >
          {current.subtitle}
        </p>
        <p className="text-sm text-[#64748b] leading-relaxed mb-8">
          {current.body}
        </p>

        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#6c63ff] hover:bg-[#5b52e8] text-white font-semibold rounded-xl transition-colors"
        >
          {isLast ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Go to Dashboard
            </>
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {!isLast && (
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-3 text-xs text-[#64748b] hover:text-[#94a3b8] transition-colors"
          >
            Skip tour
          </button>
        )}
      </div>

      {/* Step counter */}
      <p className="mt-5 text-xs text-[#64748b]">
        {step + 1} of {STEPS.length}
      </p>
    </div>
  );
}
