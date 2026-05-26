import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  FileText,
  Zap,
  FolderOpen,
  Flag,
  Users,
  ArrowLeft,
  LogOut,
  ShieldCheck,
  Rocket,
  MessageSquare,
  ClipboardList,
} from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "@/context/AuthContext";

const adminNavItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { to: "/admin/paths", icon: BookOpen, label: "Learning Paths" },
  { to: "/admin/modules", icon: Layers, label: "Modules" },
  { to: "/admin/lessons", icon: FileText, label: "Lessons" },
  { to: "/admin/challenges", icon: Zap, label: "Challenges" },
  { to: "/admin/projects", icon: FolderOpen, label: "Projects" },
  { to: "/admin/reports", icon: Flag, label: "Reports" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/beta", icon: Rocket, label: "Beta" },
  { to: "/admin/feedback", icon: MessageSquare, label: "Feedback" },
  {
    to: "/admin/launch-checklist",
    icon: ClipboardList,
    label: "Launch Checklist",
  },
];

export default function AdminLayout() {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-[#0a0c14] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col bg-[#10121e] border-r border-[#2a2d3e]">
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-5 border-b border-[#2a2d3e]">
          <div className="w-7 h-7 rounded-md bg-[#6c63ff]/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#6c63ff]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#f1f5f9] leading-none">
              Admin Panel
            </p>
            <p className="text-[10px] text-[#64748b] mt-0.5">Unleash Coding</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {adminNavItems.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                  isActive
                    ? "bg-[#6c63ff]/20 text-[#6c63ff] border border-[#6c63ff]/30"
                    : "text-[#94a3b8] hover:bg-[#1e2130] hover:text-[#f1f5f9]",
                )
              }
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-2 pb-3 border-t border-[#2a2d3e] pt-3 space-y-0.5">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#94a3b8] hover:bg-[#1e2130] hover:text-[#f1f5f9] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to App
          </NavLink>
          <div className="px-3 py-2">
            <p className="text-[10px] text-[#64748b] truncate">
              {profile?.username || profile?.fullName || "Admin"}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium text-[#94a3b8] hover:bg-[#1e2130] hover:text-[#ef4444] transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto bg-[#0f1117]">
        <Outlet />
      </main>
    </div>
  );
}
