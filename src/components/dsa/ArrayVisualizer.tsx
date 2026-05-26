import { useState, useCallback } from "react";

// ── Array + Search visualizer ──────────────────────────
interface ArrayCell {
  value: number;
  state: "normal" | "comparing" | "found" | "excluded";
}

type SearchAlg = "linear" | "binary";

function generateSortedArray(size: number): number[] {
  const arr: number[] = [];
  let cur = Math.floor(Math.random() * 5) + 1;
  for (let i = 0; i < size; i++) {
    arr.push(cur);
    cur += Math.floor(Math.random() * 8) + 1;
  }
  return arr;
}

function linearSearchSteps(
  arr: number[],
  target: number,
): { cells: ArrayCell[]; description: string }[] {
  const steps: { cells: ArrayCell[]; description: string }[] = [];
  for (let i = 0; i < arr.length; i++) {
    const cells: ArrayCell[] = arr.map((v, j) => ({
      value: v,
      state: j < i ? "excluded" : j === i ? "comparing" : "normal",
    }));
    steps.push({
      cells,
      description: `Checking index ${i}: ${arr[i]} === ${target}? ${arr[i] === target ? "✓ Found!" : "✗"}`,
    });
    if (arr[i] === target) {
      cells[i].state = "found";
      steps.push({
        cells: [...cells],
        description: `Found ${target} at index ${i}!`,
      });
      return steps;
    }
  }
  steps.push({
    cells: arr.map((v) => ({ value: v, state: "excluded" as const })),
    description: `${target} not found in array.`,
  });
  return steps;
}

function binarySearchSteps(
  arr: number[],
  target: number,
): { cells: ArrayCell[]; description: string }[] {
  const steps: { cells: ArrayCell[]; description: string }[] = [];
  let low = 0,
    high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const cells: ArrayCell[] = arr.map((v, i) => ({
      value: v,
      state:
        i < low || i > high ? "excluded" : i === mid ? "comparing" : "normal",
    }));
    steps.push({
      cells,
      description: `low=${low}, high=${high}, mid=${mid} → a[${mid}]=${arr[mid]}. Target=${target}`,
    });
    if (arr[mid] === target) {
      cells[mid].state = "found";
      steps.push({
        cells: [...cells],
        description: `Found ${target} at index ${mid}!`,
      });
      return steps;
    } else if (arr[mid] < target) {
      low = mid + 1;
      steps.push({
        cells: arr.map((v, i) => ({
          value: v,
          state: i <= mid ? ("excluded" as const) : ("normal" as const),
        })),
        description: `${arr[mid]} < ${target} → search right half`,
      });
    } else {
      high = mid - 1;
      steps.push({
        cells: arr.map((v, i) => ({
          value: v,
          state: i >= mid ? ("excluded" as const) : ("normal" as const),
        })),
        description: `${arr[mid]} > ${target} → search left half`,
      });
    }
  }
  steps.push({
    cells: arr.map((v) => ({ value: v, state: "excluded" as const })),
    description: `${target} not found.`,
  });
  return steps;
}

const cellColor: Record<ArrayCell["state"], string> = {
  normal: "bg-[#6c63ff] text-white",
  comparing: "bg-amber-400 text-black",
  found: "bg-emerald-500 text-white ring-2 ring-emerald-300",
  excluded: "bg-[#1e2130] text-[#64748b]",
};

