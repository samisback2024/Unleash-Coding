import { useState } from "react";
import { CheckCircle2, Circle, ExternalLink } from "lucide-react";

// ── Data ───────────────────────────────────────────────
const DSA_QUESTIONS = [
  {
    id: 1,
    title: "Two Sum",
    topic: "Arrays",
    difficulty: "easy",
    link: "https://leetcode.com/problems/two-sum/",
  },
  {
    id: 2,
    title: "Valid Parentheses",
    topic: "Stacks",
    difficulty: "easy",
    link: "https://leetcode.com/problems/valid-parentheses/",
  },
  {
    id: 3,
    title: "Merge Two Sorted Lists",
    topic: "Linked Lists",
    difficulty: "easy",
    link: "https://leetcode.com/problems/merge-two-sorted-lists/",
  },
  {
    id: 4,
    title: "Maximum Subarray",
    topic: "Arrays",
    difficulty: "medium",
    link: "https://leetcode.com/problems/maximum-subarray/",
  },
  {
    id: 5,
    title: "Binary Tree Level Order",
    topic: "Trees",
    difficulty: "medium",
    link: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
  },
  {
    id: 6,
    title: "Climbing Stairs",
    topic: "Dynamic Prog.",
    difficulty: "easy",
    link: "https://leetcode.com/problems/climbing-stairs/",
  },
  {
    id: 7,
    title: "Longest Substring No Repeat",
    topic: "Strings",
    difficulty: "medium",
    link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
  },
  {
    id: 8,
    title: "3Sum",
    topic: "Arrays",
    difficulty: "medium",
    link: "https://leetcode.com/problems/3sum/",
  },
  {
    id: 9,
    title: "Word Break",
    topic: "Dynamic Prog.",
    difficulty: "medium",
    link: "https://leetcode.com/problems/word-break/",
  },
  {
    id: 10,
    title: "LRU Cache",
    topic: "Design",
    difficulty: "medium",
    link: "https://leetcode.com/problems/lru-cache/",
  },
  {
    id: 11,
    title: "Merge Intervals",
    topic: "Arrays",
    difficulty: "medium",
    link: "https://leetcode.com/problems/merge-intervals/",
  },
  {
    id: 12,
    title: "Coin Change",
    topic: "Dynamic Prog.",
    difficulty: "medium",
    link: "https://leetcode.com/problems/coin-change/",
  },
  {
    id: 13,
    title: "Number of Islands",
    topic: "Graphs",
    difficulty: "medium",
    link: "https://leetcode.com/problems/number-of-islands/",
  },
  {
    id: 14,
    title: "Course Schedule",
    topic: "Graphs",
    difficulty: "medium",
    link: "https://leetcode.com/problems/course-schedule/",
  },
  {
    id: 15,
    title: "Serialize Binary Tree",
    topic: "Trees",
    difficulty: "hard",
    link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
  },
  {
    id: 16,
    title: "Median of Two Sorted Arrays",
    topic: "Arrays",
    difficulty: "hard",
    link: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
  },
  {
    id: 17,
    title: "Trapping Rain Water",
    topic: "Arrays",
    difficulty: "hard",
    link: "https://leetcode.com/problems/trapping-rain-water/",
  },
  {
    id: 18,
    title: "Reverse Linked List",
    topic: "Linked Lists",
    difficulty: "easy",
    link: "https://leetcode.com/problems/reverse-linked-list/",
  },
  {
    id: 19,
    title: "Validate BST",
    topic: "Trees",
    difficulty: "medium",
    link: "https://leetcode.com/problems/validate-binary-search-tree/",
  },
  {
    id: 20,
    title: "Graph Valid Tree",
    topic: "Graphs",
    difficulty: "medium",
    link: "https://leetcode.com/problems/graph-valid-tree/",
  },
];

