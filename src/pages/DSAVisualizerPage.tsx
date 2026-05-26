import { useState } from "react";
import {
  SortingVisualizer,
  SearchVisualizer,
  StackQueueVisualizer,
  TreeVisualizer,
} from "@/components/dsa";

type Tab = "sorting" | "searching" | "structures" | "trees";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "sorting", label: "Sorting", icon: "📊" },
  { id: "searching", label: "Searching", icon: "🔍" },
  { id: "structures", label: "Data Structures", icon: "📦" },
  { id: "trees", label: "Binary Tree", icon: "🌳" },
];

export default function DSAVisualizerPage() {
  const [tab, setTab] = useState<Tab>("sorting");

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#f1f5f9]">DSA Visualizer</h1>
        <p className="text-[#94a3b8] mt-1">
          Watch algorithms and data structures come to life — step by step.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#1e2130] p-1 rounded-xl border border-[#2a2d3e] w-fit">
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === id
                ? "bg-[#6c63ff] text-white shadow"
                : "text-[#94a3b8] hover:text-[#f1f5f9]"
            }`}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-[#1e2130] rounded-xl border border-[#2a2d3e] p-6">
        {tab === "sorting" && <SortingVisualizer />}
        {tab === "searching" && <SearchVisualizer />}
        {tab === "structures" && <StackQueueVisualizer />}
        {tab === "trees" && <TreeVisualizer />}
      </div>
    </div>
  );
}
