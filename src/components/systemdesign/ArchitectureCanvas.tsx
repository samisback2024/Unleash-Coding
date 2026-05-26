import { useCallback, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  Panel,
  Handle,
  Position,
  type Node,
  type Edge,
  type OnConnect,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// ── Node type definitions ──────────────────────────────
export interface ComponentNodeData {
  label: string;
  icon: string;
  color: string;
  description?: string;
  [key: string]: unknown;
}

const NODE_STYLE_MAP: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  client: { bg: "#1e2130", border: "#4b5563", text: "#9ca3af" },
  frontend: { bg: "#1e3a5f", border: "#3b82f6", text: "#93c5fd" },
  backend: { bg: "#1a3a2a", border: "#22c55e", text: "#86efac" },
  database: { bg: "#3a2a00", border: "#f59e0b", text: "#fcd34d" },
  cache: { bg: "#2d1a3a", border: "#a855f7", text: "#d8b4fe" },
  queue: { bg: "#3a1a2a", border: "#ec4899", text: "#f9a8d4" },
  cdn: { bg: "#1a2a3a", border: "#06b6d4", text: "#67e8f9" },
  loadbalancer: { bg: "#1a3a3a", border: "#14b8a6", text: "#5eead4" },
  storage: { bg: "#3a2a1a", border: "#f97316", text: "#fdba74" },
  api: { bg: "#1a1a3a", border: "#6366f1", text: "#a5b4fc" },
};

