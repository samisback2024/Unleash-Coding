import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  FolderOpen,
  User,
  LogOut,
  Trophy,
  Briefcase,
  Menu,
  X,
} from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/paths", icon: BookOpen, label: "Learning Paths" },
  { to: "/challenges", icon: Code2, label: "Challenges" },
  { to: "/projects", icon: FolderOpen, label: "Projects" },
  { to: "/portfolio", icon: Briefcase, label: "Portfolio" },
  { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { to: "/profile", icon: User, label: "Profile" },
];

export function Sidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[#2a2d3e]">
        <img
          src="/favicon.svg"
          alt="Unleash Coding"
          className="w-8 h-8 shrink-0"
        />
        <span className="text-lg font-bold text-[#f1f5f9] tracking-tight">
          Unleash Coding
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-[#6c63ff]/20 text-[#6c63ff] border border-[#6c63ff]/30"
                  : "text-[#94a3b8] hover:bg-[#252840] hover:text-[#f1f5f9]",
              )
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-4 border-t border-[#2a2d3e] pt-3">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[#94a3b8] hover:bg-[#252840] hover:text-[#ef4444] transition-all duration-150"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 h-screen sticky top-0 bg-[#1a1d27] border-r border-[#2a2d3e] overflow-hidden">
        <NavContent />
      </aside>

      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#1e2130] border border-[#2a2d3e] text-[#94a3b8]"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 flex flex-col bg-[#1a1d27] border-r border-[#2a2d3e] z-50">
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}
