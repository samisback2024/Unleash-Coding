import { useState } from "react";

interface BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

function insert(node: BSTNode | null, value: number): BSTNode {
  if (!node) return { value, left: null, right: null };
  if (value < node.value) return { ...node, left: insert(node.left, value) };
  if (value > node.value) return { ...node, right: insert(node.right, value) };
  return node;
}

function buildTree(values: number[]): BSTNode | null {
  let root: BSTNode | null = null;
  for (const v of values) root = insert(root, v);
  return root;
}

// ── SVG layout ─────────────────────────────────────────
interface Positioned {
  value: number;
  x: number;
  y: number;
  highlight: boolean;
  edges: { x1: number; y1: number; x2: number; y2: number }[];
}

function layoutTree(
  node: BSTNode | null,
  x: number,
  y: number,
  dx: number,
  depth: number,
  highlighted: number | null,
  result: Positioned[],
  parentX?: number,
  parentY?: number,
) {
  if (!node) return;
  const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];
  if (parentX !== undefined && parentY !== undefined) {
    edges.push({ x1: parentX, y1: parentY, x2: x, y2: y });
  }
  result.push({
    value: node.value,
    x,
    y,
    highlight: node.value === highlighted,
    edges,
  });
  layoutTree(
    node.left,
    x - dx,
    y + 70,
    dx / 1.8,
    depth + 1,
    highlighted,
    result,
    x,
    y,
  );
  layoutTree(
    node.right,
    x + dx,
    y + 70,
    dx / 1.8,
    depth + 1,
    highlighted,
    result,
    x,
    y,
  );
}

export function TreeVisualizer() {
  const [root, setRoot] = useState<BSTNode | null>(() =>
    buildTree([50, 30, 70, 20, 40, 60, 80]),
  );
  const [input, setInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [message, setMessage] = useState("Insert values or search the BST.");

  const handleInsert = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setRoot((r) => insert(r, val));
    setMessage(`Inserted ${val} into the BST.`);
    setInput("");
    setHighlighted(val);
  };

  const handleSearch = () => {
    const val = parseInt(searchInput);
    if (isNaN(val) || !root) return;
    let cur: BSTNode | null = root;
    const path: number[] = [];
    while (cur) {
      path.push(cur.value);
      if (val === cur.value) {
        setHighlighted(val);
        setMessage(`Found ${val}! Path: ${path.join(" → ")}`);
        return;
      }
      cur = val < cur.value ? cur.left : cur.right;
    }
    setHighlighted(null);
    setMessage(`${val} not found in the tree.`);
  };

  const handleReset = () => {
    setRoot(buildTree([50, 30, 70, 20, 40, 60, 80]));
    setHighlighted(null);
    setMessage("Tree reset to default values.");
  };

  const nodes: Positioned[] = [];
  if (root) layoutTree(root, 280, 40, 120, 0, highlighted, nodes);

  return (
    <div className="space-y-4">
      <p className="text-[#94a3b8] text-sm">
        Binary Search Tree: left child &lt; parent &lt; right child. O(log n)
        search, insert, delete on average.
      </p>

      {/* SVG canvas */}
      <div className="bg-[#0f1117] rounded-xl border border-[#2a2d3e] overflow-auto">
        <svg width="560" height="300" className="w-full min-w-[480px]">
          {/* Edges */}
          {nodes.flatMap((n) =>
            n.edges.map((e, i) => (
              <line
                key={`${n.value}-e${i}`}
                x1={e.x1}
                y1={e.y1}
                x2={e.x2}
                y2={e.y2}
                stroke="#2a2d3e"
                strokeWidth="2"
              />
            )),
          )}
          {/* Nodes */}
          {nodes.map((n) => (
            <g key={n.value}>
              <circle
                cx={n.x}
                cy={n.y}
                r={22}
                fill={n.highlight ? "#6c63ff" : "#1e2130"}
                stroke={n.highlight ? "#6c63ff" : "#2a2d3e"}
                strokeWidth={n.highlight ? 3 : 1.5}
              />
              <text
                x={n.x}
                y={n.y}
                dominantBaseline="middle"
                textAnchor="middle"
                fill={n.highlight ? "white" : "#94a3b8"}
                fontSize={13}
                fontWeight="bold"
              >
                {n.value}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Message */}
      <div className="px-4 py-2 rounded-lg bg-[#1a1d27] border border-[#2a2d3e] text-sm text-[#f1f5f9]">
        {message}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInsert()}
            placeholder="Insert value"
            className="w-28 px-3 py-1.5 rounded-lg bg-[#0f1117] border border-[#2a2d3e] text-[#f1f5f9] text-sm outline-none focus:border-[#6c63ff]"
          />
          <button
            onClick={handleInsert}
            className="px-3 py-1.5 rounded-lg bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-sm font-semibold"
          >
            Insert
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search value"
            className="w-28 px-3 py-1.5 rounded-lg bg-[#0f1117] border border-[#2a2d3e] text-[#f1f5f9] text-sm outline-none focus:border-[#6c63ff]"
          />
          <button
            onClick={handleSearch}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold"
          >
            Search
          </button>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-lg bg-[#1e2130] border border-[#2a2d3e] text-[#94a3b8] hover:text-white text-sm"
        >
          ↺ Reset
        </button>
      </div>
    </div>
  );
}