const BEHAVIORAL_QUESTIONS = [
  {
    id: 1,
    category: "Leadership",
    q: "Tell me about a time you led a team through a difficult challenge.",
  },
  {
    id: 2,
    category: "Conflict",
    q: "Describe a conflict with a coworker and how you resolved it.",
  },
  {
    id: 3,
    category: "Failure",
    q: "Tell me about a time you failed. What did you learn?",
  },
  {
    id: 4,
    category: "Impact",
    q: "Describe a project where you made a significant technical impact.",
  },
  {
    id: 5,
    category: "Ambiguity",
    q: "How do you handle working on a project with unclear requirements?",
  },
  {
    id: 6,
    category: "Collaboration",
    q: "Give an example of when you had to work closely with a difficult person.",
  },
  {
    id: 7,
    category: "Prioritization",
    q: "Tell me about a time when you had to juggle multiple priorities.",
  },
  {
    id: 8,
    category: "Initiative",
    q: "Describe a time you went above and beyond what was expected.",
  },
  {
    id: 9,
    category: "Feedback",
    q: "Tell me about a time you received critical feedback. How did you respond?",
  },
  {
    id: 10,
    category: "Growth",
    q: "What's the most important skill you've learned in the last year?",
  },
];

const MOCK_CHECKLIST = [
  {
    id: 1,
    category: "Preparation",
    item: "Test camera, microphone, and internet connection",
  },
  { id: 2, category: "Preparation", item: "Have pen, paper, and water ready" },
  { id: 3, category: "Preparation", item: "Choose a quiet, well-lit location" },
  {
    id: 4,
    category: "Preparation",
    item: "Research the company and role thoroughly",
  },
  {
    id: 5,
    category: "Preparation",
    item: "Review your own resume top to bottom",
  },
  {
    id: 6,
    category: "Technical",
    item: "Practice 2–3 problems on a whiteboard or shared doc",
  },
  {
    id: 7,
    category: "Technical",
    item: "Clarify requirements before writing any code",
  },
  {
    id: 8,
    category: "Technical",
    item: "Walk through your approach before implementing",
  },
  {
    id: 9,
    category: "Technical",
    item: "Test with edge cases (empty input, single element, etc.)",
  },
  {
    id: 10,
    category: "Technical",
    item: "Analyze and verbalize time + space complexity",
  },
  {
    id: 11,
    category: "Behavioral",
    item: "Prepare 5 STAR stories (leadership, conflict, failure, success, growth)",
  },
  {
    id: 12,
    category: "Behavioral",
    item: "Prepare questions to ask the interviewer",
  },
  {
    id: 13,
    category: "Follow-up",
    item: "Send a thank-you email within 24 hours",
  },
  {
    id: 14,
    category: "Follow-up",
    item: "Note down questions you struggled with to study later",
  },
];

// ── Helpers ────────────────────────────────────────────
const diffColor: Record<string, string> = {
  easy: "text-emerald-400 bg-emerald-400/10",
  medium: "text-amber-400 bg-amber-400/10",
  hard: "text-rose-400 bg-rose-400/10",
};

type Tab = "dsa" | "behavioral" | "checklist" | "star";

