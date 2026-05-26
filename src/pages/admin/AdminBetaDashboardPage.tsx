import { useEffect, useState } from "react";
import {
  Users,
  Zap,
  BookOpen,
  Code2,
  FolderOpen,
  MessageSquare,
  Bug,
  Clock,
  Mail,
  MailCheck,
  Loader2,
  Copy,
  Check,
  Trash2,
  Plus,
} from "lucide-react";
import { ActivityStatsCard } from "@/components/admin";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getBetaAnalytics } from "@/services/analytics";
import {
  getWaitlistUsers,
  getAdminInvites,
  createBetaInvite,
  revokeInvite,
  updateWaitlistStatus,
  type WaitlistEntry,
  type BetaInvite,
} from "@/services/beta";
import type { BetaAnalytics } from "@/services/analytics";

// ─── Invite creator ───────────────────────────────────────────────────────────

function CreateInviteForm({
  onCreated,
}: {
  onCreated: (invite: BetaInvite) => void;
}) {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { invite, error } = await createBetaInvite(email.trim(), user.id);
    setLoading(false);
    if (error || !invite) {
      toastError(error ?? "Failed to create invite.");
    } else {
      success(`Invite created for ${email}`);
      setEmail("");
      onCreated(invite);
    }
  }

  return (
    <form onSubmit={handle} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="user@example.com"
        className="flex-1 bg-[#0f1117] border border-[#2a2d3e] rounded-xl px-4 py-2 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#6c63ff]"
      />
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-[#6c63ff] hover:bg-[#5b52e8] disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
        Create Invite
      </button>
    </form>
  );
}

// ─── Copy code button ─────────────────────────────────────────────────────────

