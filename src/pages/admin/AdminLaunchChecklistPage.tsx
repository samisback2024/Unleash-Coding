import { useState } from "react";
import { CheckCircle, Circle, ChevronDown, ChevronUp } from "lucide-react";

interface CheckItem {
  id: string;
  label: string;
  description?: string;
  priority: "critical" | "high" | "medium";
}

interface CheckGroup {
  title: string;
  items: CheckItem[];
}

const CHECKLIST: CheckGroup[] = [
  {
    title: "Authentication & Security",
    items: [
      {
        id: "auth-signup",
        label: "Signup flow works end-to-end",
        description: "New user can sign up, profile is auto-created",
        priority: "critical",
      },
      {
        id: "auth-login",
        label: "Login / Logout work correctly",
        priority: "critical",
      },
      {
        id: "auth-protected",
        label: "Protected routes redirect unauthenticated users",
        priority: "critical",
      },
      {
        id: "auth-admin",
        label: "Non-admin users cannot access admin routes",
        priority: "critical",
      },
      {
        id: "auth-rls",
        label: "Supabase RLS policies reviewed and tested",
        priority: "critical",
      },
      {
        id: "auth-keys",
        label: "No secret keys exposed in client bundle",
        description: "Only anon key (safe), no service_role key",
        priority: "critical",
      },
    ],
  },
  {
    title: "Learning Experience",
    items: [
      {
        id: "learn-paths",
        label: "Learning paths load and display correctly",
        priority: "critical",
      },
      {
        id: "learn-enroll",
        label: "User can enroll in a path",
        priority: "critical",
      },
      {
        id: "learn-lesson",
        label: "Lessons open, render content, and mark complete",
        priority: "critical",
      },
      {
        id: "learn-xp",
        label: "XP updates after lesson / challenge completion",
        priority: "critical",
      },
      {
        id: "learn-progress",
        label: "Progress bar updates correctly",
        priority: "high",
      },
      {
        id: "learn-quiz",
        label: "In-lesson quizzes work correctly",
        priority: "high",
      },
    ],
  },
  {
    title: "Challenges & Projects",
    items: [
      {
        id: "challenge-open",
        label: "Challenges load and display correctly",
        priority: "critical",
      },
      {
        id: "challenge-submit",
        label: "Wrong / correct answer flows work",
        priority: "critical",
      },
      {
        id: "challenge-xp-once",
        label: "XP awarded only once per challenge",
        priority: "critical",
      },
      {
        id: "project-submit",
        label: "Project submission (GitHub URL) works",
        priority: "critical",
      },
      {
        id: "project-portfolio",
        label: "Submitted projects appear in portfolio",
        priority: "high",
      },
      {
        id: "project-xp-once",
        label: "XP awarded only once per project",
        priority: "critical",
      },
    ],
  },
  {
    title: "Gamification",
    items: [
      {
        id: "gamif-level",
        label: "Level updates correctly based on XP",
        priority: "high",
      },
      {
        id: "gamif-badge",
        label: "Badge unlocks only once",
        priority: "high",
      },
      {
        id: "gamif-streak",
        label: "Daily streak tracking works",
        priority: "medium",
      },
      {
        id: "gamif-leaderboard",
        label: "Leaderboard loads and sorts correctly",
        priority: "high",
      },
    ],
  },
  {
    title: "Community",
    items: [
      {
        id: "comm-profile",
        label: "Public profile page loads correctly",
        priority: "high",
      },
      {
        id: "comm-showcase",
        label: "Project showcase loads correctly",
        priority: "high",
      },
      {
        id: "comm-like",
        label: "Like / unlike projects work",
        priority: "medium",
      },
      {
        id: "comm-comment",
        label: "Comments work on project showcase",
        priority: "medium",
      },
      {
        id: "comm-report",
        label: "Report button works",
        priority: "medium",
      },
    ],
  },
  {
    title: "Beta System",
    items: [
      {
        id: "beta-waitlist",
        label: "Waitlist form works (no auth required)",
        priority: "critical",
      },
      {
        id: "beta-invite",
        label: "Invite code validation works",
        priority: "critical",
      },
      {
        id: "beta-onboarding",
        label: "Onboarding flow works for new users",
        priority: "high",
      },
      {
        id: "beta-banner",
        label: "Beta banner visible and dismissable",
        priority: "medium",
      },
      {
        id: "beta-feedback",
        label: "Feedback button submits correctly",
        priority: "high",
      },
    ],
  },
  {
    title: "Admin Panel",
    items: [
      {
        id: "admin-stats",
        label: "Admin dashboard stats load",
        priority: "high",
      },
      {
        id: "admin-crud",
        label: "Admin can create / edit / delete content",
        priority: "high",
      },
      {
        id: "admin-reports",
        label: "Admin can review and resolve reports",
        priority: "high",
      },
      {
        id: "admin-users",
        label: "Admin can manage users",
        priority: "high",
      },
      {
        id: "admin-beta",
        label: "Admin beta dashboard loads correctly",
        priority: "high",
      },
      {
        id: "admin-feedback",
        label: "Admin feedback dashboard loads and filters",
        priority: "high",
      },
    ],
  },
  {
    title: "UI / Quality",
    items: [
      {
        id: "ui-mobile",
        label: "Mobile layout works on all main pages",
        priority: "high",
      },
      {
        id: "ui-dark",
        label: "Dark theme consistent across all pages",
        priority: "medium",
      },
      {
        id: "ui-404",
        label: "404 page shows for unknown routes",
        priority: "medium",
      },
      {
        id: "ui-403",
        label: "Unauthorized page shows for blocked access",
        priority: "medium",
      },
      {
        id: "ui-errors",
        label: "Error boundary catches crashes",
        priority: "high",
      },
      {
        id: "ui-empty",
        label: "Empty states display when data is missing",
        priority: "medium",
      },
      {
        id: "ui-toasts",
        label: "Toast notifications appear on key actions",
        priority: "medium",
      },
      {
        id: "ui-build",
        label: "npm run build passes with 0 TypeScript errors",
        priority: "critical",
      },
      {
        id: "ui-console",
        label: "No critical console errors in production build",
        priority: "high",
      },
    ],
  },
  {
    title: "Deployment",
    items: [
      {
        id: "deploy-env",
        label: "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY set in Vercel",
        priority: "critical",
      },
      {
        id: "deploy-vercel",
        label: "Vercel deployment succeeds",
        priority: "critical",
      },
      {
        id: "deploy-domain",
        label: "Custom domain configured (if applicable)",
        priority: "medium",
      },
      {
        id: "deploy-migrations",
        label: "All Supabase migrations applied to production",
        priority: "critical",
      },
    ],
  },
];

