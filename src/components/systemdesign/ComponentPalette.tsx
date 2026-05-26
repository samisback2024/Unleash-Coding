interface ComponentDef {
  label: string;
  icon: string;
  color: string;
  description: string;
}

const COMPONENTS: ComponentDef[] = [
  {
    label: "Client",
    icon: "💻",
    color: "gray",
    description: "Browser / Mobile app",
  },
  {
    label: "Frontend",
    icon: "🖼️",
    color: "blue",
    description: "UI layer (React, Vue…)",
  },
  {
    label: "Load Balancer",
    icon: "⚖️",
    color: "teal",
    description: "Distributes traffic",
  },
  {
    label: "API Server",
    icon: "⚙️",
    color: "green",
    description: "REST / GraphQL / gRPC",
  },
  {
    label: "Database",
    icon: "🗄️",
    color: "orange",
    description: "Primary data store",
  },
  {
    label: "Cache",
    icon: "⚡",
    color: "purple",
    description: "Redis / Memcached",
  },
  {
    label: "Message Queue",
    icon: "📬",
    color: "pink",
    description: "Kafka / RabbitMQ",
  },
  {
    label: "CDN",
    icon: "🌐",
    color: "indigo",
    description: "Static asset delivery",
  },
  {
    label: "Storage",
    icon: "📦",
    color: "orange",
    description: "S3 / Blob storage",
  },
  {
    label: "Auth Service",
    icon: "🔐",
    color: "purple",
    description: "OAuth / JWT issuer",
  },
];

export function ComponentPalette() {
  const handleDragStart = (e: React.DragEvent, comp: ComponentDef) => {
    e.dataTransfer.setData("application/nodedata", JSON.stringify(comp));
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-48 shrink-0 flex flex-col bg-[#1a1d27] border-r border-[#2a2d3e] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#2a2d3e]">
        <p className="text-xs font-semibold text-[#f1f5f9]">Components</p>
        <p className="text-[10px] text-[#64748b] mt-0.5">Drag onto canvas</p>
      </div>
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {COMPONENTS.map((comp) => (
          <div
            key={comp.label}
            draggable
            onDragStart={(e) => handleDragStart(e, comp)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#1e2130] border border-[#2a2d3e] cursor-grab active:cursor-grabbing hover:border-[#6c63ff]/50 hover:bg-[#252840] transition-all select-none"
          >
            <span className="text-lg">{comp.icon}</span>
            <div>
              <p className="text-xs font-medium text-[#f1f5f9] leading-tight">
                {comp.label}
              </p>
              <p className="text-[9px] text-[#64748b] leading-tight">
                {comp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="px-3 py-2 border-t border-[#2a2d3e] text-[10px] text-[#64748b] space-y-0.5">
        <p>• Drag to add nodes</p>
        <p>• Connect by dragging handles</p>
        <p>• Delete: select + Del key</p>
      </div>
    </aside>
  );
}
