import {
  ArchitectureCanvas,
  ComponentPalette,
} from "@/components/systemdesign";
import { useToast } from "@/context/ToastContext";
import type { Node, Edge } from "@xyflow/react";

export default function SystemDesignPage() {
  const { success } = useToast();

  const handleSave = (nodes: Node[], edges: Edge[]) => {
    localStorage.setItem(
      "system-design-draft",
      JSON.stringify({ nodes, edges, savedAt: new Date().toISOString() }),
    );
    success(
      `Design saved (${nodes.length} components, ${edges.length} connections)`,
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#0f1117]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#2a2d3e] shrink-0">
        <div>
          <h1 className="text-lg font-bold text-[#f1f5f9]">
            System Design Visualizer
          </h1>
          <p className="text-xs text-[#64748b]">
            Drag components onto the canvas · Connect nodes by dragging between
            handles · Delete key removes selected
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <ComponentPalette />
        <div className="flex-1">
          <ArchitectureCanvas onSave={handleSave} />
        </div>
      </div>
    </div>
  );
}