export function SearchVisualizer() {
  const [algorithm, setAlgorithm] = useState<SearchAlg>("linear");
  const [arr] = useState(() => generateSortedArray(16));
  const [target, setTarget] = useState("");
  const [steps, setSteps] = useState<
    { cells: ArrayCell[]; description: string }[]
  >([]);
  const [stepIndex, setStepIndex] = useState(0);

  const current = steps[stepIndex] ?? {
    cells: arr.map((v) => ({ value: v, state: "normal" as const })),
    description: "Enter a target and press Search.",
  };

  const handleSearch = useCallback(() => {
    const t = parseInt(target);
    if (isNaN(t)) return;
    const s =
      algorithm === "linear"
        ? linearSearchSteps(arr, t)
        : binarySearchSteps(arr, t);
    setSteps(s);
    setStepIndex(0);
  }, [arr, target, algorithm]);

  return (
    <div className="space-y-4">
      {/* Algorithm tabs */}
      <div className="flex gap-2">
        {(["linear", "binary"] as SearchAlg[]).map((a) => (
          <button
            key={a}
            onClick={() => {
              setAlgorithm(a);
              setSteps([]);
              setStepIndex(0);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${algorithm === a ? "bg-[#6c63ff] text-white" : "bg-[#1e2130] text-[#94a3b8] border border-[#2a2d3e] hover:text-white"}`}
          >
            {a === "linear" ? "Linear Search" : "Binary Search"}
          </button>
        ))}
      </div>

      <p className="text-[#94a3b8] text-sm">
        {algorithm === "linear"
          ? "Scans each element one by one. O(n) time. Works on any array."
          : "Halves the search space each step. O(log n) time. Requires sorted array."}
      </p>

      {/* Array */}
      <div className="bg-[#0f1117] rounded-xl border border-[#2a2d3e] p-4">
        <div className="flex flex-wrap gap-1.5 justify-center">
          {current.cells.map((cell, i) => (
            <div
              key={i}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all duration-200 ${cellColor[cell.state]}`}
            >
              {cell.value}
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="px-4 py-2 rounded-lg bg-[#1a1d27] border border-[#2a2d3e] text-sm text-[#f1f5f9] min-h-[36px]">
        {current.description}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#94a3b8]">Target:</span>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="e.g. 42"
            className="w-24 px-3 py-1.5 rounded-lg bg-[#0f1117] border border-[#2a2d3e] text-[#f1f5f9] text-sm outline-none focus:border-[#6c63ff]"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-1.5 rounded-lg bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-sm font-semibold"
          >
            Search
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStepIndex((i) => Math.max(i - 1, 0))}
            disabled={stepIndex === 0}
            className="px-3 py-1.5 rounded-lg bg-[#1e2130] border border-[#2a2d3e] text-[#94a3b8] hover:text-white disabled:opacity-40 text-sm"
          >
            ◀ Back
          </button>
          <button
            onClick={() =>
              setStepIndex((i) => Math.min(i + 1, steps.length - 1))
            }
            disabled={steps.length === 0 || stepIndex >= steps.length - 1}
            className="px-3 py-1.5 rounded-lg bg-[#1e2130] border border-[#2a2d3e] text-[#94a3b8] hover:text-white disabled:opacity-40 text-sm"
          >
            Next ▶
          </button>
        </div>
        <span className="text-xs text-[#64748b]">
          {steps.length > 0 ? `Step ${stepIndex + 1} / ${steps.length}` : ""}
        </span>
      </div>

      <p className="text-xs text-[#64748b]">
        Array is sorted. Values: {arr.join(", ")}
      </p>
    </div>
  );
}

// ── Stack + Queue ──────────────────────────────────────
export function StackQueueVisualizer() {
  const [mode, setMode] = useState<"stack" | "queue">("stack");
  const [items, setItems] = useState<number[]>([]);
  const [input, setInput] = useState("");
  const [lastOp, setLastOp] = useState("");

  const push = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setItems((prev) => (mode === "stack" ? [...prev, val] : [...prev, val]));
    setLastOp(`${mode === "stack" ? "Pushed" : "Enqueued"} ${val}`);
    setInput("");
  };
  const pop = () => {
    if (items.length === 0) return;
    const removed = mode === "stack" ? items[items.length - 1] : items[0];
    setItems((prev) => (mode === "stack" ? prev.slice(0, -1) : prev.slice(1)));
    setLastOp(`${mode === "stack" ? "Popped" : "Dequeued"} ${removed}`);
  };
  const peek = () => {
    if (items.length === 0) return;
    const val = mode === "stack" ? items[items.length - 1] : items[0];
    setLastOp(`${mode === "stack" ? "Top" : "Front"}: ${val}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["stack", "queue"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setItems([]);
              setLastOp("");
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${mode === m ? "bg-[#6c63ff] text-white" : "bg-[#1e2130] text-[#94a3b8] border border-[#2a2d3e] hover:text-white"}`}
          >
            {m === "stack" ? "Stack (LIFO)" : "Queue (FIFO)"}
          </button>
        ))}
      </div>

      <p className="text-[#94a3b8] text-sm">
        {mode === "stack"
          ? "Stack: Last In, First Out. Push adds to top, Pop removes from top."
          : "Queue: First In, First Out. Enqueue adds to back, Dequeue removes from front."}
      </p>

      {/* Visualization */}
      <div className="bg-[#0f1117] rounded-xl border border-[#2a2d3e] p-6 min-h-[160px] flex items-end justify-center">
        {items.length === 0 ? (
          <p className="text-[#64748b] text-sm italic">
            {mode === "stack" ? "Stack is empty" : "Queue is empty"}
          </p>
        ) : mode === "stack" ? (
          <div className="flex flex-col-reverse gap-1 items-center">
            {items.map((val, i) => (
              <div
                key={i}
                className={`w-32 py-2 text-center text-sm font-bold rounded-lg border-2 transition-all ${
                  i === items.length - 1
                    ? "bg-[#6c63ff] border-[#6c63ff] text-white"
                    : "bg-[#1e2130] border-[#2a2d3e] text-[#94a3b8]"
                }`}
              >
                {val}{" "}
                {i === items.length - 1 && (
                  <span className="text-xs font-normal">← top</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-1 items-center flex-wrap justify-center">
            {items.map((val, i) => (
              <div
                key={i}
                className={`w-14 h-14 flex flex-col items-center justify-center text-sm font-bold rounded-lg border-2 transition-all ${
                  i === 0
                    ? "bg-[#6c63ff] border-[#6c63ff] text-white"
                    : "bg-[#1e2130] border-[#2a2d3e] text-[#94a3b8]"
                }`}
              >
                <span>{val}</span>
                {i === 0 && (
                  <span className="text-[9px] font-normal">front</span>
                )}
                {i === items.length - 1 && (
                  <span className="text-[9px] font-normal text-emerald-400">
                    back
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {lastOp && (
        <div className="px-4 py-2 rounded-lg bg-[#1a1d27] border border-[#2a2d3e] text-sm text-[#6c63ff]">
          {lastOp}
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && push()}
          placeholder="Value"
          className="w-24 px-3 py-1.5 rounded-lg bg-[#0f1117] border border-[#2a2d3e] text-[#f1f5f9] text-sm outline-none focus:border-[#6c63ff]"
        />
        <button
          onClick={push}
          className="px-3 py-1.5 rounded-lg bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-sm font-semibold"
        >
          {mode === "stack" ? "Push" : "Enqueue"}
        </button>
        <button
          onClick={pop}
          disabled={items.length === 0}
          className="px-3 py-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-500 text-white text-sm font-semibold disabled:opacity-40"
        >
          {mode === "stack" ? "Pop" : "Dequeue"}
        </button>
        <button
          onClick={peek}
          disabled={items.length === 0}
          className="px-3 py-1.5 rounded-lg bg-[#1e2130] border border-[#2a2d3e] text-[#94a3b8] hover:text-white text-sm disabled:opacity-40"
        >
          Peek
        </button>
      </div>
      <p className="text-xs text-[#64748b]">
        Size: {items.length} |{" "}
        {items.length === 0 ? "Empty" : `Contains: [${items.join(", ")}]`}
      </p>
    </div>
  );
}