const PRIORITY_COLORS = {
  critical: "text-[#ef4444]",
  high: "text-[#f59e0b]",
  medium: "text-[#64748b]",
};

const PRIORITY_LABELS = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
};

export default function AdminLaunchChecklistPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem("launch-checklist") ?? "{}");
    } catch {
      return {};
    }
  });
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem("launch-checklist", JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  function toggleGroup(title: string) {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  const totalItems = CHECKLIST.reduce((s, g) => s + g.items.length, 0);
  const doneItems = CHECKLIST.reduce(
    (s, g) => s + g.items.filter((i) => checked[i.id]).length,
    0,
  );
  const pct = Math.round((doneItems / totalItems) * 100);

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#f1f5f9]">Launch Checklist</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Track readiness before inviting real beta users
        </p>
      </div>

      {/* Progress */}
      <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-[#f1f5f9]">
            Overall Progress
          </p>
          <p className="text-sm font-bold text-[#6c63ff]">
            {doneItems} / {totalItems} ({pct}%)
          </p>
        </div>
        <div className="w-full h-2 rounded-full bg-[#0f1117] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#6c63ff] to-[#a855f7] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        {pct === 100 && (
          <p className="text-xs text-[#22c55e] mt-2 font-semibold">
            ✓ All items checked — ready to launch!
          </p>
        )}
      </div>

      {/* Groups */}
      <div className="space-y-4">
        {CHECKLIST.map((group) => {
          const groupDone = group.items.filter((i) => checked[i.id]).length;
          const isCollapsed = collapsed[group.title];

          return (
            <div
              key={group.title}
              className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl overflow-hidden"
            >
              {/* Group header */}
              <button
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#252840]/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-semibold text-[#f1f5f9]">
                    {group.title}
                  </h2>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                      groupDone === group.items.length
                        ? "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20"
                        : "bg-[#2a2d3e] text-[#64748b] border-[#2a2d3e]"
                    }`}
                  >
                    {groupDone}/{group.items.length}
                  </span>
                </div>
                {isCollapsed ? (
                  <ChevronDown className="w-4 h-4 text-[#64748b]" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-[#64748b]" />
                )}
              </button>

              {!isCollapsed && (
                <div className="px-5 pb-4 space-y-1 border-t border-[#2a2d3e]">
                  {group.items.map((item) => {
                    const done = !!checked[item.id];
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggle(item.id)}
                        className="w-full flex items-start gap-3 py-2.5 px-2 rounded-lg hover:bg-[#252840]/30 transition-colors text-left group"
                      >
                        {done ? (
                          <CheckCircle className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-[#2a2d3e] group-hover:text-[#64748b] shrink-0 mt-0.5 transition-colors" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm ${done ? "line-through text-[#64748b]" : "text-[#f1f5f9]"}`}
                          >
                            {item.label}
                          </p>
                          {item.description && !done && (
                            <p className="text-xs text-[#64748b] mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <span
                          className={`text-[10px] font-semibold shrink-0 mt-0.5 ${PRIORITY_COLORS[item.priority]}`}
                        >
                          {PRIORITY_LABELS[item.priority]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
