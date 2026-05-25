import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Code2,
  Loader2,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import {
  getChallengeById,
  submitChallengeAnswer,
  getChallengesByPathId,
  hasCompletedChallenge,
} from "@/services/challenges";
import { HintBox, AnswerInput, SolutionPanel } from "@/components/challenge";
import { LessonContent } from "@/components/lesson";
import { checkAndAwardAchievements } from "@/services/gamification";
import { CompletionCelebration } from "@/components/gamification";
import type { ChallengeItem, Achievement } from "@/types";
import { supabase } from "@/lib/supabase";

const DIFF_CONFIG = {
  beginner: { variant: "success" as const, color: "#10b981" },
  intermediate: { variant: "warning" as const, color: "#f59e0b" },
  advanced: { variant: "danger" as const, color: "#ef4444" },
};

const TYPE_LABELS: Record<string, string> = {
  multiple_choice: "Multiple Choice",
  short_answer: "Short Answer",
  code_reading: "Code Reading",
  debugging: "Debugging",
  algorithm: "Algorithm Thinking",
  scenario: "Real-World Scenario",
  implementation: "Mini Implementation",
};

function ChallengeSkeleton() {
  return (
    <div className="animate-pulse max-w-3xl mx-auto space-y-4">
      <div className="h-5 bg-[#2a2d3e] rounded w-48" />
      <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-8 space-y-4">
        <div className="flex gap-2">
          <div className="h-6 bg-[#2a2d3e] rounded w-20" />
          <div className="h-6 bg-[#2a2d3e] rounded w-28" />
        </div>
        <div className="h-8 bg-[#2a2d3e] rounded w-2/3" />
        <div className="h-4 bg-[#2a2d3e] rounded w-full" />
        <div className="h-4 bg-[#2a2d3e] rounded w-4/5" />
        <div className="space-y-2 pt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-[#2a2d3e] rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

interface PathMeta {
  id: string;
  title: string;
  color: string;
}

export default function ChallengePage() {
  const { slug, challengeId } = useParams<{
    slug: string;
    challengeId: string;
  }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pathMeta, setPathMeta] = useState<PathMeta | null>(null);
  const [challenge, setChallenge] = useState<ChallengeItem | null>(null);
  const [allChallenges, setAllChallenges] = useState<ChallengeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [xpJustEarned, setXpJustEarned] = useState(0);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [celebration, setCelebration] = useState<{
    show: boolean;
    achievements: Achievement[];
  }>({ show: false, achievements: [] });

  useEffect(() => {
    if (!slug) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("learning_paths")
      .select("id, title, color")
      .eq("slug", slug)
      .single()
      .then(
        ({
          data,
        }: {
          data: { id: string; title: string; color: string } | null;
        }) => {
          if (data)
            setPathMeta({ id: data.id, title: data.title, color: data.color });
        },
      );
  }, [slug]);

  useEffect(() => {
    if (!challengeId || !pathMeta) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function load() {
      const [{ data: ch, error: chErr }, { data: all }] = await Promise.all([
        getChallengeById(challengeId!),
        getChallengesByPathId(pathMeta!.id),
      ]);

      if (chErr || !ch) {
        if (!cancelled) {
          setError(chErr ?? "Challenge not found");
          setLoading(false);
        }
        return;
      }

      let done = false;
      if (user) done = await hasCompletedChallenge(user.id, ch.id);

      if (!cancelled) {
        setChallenge(ch);
        setAllChallenges(all);
        setAlreadyDone(done);
        setSubmitted(done);
        setIsCorrect(done ? true : null);
        setShowSolution(done);
        setAnswer("");
        setWrongCount(0);
        setXpJustEarned(0);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [challengeId, pathMeta, user]);

  const handleSubmit = useCallback(async () => {
    if (!challenge || !user || !pathMeta || !answer.trim() || submitting)
      return;
    setSubmitting(true);

    const {
      isCorrect: correct,
      xpAwarded,
      alreadyDone: done,
    } = await submitChallengeAnswer(
      user.id,
      pathMeta.id,
      challenge.id,
      answer,
      challenge.expectedAnswer,
      challenge.xpReward,
    );

    setIsCorrect(correct);
    setSubmitted(true);
    setAlreadyDone(done);

    if (correct) {
      setXpJustEarned(xpAwarded);
      setShowSolution(true);
      if (user) {
        const newAch = await checkAndAwardAchievements(user.id);
        if (newAch.length > 0) {
          setCelebration({ show: true, achievements: newAch });
        }
      }
    } else {
      setWrongCount((n) => n + 1);
    }

    setSubmitting(false);
  }, [challenge, user, pathMeta, answer, submitting]);

  const handleRetry = () => {
    setAnswer("");
    setSubmitted(false);
    setIsCorrect(null);
  };
  const goTo = (id: string) => navigate(`/paths/${slug}/challenge/${id}`);

  const currentIndex = allChallenges.findIndex((c) => c.id === challenge?.id);
  const prevChallenge =
    currentIndex > 0 ? allChallenges[currentIndex - 1] : null;
  const nextChallenge =
    currentIndex < allChallenges.length - 1
      ? allChallenges[currentIndex + 1]
      : null;

  if (loading) return <ChallengeSkeleton />;

  if (error || !challenge) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#ef4444]/10 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-[#ef4444]" />
        </div>
        <p className="text-[#94a3b8] text-sm">
          {error ?? "Challenge not found"}
        </p>
        <Link
          to={`/paths/${slug}`}
          className="text-sm text-[#6c63ff] hover:underline"
        >
          ← Back to path
        </Link>
      </div>
    );
  }

  const diff = DIFF_CONFIG[challenge.difficulty] ?? DIFF_CONFIG.beginner;

  return (
    <>
      <CompletionCelebration
        show={celebration.show}
        achievements={celebration.achievements}
        xpGained={xpJustEarned}
        onClose={() => setCelebration({ show: false, achievements: [] })}
      />
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#64748b] mb-5">
          <Link
            to="/dashboard"
            className="hover:text-[#f1f5f9] transition-colors"
          >
            Dashboard
          </Link>
          <span>/</span>
          <Link
            to={`/paths/${slug}`}
            className="hover:text-[#f1f5f9] transition-colors truncate max-w-[120px]"
          >
            {pathMeta?.title}
          </Link>
          <span>/</span>
          <span className="text-[#94a3b8] truncate max-w-[160px]">
            {challenge.title}
          </span>
        </div>

        <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 sm:px-8 py-6 border-b border-[#2a2d3e]">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant={diff.variant}>{challenge.difficulty}</Badge>
              <Badge variant="default">
                <Code2 className="w-3 h-3" />
                {TYPE_LABELS[challenge.challengeType] ??
                  challenge.challengeType}
              </Badge>
              {(alreadyDone || (submitted && isCorrect)) && (
                <Badge variant="success">
                  <CheckCircle className="w-3 h-3" />
                  Solved
                </Badge>
              )}
              {xpJustEarned > 0 && (
                <span className="flex items-center gap-1 text-xs font-semibold text-[#6c63ff]">
                  <Zap className="w-3.5 h-3.5" />+{xpJustEarned} XP earned!
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-[#f1f5f9]">
              {challenge.title}
            </h1>
            <p className="text-sm text-[#64748b] mt-1">
              {challenge.description}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <div
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: `${diff.color}15`,
                  color: diff.color,
                }}
              >
                <Zap className="w-3.5 h-3.5" />
                {challenge.xpReward} XP reward
              </div>
              {allChallenges.length > 0 && (
                <span className="text-xs text-[#64748b]">
                  Challenge {currentIndex + 1} of {allChallenges.length}
                </span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="px-6 sm:px-8 py-8 space-y-6">
            {/* Instructions */}
            <div>
              <h2 className="text-sm font-semibold text-[#f1f5f9] mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#6c63ff]/20 text-[#6c63ff] text-xs flex items-center justify-center font-bold">
                  ?
                </span>
                Your Challenge
              </h2>
              <div className="text-sm text-[#94a3b8] leading-relaxed">
                <LessonContent content={challenge.instructions} />
              </div>
            </div>

            {challenge.starterCode && (
              <div>
                <h2 className="text-sm font-semibold text-[#f1f5f9] mb-3">
                  Starter Code
                </h2>
                <LessonContent
                  content={"```\n" + challenge.starterCode + "\n```"}
                />
              </div>
            )}

            {/* Answer */}
            <div>
              <h2 className="text-sm font-semibold text-[#f1f5f9] mb-3">
                Your Answer
              </h2>
              <AnswerInput
                options={challenge.options}
                value={answer}
                onChange={setAnswer}
                disabled={submitted}
                correctAnswer={submitted ? challenge.expectedAnswer : undefined}
                submitted={submitted}
              />
            </div>

            {/* Result feedback */}
            {submitted && isCorrect !== null && (
              <div
                className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border ${
                  isCorrect
                    ? "bg-[#10b981]/10 border-[#10b981]/30"
                    : "bg-[#ef4444]/10 border-[#ef4444]/30"
                }`}
              >
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-[#ef4444] shrink-0 mt-0.5" />
                )}
                <div>
                  <p
                    className={`text-sm font-semibold ${isCorrect ? "text-[#10b981]" : "text-[#ef4444]"}`}
                  >
                    {isCorrect
                      ? alreadyDone
                        ? "Already solved — great work!"
                        : "Correct! Well done 🎉"
                      : "Not quite right — try again!"}
                  </p>
                  {!isCorrect && wrongCount >= 2 && (
                    <p className="text-xs text-[#64748b] mt-1">
                      Struggling? Check the hints or view the solution below.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {!submitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={!answer.trim() || submitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6c63ff] hover:bg-[#5a52e0] text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  {submitting ? "Checking…" : "Submit Answer"}
                </button>
              ) : !isCorrect ? (
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6c63ff] hover:bg-[#5a52e0] text-white text-sm font-semibold transition-colors"
                >
                  Try Again
                </button>
              ) : null}

              {submitted && isCorrect && nextChallenge && (
                <button
                  onClick={() => goTo(nextChallenge.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-sm font-semibold transition-colors"
                >
                  Next Challenge <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {!submitted && wrongCount >= 2 && !showSolution && (
                <button
                  onClick={() => {
                    setShowSolution(true);
                    setSubmitted(true);
                  }}
                  className="text-xs text-[#64748b] hover:text-[#94a3b8] transition-colors underline underline-offset-2"
                >
                  Show solution
                </button>
              )}
            </div>

            <HintBox hints={challenge.hints} />

            {showSolution && (
              <SolutionPanel
                explanation={challenge.solutionExplanation}
                correctAnswer={challenge.expectedAnswer}
              />
            )}

            {submitted && isCorrect && !nextChallenge && (
              <div className="flex items-center gap-3 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-2xl px-5 py-4">
                <Trophy className="w-6 h-6 text-[#f59e0b] shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#f59e0b]">
                    All challenges complete!
                  </p>
                  <p className="text-xs text-[#94a3b8] mt-0.5">
                    You've finished every challenge in this path.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer nav */}
          <div className="px-6 sm:px-8 py-5 border-t border-[#2a2d3e] flex items-center justify-between gap-3">
            {prevChallenge ? (
              <button
                onClick={() => goTo(prevChallenge.id)}
                className="flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#f1f5f9] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline truncate max-w-[140px]">
                  {prevChallenge.title}
                </span>
                <span className="sm:hidden">Previous</span>
              </button>
            ) : (
              <Link
                to={`/paths/${slug}`}
                className="flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#f1f5f9] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to path
              </Link>
            )}
            {nextChallenge ? (
              <button
                onClick={() => goTo(nextChallenge.id)}
                className="flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#f1f5f9] transition-colors"
              >
                <span className="hidden sm:inline truncate max-w-[140px]">
                  {nextChallenge.title}
                </span>
                <span className="sm:hidden">Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-xs text-[#64748b]">Last challenge</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
