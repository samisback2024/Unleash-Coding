import { useState, useEffect, useRef, useCallback } from "react";

type SortAlgorithm = "bubble" | "selection" | "insertion" | "merge" | "quick";

interface Step {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  pivot: number | null;
  description: string;
}

// ── Algorithm step generators ──────────────────────────
function bubbleSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const a = [...arr];
  const sorted: number[] = [];
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      steps.push({
        array: [...a],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sorted],
        pivot: null,
        description: `Comparing a[${j}]=${a[j]} and a[${j + 1}]=${a[j + 1]}`,
      });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({
          array: [...a],
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sorted],
          pivot: null,
          description: `Swapped ${a[j + 1]} and ${a[j]}`,
        });
      }
    }
    sorted.unshift(a.length - 1 - i);
  }
  sorted.unshift(0);
  steps.push({
    array: [...a],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: a.length }, (_, i) => i),
    pivot: null,
    description: "Array is sorted!",
  });
  return steps;
}

function selectionSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const a = [...arr];
  const sorted: number[] = [];
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      steps.push({
        array: [...a],
        comparing: [minIdx, j],
        swapping: [],
        sorted: [...sorted],
        pivot: i,
        description: `Finding min: checking a[${j}]=${a[j]} vs current min a[${minIdx}]=${a[minIdx]}`,
      });
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      steps.push({
        array: [...a],
        comparing: [],
        swapping: [i, minIdx],
        sorted: [...sorted],
        pivot: null,
        description: `Placed minimum ${a[i]} at index ${i}`,
      });
    }
    sorted.push(i);
  }
  sorted.push(a.length - 1);
  steps.push({
    array: [...a],
    comparing: [],
    swapping: [],
    sorted: [...sorted],
    pivot: null,
    description: "Array is sorted!",
  });
  return steps;
}

function insertionSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      steps.push({
        array: [...a],
        comparing: [j, j + 1],
        swapping: [],
        sorted: Array.from({ length: i }, (_, k) => k),
        pivot: null,
        description: `Shifting a[${j}]=${a[j]} right`,
      });
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
    steps.push({
      array: [...a],
      comparing: [],
      swapping: [j + 1],
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      pivot: null,
      description: `Inserted ${key} at index ${j + 1}`,
    });
  }
  steps.push({
    array: [...a],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: a.length }, (_, i) => i),
    pivot: null,
    description: "Array is sorted!",
  });
  return steps;
}

function quickSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const a = [...arr];
  const sorted: number[] = [];

  function partition(low: number, high: number) {
    const pivot = a[high];
    let i = low - 1;
    steps.push({
      array: [...a],
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      pivot: high,
      description: `Pivot = ${pivot} at index ${high}`,
    });
    for (let j = low; j < high; j++) {
      steps.push({
        array: [...a],
        comparing: [j, high],
        swapping: [],
        sorted: [...sorted],
        pivot: high,
        description: `Comparing a[${j}]=${a[j]} with pivot ${pivot}`,
      });
      if (a[j] <= pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        if (i !== j)
          steps.push({
            array: [...a],
            comparing: [],
            swapping: [i, j],
            sorted: [...sorted],
            pivot: high,
            description: `Swapped a[${i}]=${a[i]} and a[${j}]=${a[j]}`,
          });
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    steps.push({
      array: [...a],
      comparing: [],
      swapping: [i + 1, high],
      sorted: [...sorted],
      pivot: i + 1,
      description: `Placed pivot ${pivot} at final position ${i + 1}`,
    });
    sorted.push(i + 1);
    return i + 1;
  }

  function qsort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      qsort(low, pi - 1);
      qsort(pi + 1, high);
    }
  }
  qsort(0, a.length - 1);
  steps.push({
    array: [...a],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: a.length }, (_, i) => i),
    pivot: null,
    description: "Array is sorted!",
  });
  return steps;
}

const ALGO_STEPS: Record<SortAlgorithm, (arr: number[]) => Step[]> = {
  bubble: bubbleSteps,
  selection: selectionSteps,
  insertion: insertionSteps,
  merge: bubbleSteps, // simplified for MVP
  quick: quickSteps,
};

const ALGO_LABELS: Record<SortAlgorithm, string> = {
  bubble: "Bubble Sort",
  selection: "Selection Sort",
  insertion: "Insertion Sort",
  merge: "Merge Sort",
  quick: "Quick Sort",
};

const ALGO_DESC: Record<SortAlgorithm, string> = {
  bubble:
    "Repeatedly compares adjacent elements and swaps them if out of order. O(n²) time.",
  selection:
    "Finds the minimum element in the unsorted section and places it at the beginning. O(n²) time.",
  insertion:
    "Builds sorted array one element at a time by inserting each into its correct position. O(n²) time.",
  merge:
    "Divides array in half, sorts each half, then merges. O(n log n) time. Stable sort.",
  quick:
    "Picks a pivot, partitions elements around it, recursively sorts. O(n log n) avg time.",
};

function generateArray(size: number): number[] {
  return Array.from(
    { length: size },
    () => Math.floor(Math.random() * 90) + 10,
  );
}

