import { Bell, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  const { user } = useAuth();
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-[#2a2d3e] bg-[#1a1d27] sticky top-0 z-30">
      {/* Title (visible on mobile after sidebar icon) */}
      <div className="lg:block hidden">
        {title && (
          <h1 className="text-lg font-semibold text-[#f1f5f9]">{title}</h1>
        )}
      </div>
      <div className="lg:hidden w-6" /> {/* spacer for mobile hamburger */}
      {/* Search bar */}
      <div className="relative max-w-xs w-full hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
        <input
          type="search"
          placeholder="Search paths, lessons…"
          className="w-full bg-[#0f1117] border border-[#2a2d3e] rounded-lg pl-9 pr-4 py-2 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#6c63ff]"
        />
      </div>
      {/* Right actions */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg text-[#64748b] hover:bg-[#252840] hover:text-[#f1f5f9] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#6c63ff] rounded-full" />
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6c63ff] to-[#a855f7] flex items-center justify-center text-xs font-bold text-white">
          {initials}
        </div>
      </div>
    </header>
  );
}