function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard
      .writeText(`${window.location.origin}/invite/${code}`)
      .catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      title="Copy invite link"
      className="flex items-center gap-1.5 font-mono text-xs text-[#94a3b8] hover:text-[#6c63ff] transition-colors"
    >
      <span>{code}</span>
      {copied ? (
        <Check className="w-3.5 h-3.5 text-[#22c55e]" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  waiting: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20",
  invited: "bg-[#6c63ff]/10 text-[#6c63ff] border-[#6c63ff]/20",
  joined: "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20",
  declined: "bg-[#64748b]/10 text-[#64748b] border-[#64748b]/20",
  unused: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20",
  used: "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20",
  revoked: "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${STATUS_COLORS[status] ?? "bg-[#2a2d3e] text-[#64748b] border-[#2a2d3e]"}`}
    >
      {status}
    </span>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminBetaDashboardPage() {
  const { success, error: toastError } = useToast();
  const [analytics, setAnalytics] = useState<BetaAnalytics | null>(null);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [invites, setInvites] = useState<BetaInvite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getBetaAnalytics(),
      getWaitlistUsers(),
      getAdminInvites(),
    ]).then(([a, w, i]) => {
      setAnalytics(a);
      setWaitlist(w);
      setInvites(i);
      setLoading(false);
    });
  }, []);

  async function handleRevoke(id: string) {
    const { error } = await revokeInvite(id);
    if (error) {
      toastError(error);
    } else {
      success("Invite revoked.");
      setInvites((prev) =>
        prev.map((inv) =>
          inv.id === id ? { ...inv, status: "revoked" as const } : inv,
        ),
      );
    }
  }

  async function handleWaitlistStatus(
    id: string,
    status: WaitlistEntry["status"],
  ) {
    const { error } = await updateWaitlistStatus(id, status);
    if (error) {
      toastError(error);
    } else {
      setWaitlist((prev) =>
        prev.map((w) => (w.id === id ? { ...w, status } : w)),
      );
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#6c63ff] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#f1f5f9]">Beta Dashboard</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Monitor beta users, manage invites, and track activity
        </p>
      </div>

      {/* Analytics grid */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <ActivityStatsCard
            icon={Users}
            label="Total Users"
            value={analytics.totalUsers}
            color="#6c63ff"
          />
          <ActivityStatsCard
            icon={Zap}
            label="Active (7d)"
            value={analytics.activeUsers7d}
            color="#10b981"
          />
          <ActivityStatsCard
            icon={BookOpen}
            label="Lessons Done"
            value={analytics.lessonsCompleted}
            color="#3b82f6"
          />
          <ActivityStatsCard
            icon={Code2}
            label="Challenges"
            value={analytics.challengesCompleted}
            color="#f59e0b"
          />
          <ActivityStatsCard
            icon={FolderOpen}
            label="Projects"
            value={analytics.projectsSubmitted}
            color="#a855f7"
          />
          <ActivityStatsCard
            icon={MessageSquare}
            label="Feedback"
            value={analytics.feedbackCount}
            color="#06b6d4"
          />
          <ActivityStatsCard
            icon={Bug}
            label="Bug Reports"
            value={analytics.bugReports}
            color="#ef4444"
          />
          <ActivityStatsCard
            icon={Clock}
            label="Waitlist"
            value={analytics.waitlistCount}
            color="#f59e0b"
          />
          <ActivityStatsCard
            icon={Mail}
            label="Unused Invites"
            value={analytics.unusedInvites}
            color="#94a3b8"
          />
          <ActivityStatsCard
            icon={MailCheck}
            label="Used Invites"
            value={analytics.usedInvites}
            color="#22c55e"
          />
        </div>
      )}

      {/* Invite Management */}
      <section className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-5 space-y-4">
        <h2 className="text-base font-semibold text-[#f1f5f9]">
          Manage Invites
        </h2>
        <CreateInviteForm
          onCreated={(inv) => setInvites((prev) => [inv, ...prev])}
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2d3e]">
                <th className="text-left py-2 px-3 text-xs font-medium text-[#64748b]">
                  Email
                </th>
                <th className="text-left py-2 px-3 text-xs font-medium text-[#64748b]">
                  Invite Link
                </th>
                <th className="text-left py-2 px-3 text-xs font-medium text-[#64748b]">
                  Status
                </th>
                <th className="text-left py-2 px-3 text-xs font-medium text-[#64748b]">
                  Created
                </th>
                <th className="py-2 px-3" />
              </tr>
            </thead>
            <tbody>
              {invites.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-sm text-[#64748b]"
                  >
                    No invites yet
                  </td>
                </tr>
              ) : (
                invites.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-[#2a2d3e]/50 hover:bg-[#252840]/30 transition-colors"
                  >
                    <td className="py-2.5 px-3 text-[#94a3b8]">{inv.email}</td>
                    <td className="py-2.5 px-3">
                      <CopyCode code={inv.inviteCode} />
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="py-2.5 px-3 text-xs text-[#64748b]">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {inv.status === "unused" && (
                        <button
                          onClick={() => handleRevoke(inv.id)}
                          className="text-[#ef4444]/60 hover:text-[#ef4444] transition-colors p-1"
                          title="Revoke invite"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Waitlist */}
      <section className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-5 space-y-4">
        <h2 className="text-base font-semibold text-[#f1f5f9]">
          Waitlist ({waitlist.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2d3e]">
                <th className="text-left py-2 px-3 text-xs font-medium text-[#64748b]">
                  Email
                </th>
                <th className="text-left py-2 px-3 text-xs font-medium text-[#64748b]">
                  Name
                </th>
                <th className="text-left py-2 px-3 text-xs font-medium text-[#64748b]">
                  Interest
                </th>
                <th className="text-left py-2 px-3 text-xs font-medium text-[#64748b]">
                  Status
                </th>
                <th className="text-left py-2 px-3 text-xs font-medium text-[#64748b]">
                  Joined
                </th>
                <th className="py-2 px-3" />
              </tr>
            </thead>
            <tbody>
              {waitlist.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-sm text-[#64748b]"
                  >
                    No waitlist entries yet
                  </td>
                </tr>
              ) : (
                waitlist.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-[#2a2d3e]/50 hover:bg-[#252840]/30 transition-colors"
                  >
                    <td className="py-2.5 px-3 text-[#94a3b8]">
                      {entry.email}
                    </td>
                    <td className="py-2.5 px-3 text-[#64748b]">
                      {entry.name || "—"}
                    </td>
                    <td className="py-2.5 px-3 text-xs text-[#64748b]">
                      {entry.interestArea || "—"}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={entry.status} />
                    </td>
                    <td className="py-2.5 px-3 text-xs text-[#64748b]">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {entry.status === "waiting" && (
                        <button
                          onClick={() =>
                            handleWaitlistStatus(entry.id, "invited")
                          }
                          className="text-xs text-[#6c63ff] hover:underline"
                        >
                          Mark Invited
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
