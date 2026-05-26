import { useEffect, useState } from "react";
import { ShieldCheck, User } from "lucide-react";
import { getAllUsers, updateUserRole } from "@/services/admin";
import { useAuth } from "@/context/AuthContext";
import type { AdminUser } from "@/types";

function timeAgo(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function load() {
    setLoading(true);
    setUsers(await getAllUsers());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleRole(u: AdminUser) {
    if (u.id === currentUser?.id) {
      showToast("You cannot change your own role.", "error");
      return;
    }
    const newRole = u.role === "admin" ? "user" : "admin";
    const result = await updateUserRole(u.id, newRole);
    if (result.error) {
      showToast(result.error, "error");
      return;
    }
    showToast(
      `${u.username || u.fullName} is now ${newRole === "admin" ? "an admin" : "a regular user"}.`,
    );
    setUsers((prev) =>
      prev.map((usr) => (usr.id === u.id ? { ...usr, role: newRole } : usr)),
    );
  }

  const filtered = users.filter((u) => {
    const matchSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <div className="p-6 space-y-5">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-xl ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#f1f5f9]">Users</h1>
          <p className="text-sm text-[#64748b] mt-1">
            Manage user roles and view learner stats
          </p>
        </div>
        <div className="text-sm text-[#94a3b8]">
          {users.length} total · {adminCount} admin{adminCount !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username or name…"
          className="flex-1 min-w-[200px] bg-[#1e2130] border border-[#2a2d3e] rounded-lg px-4 py-2 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6c63ff]"
        />
        <div className="flex gap-1 bg-[#1e2130] border border-[#2a2d3e] rounded-lg p-1">
          {(["all", "user", "admin"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors capitalize ${
                roleFilter === r
                  ? "bg-[#6c63ff] text-white"
                  : "text-[#94a3b8] hover:text-[#f1f5f9]"
              }`}
            >
              {r === "all" ? "All Roles" : r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2d3e]">
                {[
                  "User",
                  "Username",
                  "Role",
                  "XP",
                  "Level",
                  "Streak",
                  "Joined",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="w-6 h-6 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-sm text-[#64748b]"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-[#2a2d3e] last:border-0 hover:bg-[#252840] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#6c63ff]/20 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-[#6c63ff]">
                            {(u.fullName || u.username || "?")[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-[#f1f5f9] truncate max-w-[120px]">
                          {u.fullName || u.username}
                        </span>
                        {u.id === currentUser?.id && (
                          <span className="text-[10px] text-[#64748b]">
                            (you)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#94a3b8]">
                      {u.username}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`flex items-center gap-1 w-fit px-2 py-0.5 rounded text-xs font-medium ${
                          u.role === "admin"
                            ? "bg-[#6c63ff]/20 text-[#6c63ff]"
                            : "bg-[#64748b]/20 text-[#94a3b8]"
                        }`}
                      >
                        {u.role === "admin" ? (
                          <ShieldCheck className="w-3 h-3" />
                        ) : (
                          <User className="w-3 h-3" />
                        )}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#94a3b8]">
                      {u.xp.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#94a3b8]">
                      {u.level}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#94a3b8]">
                      {u.streak} 🔥
                    </td>
                    <td className="px-4 py-3 text-xs text-[#64748b]">
                      {timeAgo(u.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleRole(u)}
                        disabled={u.id === currentUser?.id}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                          u.role === "admin"
                            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            : "bg-[#6c63ff]/10 text-[#6c63ff] hover:bg-[#6c63ff]/20"
                        }`}
                      >
                        {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 border-t border-[#2a2d3e] text-xs text-[#64748b]">
          {filtered.length} of {users.length} users
        </div>
      </div>
    </div>
  );
}