export default function InterviewPrepPage() {
  const [tab, setTab] = useState<Tab>("dsa");
  const [solved, setSolved] = useState<Set<number>>(() => {
    try {
      return new Set(
        JSON.parse(localStorage.getItem("interview-solved") ?? "[]"),
      );
    } catch {
      return new Set();
    }
  });
  const [checked, setChecked] = useState<Set<number>>(() => {
    try {
      return new Set(
        JSON.parse(localStorage.getItem("interview-checklist") ?? "[]"),
      );
    } catch {
      return new Set();
    }
  });
  const [starFields, setStarFields] = useState({
    situation: "",
    task: "",
    action: "",
    result: "",
  });
  const [filterTopic, setFilterTopic] = useState("All");
  const [filterDiff, setFilterDiff] = useState("All");
  const [bqIndex, setBqIndex] = useState(0);

  const toggleSolved = (id: number) => {
    setSolved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("interview-solved", JSON.stringify([...next]));
      return next;
    });
  };

  const toggleCheck = (id: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("interview-checklist", JSON.stringify([...next]));
      return next;
    });
  };

  const topics = [
    "All",
    ...Array.from(new Set(DSA_QUESTIONS.map((q) => q.topic))),
  ];
  const filteredDSA = DSA_QUESTIONS.filter(
    (q) =>
      (filterTopic === "All" || q.topic === filterTopic) &&
      (filterDiff === "All" || q.difficulty === filterDiff),
  );

  const solvedCount = DSA_QUESTIONS.filter((q) => solved.has(q.id)).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#f1f5f9]">Interview Prep</h1>
          <p className="text-[#94a3b8] mt-1">
            DSA questions, behavioral prep, mock checklist, and STAR stories.
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-[#6c63ff]">
            {solvedCount}/{DSA_QUESTIONS.length}
          </p>
          <p className="text-xs text-[#64748b]">DSA solved</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#1e2130] p-1 rounded-xl border border-[#2a2d3e] w-fit">
        {[
          { id: "dsa" as Tab, label: "DSA Questions" },
          { id: "behavioral" as Tab, label: "Behavioral" },
          { id: "checklist" as Tab, label: "Mock Checklist" },
          { id: "star" as Tab, label: "STAR Method" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === id
                ? "bg-[#6c63ff] text-white"
                : "text-[#94a3b8] hover:text-[#f1f5f9]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── DSA QUESTIONS ── */}
      {tab === "dsa" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#94a3b8]">Topic:</span>
              <select
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#1e2130] border border-[#2a2d3e] text-[#f1f5f9] text-sm outline-none"
              >
                {topics.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#94a3b8]">Difficulty:</span>
              <select
                value={filterDiff}
                onChange={(e) => setFilterDiff(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#1e2130] border border-[#2a2d3e] text-[#f1f5f9] text-sm outline-none"
              >
                {["All", "easy", "medium", "hard"].map((d) => (
                  <option key={d} className="capitalize">
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            {filteredDSA.map((q) => (
              <div
                key={q.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                  solved.has(q.id)
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-[#1e2130] border-[#2a2d3e] hover:border-[#6c63ff]/30"
                }`}
              >
                <button onClick={() => toggleSolved(q.id)} className="shrink-0">
                  {solved.has(q.id) ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#64748b] hover:text-[#6c63ff]" />
                  )}
                </button>
                <span className="w-5 text-xs text-[#64748b] shrink-0">
                  {q.id}.
                </span>
                <span
                  className={`font-medium text-sm flex-1 ${solved.has(q.id) ? "line-through text-[#64748b]" : "text-[#f1f5f9]"}`}
                >
                  {q.title}
                </span>
                <span className="text-xs text-[#64748b] hidden sm:block">
                  {q.topic}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${diffColor[q.difficulty]}`}
                >
                  {q.difficulty}
                </span>
                <a
                  href={q.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#64748b] hover:text-[#6c63ff] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── BEHAVIORAL ── */}
      {tab === "behavioral" && (
        <div className="space-y-4">
          <div className="bg-[#1e2130] rounded-xl border border-[#2a2d3e] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-[#6c63ff]/20 text-[#6c63ff] text-xs font-semibold">
                {BEHAVIORAL_QUESTIONS[bqIndex].category}
              </span>
              <span className="text-xs text-[#64748b]">
                {bqIndex + 1} / {BEHAVIORAL_QUESTIONS.length}
              </span>
            </div>
            <p className="text-lg text-[#f1f5f9] font-medium leading-relaxed">
              {BEHAVIORAL_QUESTIONS[bqIndex].q}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setBqIndex((i) => Math.max(i - 1, 0))}
                disabled={bqIndex === 0}
                className="px-4 py-2 rounded-lg bg-[#252840] text-[#94a3b8] hover:text-white text-sm disabled:opacity-40"
              >
                ← Previous
              </button>
              <button
                onClick={() =>
                  setBqIndex((i) =>
                    Math.min(i + 1, BEHAVIORAL_QUESTIONS.length - 1),
                  )
                }
                disabled={bqIndex === BEHAVIORAL_QUESTIONS.length - 1}
                className="px-4 py-2 rounded-lg bg-[#252840] text-[#94a3b8] hover:text-white text-sm disabled:opacity-40"
              >
                Next →
              </button>
              <button
                onClick={() =>
                  setBqIndex(
                    Math.floor(Math.random() * BEHAVIORAL_QUESTIONS.length),
                  )
                }
                className="px-4 py-2 rounded-lg bg-[#6c63ff] text-white text-sm ml-auto"
              >
                Random
              </button>
            </div>
          </div>
          <p className="text-sm text-[#94a3b8]">
            Use the STAR Method tab to structure your answer:{" "}
            <strong className="text-[#f1f5f9]">S</strong>ituation →{" "}
            <strong className="text-[#f1f5f9]">T</strong>ask →{" "}
            <strong className="text-[#f1f5f9]">A</strong>ction →{" "}
            <strong className="text-[#f1f5f9]">R</strong>esult
          </p>
        </div>
      )}

      {/* ── CHECKLIST ── */}
      {tab === "checklist" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#94a3b8]">
              {checked.size} / {MOCK_CHECKLIST.length} items completed
            </p>
            <button
              onClick={() => {
                setChecked(new Set());
                localStorage.removeItem("interview-checklist");
              }}
              className="text-xs text-[#64748b] hover:text-[#f87171] transition-colors"
            >
              Reset
            </button>
          </div>
          <div className="w-full h-1.5 bg-[#1e2130] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#6c63ff] rounded-full transition-all"
              style={{
                width: `${(checked.size / MOCK_CHECKLIST.length) * 100}%`,
              }}
            />
          </div>
          {["Preparation", "Technical", "Behavioral", "Follow-up"].map(
            (cat) => (
              <div key={cat} className="space-y-2">
                <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider">
                  {cat}
                </h3>
                {MOCK_CHECKLIST.filter((c) => c.category === cat).map(
                  (item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                        checked.has(item.id)
                          ? "bg-emerald-500/5 border border-emerald-500/20"
                          : "bg-[#1e2130] border border-[#2a2d3e] hover:border-[#6c63ff]/30"
                      }`}
                    >
                      {checked.has(item.id) ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#64748b] shrink-0" />
                      )}
                      <span
                        className={`text-sm ${checked.has(item.id) ? "line-through text-[#64748b]" : "text-[#f1f5f9]"}`}
                      >
                        {item.item}
                      </span>
                    </div>
                  ),
                )}
              </div>
            ),
          )}
        </div>
      )}

      {/* ── STAR METHOD ── */}
      {tab === "star" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                key: "situation" as const,
                label: "Situation",
                color: "border-blue-500/40",
                tip: "Set the context. What was the background? When did this happen?",
              },
              {
                key: "task" as const,
                label: "Task",
                color: "border-purple-500/40",
                tip: "What was your specific responsibility or challenge?",
              },
              {
                key: "action" as const,
                label: "Action",
                color: "border-amber-500/40",
                tip: "What specific steps did YOU take? Use 'I' not 'we'.",
              },
              {
                key: "result" as const,
                label: "Result",
                color: "border-emerald-500/40",
                tip: "What was the outcome? Quantify if possible (%, time, $).",
              },
            ].map(({ key, label, color, tip }) => (
              <div
                key={key}
                className={`bg-[#1e2130] border ${color} rounded-xl p-4 space-y-2`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#6c63ff]/20 text-[#6c63ff] text-sm font-bold flex items-center justify-center">
                    {label[0]}
                  </span>
                  <h3 className="font-semibold text-[#f1f5f9]">{label}</h3>
                </div>
                <p className="text-xs text-[#64748b]">{tip}</p>
                <textarea
                  rows={4}
                  value={starFields[key]}
                  onChange={(e) =>
                    setStarFields((f) => ({ ...f, [key]: e.target.value }))
                  }
                  placeholder={`Write your ${label.toLowerCase()} here…`}
                  className="w-full px-3 py-2 rounded-lg bg-[#0f1117] border border-[#2a2d3e] text-[#f1f5f9] text-sm outline-none focus:border-[#6c63ff] resize-none placeholder:text-[#64748b]"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() =>
                setStarFields({
                  situation: "",
                  task: "",
                  action: "",
                  result: "",
                })
              }
              className="px-4 py-2 rounded-lg bg-[#1e2130] border border-[#2a2d3e] text-[#94a3b8] hover:text-white text-sm"
            >
              Clear
            </button>
            <button
              onClick={() => {
                const txt = Object.entries(starFields)
                  .map(([k, v]) => `${k.toUpperCase()}:\n${v}`)
                  .join("\n\n");
                navigator.clipboard?.writeText(txt);
              }}
              className="px-4 py-2 rounded-lg bg-[#6c63ff] text-white text-sm"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
