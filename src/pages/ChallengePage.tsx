import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Zap,
  CheckCircle,
  XCircle,
  Code2,
  Clock,
  Trophy,
} from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { learningPaths } from "@/data/paths";

type Status = "idle" | "running" | "passed" | "failed";

export default function ChallengePage() {
  const { slug, challengeId } = useParams<{
    slug: string;
    challengeId: string;
  }>();
  const [code, setCode] = useState("# Write your solution here\n\n");
  const [status, setStatus] = useState<Status>("idle");
  const [output, setOutput] = useState("");

  const path = learningPaths.find((p) => p.slug === slug);
  const challenge =
    path?.challenges.find((c) => c.id === challengeId) ?? path?.challenges[0];

  const handleRun = () => {
    setStatus("running");
    setOutput("Running tests…");
    // Simulate test runner
    setTimeout(() => {
      const pass = code.trim().length > 20;
      setStatus(pass ? "passed" : "failed");
      setOutput(
        pass
          ? "✅ All 3 test cases passed!\n\nTest 1: PASSED (2ms)\nTest 2: PASSED (1ms)\nTest 3: PASSED (1ms)"
          : '❌ 1 test case failed.\n\nTest 1: PASSED\nTest 2: FAILED — Expected "foo" but got undefined\nTest 3: PASSED',
      );
    }, 1200);
  };

  if (!challenge) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-[#64748b]">Challenge not found.</p>
        <Link to={`/paths/${slug}`}>
          <Button>Back to Path</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 h-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#64748b]">
        <Link
          to="/dashboard"
          className="hover:text-[#f1f5f9] transition-colors"
        >
          Dashboard
        </Link>
        <span>/</span>
        {path && (
          <Link
            to={`/paths/${slug}`}
            className="hover:text-[#f1f5f9] transition-colors"
          >
            {path.title}
          </Link>
        )}
        <span>/</span>
        <span className="text-[#94a3b8]">Challenge</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[70vh]">
        {/* Left — Problem */}
        <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-[#2a2d3e]">
            <div className="flex items-center gap-2 mb-2">
              <Code2 className="w-4 h-4 text-[#6c63ff]" />
              <span className="text-xs text-[#64748b] uppercase tracking-wider font-medium">
                Challenge
              </span>
            </div>
            <h1 className="text-xl font-bold text-[#f1f5f9]">
              {challenge.title}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge
                variant={
                  challenge.difficulty === "beginner"
                    ? "success"
                    : challenge.difficulty === "intermediate"
                      ? "warning"
                      : "danger"
                }
              >
                {challenge.difficulty}
              </Badge>
              <span className="text-xs text-[#6c63ff] flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {challenge.xp} XP
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-[#f1f5f9] mb-2">
                Description
              </h2>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                {challenge.description}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#f1f5f9] mb-2">
                Example
              </h2>
              <div className="bg-[#0f1117] border border-[#2a2d3e] rounded-xl p-4 font-mono text-xs text-[#94a3b8] space-y-1">
                <div>
                  <span className="text-[#64748b]">Input: </span>nums =
                  [2,7,11,15], target = 9
                </div>
                <div>
                  <span className="text-[#64748b]">Output: </span>[0,1]
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#f1f5f9] mb-2">
                Constraints
              </h2>
              <ul className="text-sm text-[#64748b] space-y-1 list-disc list-inside">
                <li>2 ≤ nums.length ≤ 10⁴</li>
                <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
                <li>Only one valid answer exists.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#f1f5f9] mb-2">
                Hints
              </h2>
              <div className="space-y-2">
                <details className="bg-[#0f1117] border border-[#2a2d3e] rounded-xl overflow-hidden">
                  <summary className="px-4 py-3 text-xs text-[#64748b] cursor-pointer hover:text-[#94a3b8] select-none">
                    Hint 1 — Think about hash maps
                  </summary>
                  <div className="px-4 pb-3 text-xs text-[#94a3b8]">
                    A hash map lets you check if the complement exists in O(1).
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Editor + Output */}
        <div className="flex flex-col gap-4">
          {/* Code editor (textarea) */}
          <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl overflow-hidden flex-1 flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a2d3e]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]/60" />
                <div className="w-3 h-3 rounded-full bg-[#f59e0b]/60" />
                <div className="w-3 h-3 rounded-full bg-[#10b981]/60" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#64748b] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  No time limit
                </span>
                <select className="bg-[#0f1117] border border-[#2a2d3e] rounded-md text-xs text-[#94a3b8] px-2 py-1">
                  <option>Python</option>
                  <option>JavaScript</option>
                  <option>TypeScript</option>
                  <option>Java</option>
                </select>
              </div>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 w-full bg-[#0f1117] text-[#f1f5f9] font-mono text-sm p-5 resize-none focus:outline-none min-h-64"
              placeholder="# Write your solution here"
            />
          </div>

          {/* Output */}
          <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a2d3e]">
              <span className="text-xs font-medium text-[#94a3b8]">Output</span>
              {status === "passed" && (
                <div className="flex items-center gap-1.5 text-xs text-[#10b981]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  All tests passed
                </div>
              )}
              {status === "failed" && (
                <div className="flex items-center gap-1.5 text-xs text-[#ef4444]">
                  <XCircle className="w-3.5 h-3.5" />
                  Tests failed
                </div>
              )}
            </div>
            <div className="p-5 font-mono text-xs text-[#94a3b8] min-h-24 whitespace-pre-wrap">
              {output || (
                <span className="text-[#64748b]">
                  Run your code to see output here.
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <Link to={path ? `/paths/${slug}` : "/dashboard"}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={handleRun}
                loading={status === "running"}
              >
                Run Tests
              </Button>
              <Button
                onClick={handleRun}
                loading={status === "running"}
                disabled={status === "passed"}
              >
                {status === "passed" ? (
                  <>
                    <Trophy className="w-4 h-4 text-[#f59e0b]" />
                    Solved!
                  </>
                ) : (
                  "Submit Solution"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