function ComponentNode({ data }: NodeProps) {
  const nd = data as ComponentNodeData;
  const style =
    NODE_STYLE_MAP[nd.label?.toLowerCase().replace(/\s+/g, "")] ??
    NODE_STYLE_MAP.backend;
  return (
    <div
      style={{ background: style.bg, borderColor: style.border }}
      className="px-4 py-3 rounded-xl border-2 shadow-lg min-w-[110px] text-center cursor-grab active:cursor-grabbing"
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-[#6c63ff] !w-2.5 !h-2.5"
      />
      <div className="text-2xl mb-1 select-none">{nd.icon}</div>
      <div
        style={{ color: style.text }}
        className="text-xs font-semibold select-none"
      >
        {nd.label}
      </div>
      {nd.description && (
        <div className="text-[10px] text-[#64748b] mt-0.5 select-none">
          {nd.description}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-[#6c63ff] !w-2.5 !h-2.5"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!bg-[#6c63ff] !w-2.5 !h-2.5"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!bg-[#6c63ff] !w-2.5 !h-2.5"
      />
    </div>
  );
}

const nodeTypes = { component: ComponentNode };

// ── Templates ──────────────────────────────────────────
export interface DesignTemplate {
  name: string;
  nodes: Node[];
  edges: Edge[];
}

export const DESIGN_TEMPLATES: DesignTemplate[] = [
  {
    name: "Social Media App",
    nodes: [
      {
        id: "1",
        type: "component",
        position: { x: 300, y: 20 },
        data: { label: "Client", icon: "💻", color: "gray" },
      },
      {
        id: "2",
        type: "component",
        position: { x: 300, y: 120 },
        data: { label: "Load Balancer", icon: "⚖️", color: "teal" },
      },
      {
        id: "3",
        type: "component",
        position: { x: 100, y: 230 },
        data: { label: "API Server", icon: "⚙️", color: "green" },
      },
      {
        id: "4",
        type: "component",
        position: { x: 500, y: 230 },
        data: { label: "Media Server", icon: "🖥️", color: "blue" },
      },
      {
        id: "5",
        type: "component",
        position: { x: 100, y: 350 },
        data: { label: "Database", icon: "🗄️", color: "orange" },
      },
      {
        id: "6",
        type: "component",
        position: { x: 300, y: 350 },
        data: { label: "Cache", icon: "⚡", color: "purple" },
      },
      {
        id: "7",
        type: "component",
        position: { x: 500, y: 350 },
        data: { label: "CDN", icon: "🌐", color: "indigo" },
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e2-4", source: "2", target: "4" },
      { id: "e3-5", source: "3", target: "5" },
      { id: "e3-6", source: "3", target: "6" },
      { id: "e4-7", source: "4", target: "7" },
    ],
  },
  {
    name: "Chat App",
    nodes: [
      {
        id: "1",
        type: "component",
        position: { x: 100, y: 30 },
        data: { label: "Client A", icon: "👤", color: "gray" },
      },
      {
        id: "2",
        type: "component",
        position: { x: 500, y: 30 },
        data: { label: "Client B", icon: "👤", color: "gray" },
      },
      {
        id: "3",
        type: "component",
        position: { x: 300, y: 30 },
        data: { label: "Load Balancer", icon: "⚖️", color: "teal" },
      },
      {
        id: "4",
        type: "component",
        position: { x: 100, y: 170 },
        data: { label: "Chat Server", icon: "⚙️", color: "green" },
      },
      {
        id: "5",
        type: "component",
        position: { x: 500, y: 170 },
        data: { label: "Presence Service", icon: "🟢", color: "green" },
      },
      {
        id: "6",
        type: "component",
        position: { x: 100, y: 300 },
        data: { label: "Message DB", icon: "🗄️", color: "orange" },
      },
      {
        id: "7",
        type: "component",
        position: { x: 300, y: 300 },
        data: { label: "Message Queue", icon: "📬", color: "pink" },
      },
      {
        id: "8",
        type: "component",
        position: { x: 500, y: 300 },
        data: { label: "Push Service", icon: "🔔", color: "blue" },
      },
    ],
    edges: [
      { id: "e1-3", source: "1", target: "3" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e3-5", source: "3", target: "5" },
      { id: "e4-6", source: "4", target: "6" },
      { id: "e4-7", source: "4", target: "7" },
      { id: "e7-8", source: "7", target: "8" },
    ],
  },
  {
    name: "URL Shortener",
    nodes: [
      {
        id: "1",
        type: "component",
        position: { x: 300, y: 30 },
        data: { label: "Client", icon: "💻", color: "gray" },
      },
      {
        id: "2",
        type: "component",
        position: { x: 300, y: 150 },
        data: { label: "API Server", icon: "⚙️", color: "green" },
      },
      {
        id: "3",
        type: "component",
        position: { x: 100, y: 270 },
        data: { label: "Database", icon: "🗄️", color: "orange" },
      },
      {
        id: "4",
        type: "component",
        position: { x: 300, y: 270 },
        data: { label: "Cache", icon: "⚡", color: "purple" },
      },
      {
        id: "5",
        type: "component",
        position: { x: 500, y: 270 },
        data: { label: "Analytics", icon: "📊", color: "blue" },
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e2-4", source: "2", target: "4" },
      { id: "e2-5", source: "2", target: "5" },
    ],
  },
];

// ── Main Canvas (inner, requires ReactFlowProvider context) ──
let nodeIdCounter = 100;

function CanvasInner({
  onLoad,
}: {
  onLoad: (nodes: Node[], edges: Edge[]) => void;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    DESIGN_TEMPLATES[0].nodes,
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    DESIGN_TEMPLATES[0].edges,
  );
  const { screenToFlowPosition } = useReactFlow();
  const containerRef = useRef<HTMLDivElement>(null);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const raw = e.dataTransfer.getData("application/nodedata");
      if (!raw) return;
      const nodeData = JSON.parse(raw) as ComponentNodeData;
      const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      nodeIdCounter++;
      setNodes((nds) => [
        ...nds,
        {
          id: `n${nodeIdCounter}`,
          type: "component",
          position: pos,
          data: nodeData,
        },
      ]);
    },
    [screenToFlowPosition, setNodes],
  );

  const loadTemplate = (t: DesignTemplate) => {
    setNodes(t.nodes);
    setEdges(t.edges);
  };

  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
  };

  // expose to parent via callback
  const handleSave = () => onLoad(nodes, edges);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode="Delete"
        className="bg-[#0f1117]"
      >
        <Background color="#2a2d3e" gap={20} />
        <Controls className="[&>button]:bg-[#1e2130] [&>button]:border-[#2a2d3e] [&>button]:text-[#94a3b8]" />
        <MiniMap
          nodeColor={() => "#6c63ff"}
          maskColor="#0f1117cc"
          className="!bg-[#1e2130] !border-[#2a2d3e]"
        />
        <Panel position="top-left" className="flex gap-2">
          {DESIGN_TEMPLATES.map((t) => (
            <button
              key={t.name}
              onClick={() => loadTemplate(t)}
              className="px-3 py-1.5 rounded-lg bg-[#1e2130]/90 backdrop-blur border border-[#2a2d3e] text-[#94a3b8] hover:text-white hover:border-[#6c63ff] text-xs font-medium transition-all"
            >
              {t.name}
            </button>
          ))}
          <button
            onClick={clearCanvas}
            className="px-3 py-1.5 rounded-lg bg-[#1e2130]/90 backdrop-blur border border-[#2a2d3e] text-rose-400 hover:text-rose-300 text-xs font-medium transition-all"
          >
            Clear
          </button>
        </Panel>
        <Panel position="bottom-right">
          <button
            onClick={handleSave}
            className="px-3 py-1.5 rounded-lg bg-[#6c63ff] text-white text-xs font-medium shadow-lg"
          >
            💾 Save Design
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export function ArchitectureCanvas({
  onSave,
}: {
  onSave?: (nodes: Node[], edges: Edge[]) => void;
}) {
  return (
    <ReactFlowProvider>
      <CanvasInner onLoad={onSave ?? (() => {})} />
    </ReactFlowProvider>
  );
}