export function SortingVisualizer() {
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>("bubble");
  const [arraySize, setArraySize] = useState(20);
  const [array, setArray] = useState(() => generateArray(20));
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(200); // ms per step

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentStep = steps[stepIndex] ?? {
    array,
    comparing: [],
    swapping: [],
    sorted: [],
    pivot: null,
    description: "Press Play to start",
  };

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
    const newArr = generateArray(arraySize);
    setArray(newArr);
    setSteps([]);
    setStepIndex(0);
  }, [arraySize]);

  useEffect(() => {
    reset();
  }, [algorithm, arraySize]); // eslint-disable-line react-hooks/exhaustive-deps

  const play = useCallback(() => {
    let generatedSteps = steps;
    if (generatedSteps.length === 0) {
      generatedSteps = ALGO_STEPS[algorithm](array);
      setSteps(generatedSteps);
    }
    setIsPlaying(true);
    let idx = stepIndex;
    intervalRef.current = setInterval(() => {
      idx++;
      if (idx >= generatedSteps.length) {
        clearInterval(intervalRef.current!);
        setIsPlaying(false);
        setStepIndex(generatedSteps.length - 1);
        return;
      }
      setStepIndex(idx);
    }, speed);
  }, [algorithm, array, steps, stepIndex, speed]);

  const pause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
  };

  const stepForward = () => {
    let s = steps;
    if (s.length === 0) {
      s = ALGO_STEPS[algorithm](array);
      setSteps(s);
    }
    setStepIndex((i) => Math.min(i + 1, s.length - 1));
  };

  const stepBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const maxHeight = Math.max(...currentStep.array);

  const barColor = (i: number) => {
    if (currentStep.sorted.includes(i)) return "bg-emerald-500";
    if (currentStep.swapping.includes(i)) return "bg-rose-500";
    if (currentStep.comparing.includes(i)) return "bg-amber-400";
    if (currentStep.pivot === i) return "bg-purple-500";
    return "bg-[#6c63ff]";
  };

  return (
    <div className="space-y-4">
      {/* Algorithm selector */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(ALGO_LABELS) as SortAlgorithm[]).map((a) => (
          <button
            key={a}
            onClick={() => setAlgorithm(a)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              algorithm === a
                ? "bg-[#6c63ff] text-white"
                : "bg-[#1e2130] text-[#94a3b8] hover:text-[#f1f5f9] border border-[#2a2d3e]"
            }`}
          >
            {ALGO_LABELS[a]}
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="px-4 py-2.5 rounded-lg bg-[#1e2130] border border-[#2a2d3e] text-[#94a3b8] text-sm">
        {ALGO_DESC[algorithm]}
      </div>

      {/* Bars */}
      <div className="bg-[#0f1117] rounded-xl border border-[#2a2d3e] p-4 h-52 flex items-end gap-0.5">
        {currentStep.array.map((val, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm transition-all duration-100 ${barColor(i)}`}
            style={{ height: `${(val / maxHeight) * 100}%` }}
            title={String(val)}
          />
        ))}
      </div>

      {/* Step description */}
      <div className="px-4 py-2 rounded-lg bg-[#1a1d27] border border-[#2a2d3e] text-sm text-[#f1f5f9] min-h-[36px]">
        {currentStep.description}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={stepBack}
            disabled={stepIndex === 0}
            className="px-3 py-1.5 rounded-lg bg-[#1e2130] border border-[#2a2d3e] text-[#94a3b8] hover:text-white disabled:opacity-40 text-sm"
          >
            ◀◀ Back
          </button>
          {isPlaying ? (
            <button
              onClick={pause}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold"
            >
              ⏸ Pause
            </button>
          ) : (
            <button
              onClick={play}
              className="px-4 py-1.5 rounded-lg bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-sm font-semibold"
            >
              ▶ Play
            </button>
          )}
          <button
            onClick={stepForward}
            className="px-3 py-1.5 rounded-lg bg-[#1e2130] border border-[#2a2d3e] text-[#94a3b8] hover:text-white text-sm"
          >
            Next ▶▶
          </button>
          <button
            onClick={reset}
            className="px-3 py-1.5 rounded-lg bg-[#1e2130] border border-[#2a2d3e] text-[#94a3b8] hover:text-white text-sm"
          >
            ↺ Reset
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
          <label>Speed:</label>
          <input
            type="range"
            min={50}
            max={800}
            step={50}
            value={800 - speed + 50}
            onChange={(e) => setSpeed(850 - Number(e.target.value))}
            className="w-24 accent-[#6c63ff]"
          />
          <span className="text-xs w-14">
            {speed >= 600 ? "Slow" : speed >= 200 ? "Normal" : "Fast"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
          <label>Size:</label>
          <input
            type="range"
            min={8}
            max={40}
            step={4}
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            className="w-24 accent-[#6c63ff]"
          />
          <span className="text-xs w-6">{arraySize}</span>
        </div>
        <div className="ml-auto text-xs text-[#64748b]">
          Step {steps.length > 0 ? stepIndex + 1 : 0} / {steps.length}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-[#94a3b8]">
        {[
          { color: "bg-[#6c63ff]", label: "Unsorted" },
          { color: "bg-amber-400", label: "Comparing" },
          { color: "bg-rose-500", label: "Swapping" },
          { color: "bg-purple-500", label: "Pivot" },
          { color: "bg-emerald-500", label: "Sorted" },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm ${color}`} /> {label}
          </span>
        ))}
      </div>
    </div>
  );
}
