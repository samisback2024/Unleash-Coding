import { useState } from "react";
import { CheckCircle, XCircle, HelpCircle, Zap } from "lucide-react";
import { clsx } from "clsx";
import type { LessonQuizItem } from "@/types";
import { submitQuizAnswer } from "@/services/lesson";

interface LessonQuizProps {
  quizzes: LessonQuizItem[];
  userId: string;
  onAllAnswered: () => void;
}

interface QuizState {
  selected: string | null;
  isCorrect: boolean | null;
  submitted: boolean;
}

export function LessonQuiz({
  quizzes,
  userId,
  onAllAnswered,
}: LessonQuizProps) {
  const [states, setStates] = useState<Record<string, QuizState>>(() =>
    Object.fromEntries(
      quizzes.map((q) => [
        q.id,
        { selected: null, isCorrect: null, submitted: false },
      ]),
    ),
  );

  if (quizzes.length === 0) return null;

  const answeredCount = Object.values(states).filter((s) => s.submitted).length;
  const score = Object.values(states).filter((s) => s.isCorrect).length;
  const allDone = answeredCount === quizzes.length;

  const handleSelect = (quizId: string, option: string) => {
    if (states[quizId]?.submitted) return;
    setStates((prev) => ({
      ...prev,
      [quizId]: { ...prev[quizId], selected: option },
    }));
  };

  const handleSubmit = async (quiz: LessonQuizItem) => {
    const selected = states[quiz.id]?.selected;
    if (!selected || states[quiz.id]?.submitted) return;

    const { isCorrect } = await submitQuizAnswer(
      userId,
      quiz.id,
      selected,
      quiz.correctAnswer,
    );

    setStates((prev) => {
      const next = {
        ...prev,
        [quiz.id]: { selected, isCorrect, submitted: true },
      };
      const newAllDone = Object.values(next).every((s) => s.submitted);
      if (newAllDone) onAllAnswered();
      return next;
    });
  };

  return (
    <section className="mt-10 border-t border-[#2a2d3e] pt-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="w-5 h-5 text-[#f59e0b]" />
        <h2 className="text-base font-bold text-[#f1f5f9]">Quick Check</h2>
        {allDone && (
          <span className="ml-auto flex items-center gap-1.5 text-sm font-medium text-[#10b981]">
            <Zap className="w-4 h-4" />
            {score}/{quizzes.length} correct
          </span>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {quizzes.map((quiz, qi) => {
          const state = states[quiz.id];

          return (
            <div
              key={quiz.id}
              className="bg-[#151823] border border-[#2a2d3e] rounded-2xl p-5"
            >
              {/* Question */}
              <p className="text-sm font-medium text-[#e2e8f0] mb-4">
                <span className="text-[#6c63ff] font-bold mr-2">
                  Q{qi + 1}.
                </span>
                {quiz.question}
              </p>

              {/* Options */}
              <ul className="space-y-2.5 mb-4">
                {quiz.options.map((option) => {
                  const isSelected = state.selected === option;
                  const isSubmitted = state.submitted;
                  const isCorrect = option === quiz.correctAnswer;

                  let optionClass =
                    "border-[#2a2d3e] text-[#94a3b8] hover:border-[#6c63ff]/50 hover:text-[#e2e8f0]";
                  if (isSubmitted && isCorrect)
                    optionClass =
                      "border-[#10b981] bg-[#10b981]/10 text-[#10b981]";
                  else if (isSubmitted && isSelected && !isCorrect)
                    optionClass =
                      "border-[#ef4444] bg-[#ef4444]/10 text-[#ef4444]";
                  else if (!isSubmitted && isSelected)
                    optionClass =
                      "border-[#6c63ff] bg-[#6c63ff]/10 text-[#a5a0ff]";

                  return (
                    <li key={option}>
                      <button
                        disabled={isSubmitted}
                        onClick={() => handleSelect(quiz.id, option)}
                        className={clsx(
                          "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm text-left transition-all",
                          "disabled:cursor-default",
                          optionClass,
                        )}
                      >
                        <span
                          className={clsx(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                            isSubmitted && isCorrect
                              ? "border-[#10b981]"
                              : isSubmitted && isSelected && !isCorrect
                                ? "border-[#ef4444]"
                                : isSelected
                                  ? "border-[#6c63ff]"
                                  : "border-current",
                          )}
                        >
                          {isSubmitted && isCorrect && (
                            <CheckCircle className="w-3 h-3 text-[#10b981]" />
                          )}
                          {isSubmitted && isSelected && !isCorrect && (
                            <XCircle className="w-3 h-3 text-[#ef4444]" />
                          )}
                          {!isSubmitted && isSelected && (
                            <span className="w-2.5 h-2.5 rounded-full bg-[#6c63ff]" />
                          )}
                        </span>
                        {option}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Submit / Explanation */}
              {!state.submitted ? (
                <button
                  disabled={!state.selected}
                  onClick={() => handleSubmit(quiz)}
                  className="text-xs font-medium px-4 py-1.5 rounded-lg bg-[#6c63ff] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#5a52e0] transition-colors"
                >
                  Check Answer
                </button>
              ) : (
                <div
                  className={clsx(
                    "flex items-start gap-2 text-xs rounded-lg px-3 py-2.5",
                    state.isCorrect
                      ? "bg-[#10b981]/10 text-[#10b981]"
                      : "bg-[#ef4444]/10 text-[#ef4444]",
                  )}
                >
                  {state.isCorrect ? (
                    <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  )}
                  <span className="text-[#94a3b8]">
                    <span
                      className={
                        state.isCorrect ? "text-[#10b981]" : "text-[#ef4444]"
                      }
                    >
                      {state.isCorrect ? "Correct! " : "Not quite. "}
                    </span>
                    {quiz.explanation}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
