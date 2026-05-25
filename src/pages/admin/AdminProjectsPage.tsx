import { useEffect, useState } from "react";
import { Pencil, Trash2, Star, Eye, EyeOff } from "lucide-react";
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  getAllLearningPaths,
  getShowcaseSubmissions,
  featureProject,
  unfeatureProject,
  setSubmissionPublic,
  updateSubmissionStatus,
} from "@/services/admin";
import type { AdminShowcaseSubmission } from "@/types";
import { AdminTable, AdminModal } from "@/components/admin";

const DIFFICULTIES = ["beginner", "intermediate", "advanced"];
const PORTFOLIO_LEVELS = [
  "Beginner Portfolio",
  "Internship Ready",
  "Junior Developer Ready",
  "Advanced / Company-Level",
];
const SUBMISSION_STATUSES = ["submitted", "reviewed", "approved", "revision_requested"];

const EMPTY_FORM = {
  title: "",
  path_id: "",
  description: "",
  difficulty: "beginner",
  portfolio_level: "Beginner Portfolio",
  requirements: "",
  skills_covered: "",
  estimated_hours: "5",
  xp_reward: "100",
  order_index: "0",
  is_capstone: false,
};
type ProjectForm = typeof EMPTY_FORM;

function fc() {
  return "w-full bg-[#0f1117] border border-[#2a2d3e] rounded-lg px-3 py-2 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6c63ff]";
}
function lc() { return "block text-xs font-medium text-[#94a3b8] mb-1"; }

export default function AdminProjectsPage() {
  const [tab, setTab] = useState<"projects" | "showcase">("projects");

  // Portfolio projects state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [projects, setProjects] = useState<Record<string, any>[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [paths, setPaths] = useState<Record<string, any>[]>([]);
  const [projSearch, setProjSearch] = useState("");
  const [projLoading, setProjLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deleting, setDeleting] = useState<Record<string, any> | null>(null);

  // Showcase state
  const [showcase, setShowcase] = useState<AdminShowcaseSubmission[]>([]);
  const [showcaseSearch, setShowcaseSearch] = useState("");
  const [showcaseLoading, setShowcaseLoading] = useState(true);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function loadProjects() {
    setProjLoading(true);
    const [ps, paths_] = await Promise.all([getAllProjects(), getAllLearningPaths()]);
    setProjects(ps);
    setPaths(paths_);
    setProjLoading(false);
  }

  async function loadShowcase() {
    setShowcaseLoading(true);
    setShowcase(await getShowcaseSubmissions());
    setShowcaseLoading(false);
  }

  useEffect(() => { loadProjects(); loadShowcase(); }, []);

  // Portfolio project actions
  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, path_id: paths[0]?.id ?? "" });
    setIsModalOpen(true);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function openEdit(row: Record<string, any>) {
    setEditingId(row.id);
    setForm({
      title: row.title ?? "",
      path_id: row.path_id ?? "",
      description: row.description ?? "",
      difficulty: row.difficulty ?? "beginner",
      portfolio_level: row.portfolio_level ?? "Beginner Portfolio",
      requirements: Array.isArray(row.requirements) ? row.requirements.join("\n") : (row.requirements ?? ""),
      skills_covered: Array.isArray(row.skills_covered) ? row.skills_covered.join(", ") : (row.skills_covered ?? ""),
      estimated_hours: String(row.estimated_hours ?? 5),
      xp_reward: String(row.xp_reward ?? 100),
      order_index: String(row.order_index ?? 0),
      is_capstone: !!row.is_capstone,
    });
    setIsModalOpen(true);
  }

  async function handleSaveProject() {
    if (!form.title.trim() || !form.path_id) {
      showToast("Title and path are required.", "error");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      requirements: form.requirements.split("\n").map((s) => s.trim()).filter(Boolean),
      skills_covered: form.skills_covered.split(",").map((s) => s.trim()).filter(Boolean),
      estimated_hours: parseInt(form.estimated_hours, 10) || 5,
      xp_reward: parseInt(form.xp_reward, 10) || 100,
      order_index: parseInt(form.order_index, 10) || 0,
    };
    const result = editingId ? await updateProject(editingId, payload) : await createProject(payload);
    setSaving(false);
    if (result.error) { showToast(result.error, "error"); return; }
    showToast(editingId ? "Project updated." : "Project created.");
    setIsModalOpen(false);
    loadProjects();
  }

  async function handleDeleteProject() {
    if (!deleting) return;
    const result = await deleteProject(deleting.id);
    if (result.error) { showToast(result.error, "error"); return; }
    showToast("Project deleted.");
    setDeleting(null);
    loadProjects();
  }

  // Showcase actions
  async function toggleFeature(sub: AdminShowcaseSubmission) {
    const result = sub.isFeatured ? await unfeatureProject(sub.id) : await featureProject(sub.id);
    if (result.error) { showToast(result.error, "error"); return; }
    showToast(sub.isFeatured ? "Removed from featured." : "Featured!");
    loadShowcase();
  }

  async function togglePublic(sub: AdminShowcaseSubmission) {
    const result = await setSubmissionPublic(sub.id, !sub.isPublic);
    if (result.error) { showToast(result.error, "error"); return; }
    showToast(sub.isPublic ? "Hidden from community." : "Visible in community.");
    loadShowcase();
  }

  async function handleStatusChange(sub: AdminShowcaseSubmission, status: string) {
    const result = await updateSubmissionStatus(sub.id, status);
    if (result.error) { showToast(result.error, "error"); return; }
    showToast("Status updated.");
    loadShowcase();
  }

  function field(key: keyof ProjectForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  const projectColumns = [
    { key: "title", label: "Title", render: (r: Record<string, any>) => <span className="font-medium text-[#f1f5f9]">{r.title}</span> },
    { key: "pathTitle", label: "Path", render: (r: Record<string, any>) => <span className="text-[#94a3b8]">{r.pathTitle}</span> },
    { key: "portfolio_level", label: "Portfolio Level", render: (r: Record<string, any>) => (
      <span className="text-xs text-[#6c63ff]">{r.portfolio_level}</span>
    )},
    { key: "xp_reward", label: "XP", render: (r: Record<string, any>) => `${r.xp_reward ?? 0} XP` },
    { key: "is_capstone", label: "Capstone", render: (r: Record<string, any>) => r.is_capstone ? "✓" : "" },
    { key: "actions", label: "", width: "80px", render: (r: Record<string, any>) => (
      <div className="flex items-center justify-end gap-1">
        <button onClick={() => openEdit(r)} className="p-1.5 rounded text-[#64748b] hover:text-[#6c63ff] hover:bg-[#6c63ff]/10 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
        <button onClick={() => setDeleting(r)} className="p-1.5 rounded text-[#64748b] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    )},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ] as { key: string; label: string; render?: (r: Record<string, any>) => React.ReactNode; width?: string }[];

  const showcaseFiltered = showcase.filter((s) =>
    s.projectTitle.toLowerCase().includes(showcaseSearch.toLowerCase()) ||
    s.pathTitle.toLowerCase().includes(showcaseSearch.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-5">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-xl ${
          toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>{toast.message}</div>
      )}

      <div>
        <h1 className="text-xl font-bold text-[#f1f5f9]">Projects</h1>
        <p className="text-sm text-[#64748b] mt-1">Manage portfolio projects and community showcase submissions</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#1e2130] border border-[#2a2d3e] rounded-lg p-1 w-fit">
        {(["projects", "showcase"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded text-xs font-medium transition-colors capitalize ${
              tab === t ? "bg-[#6c63ff] text-white" : "text-[#94a3b8] hover:text-[#f1f5f9]"
            }`}
          >
            {t === "projects" ? "Portfolio Projects" : "Community Showcase"}
          </button>
        ))}
      </div>

      {tab === "projects" && (
        <AdminTable
          columns={projectColumns}
          data={projects}
          search={projSearch}
          onSearchChange={setProjSearch}
          searchPlaceholder="Search projects…"
          onCreateNew={openCreate}
          createLabel="New Project"
          loading={projLoading}
          emptyMessage="No portfolio projects yet."
        />
      )}

      {tab === "showcase" && (
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={showcaseSearch}
              onChange={(e) => setShowcaseSearch(e.target.value)}
              placeholder="Search submissions…"
              className="w-full max-w-sm bg-[#1e2130] border border-[#2a2d3e] rounded-lg px-4 py-2 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6c63ff]"
            />
          </div>
          <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2d3e]">
                    {["Project", "Path", "Status", "Public", "Featured", "Submitted", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {showcaseLoading ? (
                    <tr><td colSpan={7} className="px-4 py-12 text-center">
                      <div className="w-6 h-6 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin mx-auto" />
                    </td></tr>
                  ) : showcaseFiltered.length === 0 ? (
                    <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-[#64748b]">No submissions yet.</td></tr>
                  ) : showcaseFiltered.map((s) => (
                    <tr key={s.id} className="border-b border-[#2a2d3e] last:border-0 hover:bg-[#252840] transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-[#f1f5f9]">{s.projectTitle}</td>
                      <td className="px-4 py-3 text-sm text-[#94a3b8]">{s.pathTitle}</td>
                      <td className="px-4 py-3">
                        <select
                          value={s.status}
                          onChange={(e) => handleStatusChange(s, e.target.value)}
                          className="bg-[#0f1117] border border-[#2a2d3e] rounded px-2 py-1 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#6c63ff]"
                        >
                          {SUBMISSION_STATUSES.map((st) => <option key={st}>{st}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => togglePublic(s)} className={`p-1.5 rounded transition-colors ${s.isPublic ? "text-green-400 hover:bg-green-400/10" : "text-[#64748b] hover:text-[#94a3b8] hover:bg-[#252840]"}`}>
                          {s.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleFeature(s)} className={`p-1.5 rounded transition-colors ${s.isFeatured ? "text-yellow-400 hover:bg-yellow-400/10" : "text-[#64748b] hover:text-yellow-400 hover:bg-yellow-400/10"}`}>
                          <Star className={`w-4 h-4 ${s.isFeatured ? "fill-current" : ""}`} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#64748b]">
                        {new Date(s.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {s.githubUrl && (
                          <a href={s.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#6c63ff] hover:underline">GitHub</a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 border-t border-[#2a2d3e] text-xs text-[#64748b]">
              {showcaseFiltered.length} of {showcase.length} submissions
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Project Modal */}
      <AdminModal
        title={editingId ? "Edit Portfolio Project" : "Create Portfolio Project"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveProject}
        submitting={saving}
        submitLabel={editingId ? "Save Changes" : "Create Project"}
        size="xl"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={lc()}>Title *</label>
            <input className={fc()} value={form.title} onChange={field("title")} placeholder="Build a To-Do App" />
          </div>
          <div className="col-span-2">
            <label className={lc()}>Learning Path *</label>
            <select className={fc()} value={form.path_id} onChange={field("path_id")}>
              <option value="">Select path…</option>
              {paths.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className={lc()}>Description</label>
            <textarea className={fc()} rows={3} value={form.description} onChange={field("description")} />
          </div>
          <div>
            <label className={lc()}>Difficulty</label>
            <select className={fc()} value={form.difficulty} onChange={field("difficulty")}>
              {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={lc()}>Portfolio Level</label>
            <select className={fc()} value={form.portfolio_level} onChange={field("portfolio_level")}>
              {PORTFOLIO_LEVELS.map((pl) => <option key={pl}>{pl}</option>)}
            </select>
          </div>
          <div>
            <label className={lc()}>Estimated Hours</label>
            <input className={fc()} type="number" value={form.estimated_hours} onChange={field("estimated_hours")} />
          </div>
          <div>
            <label className={lc()}>XP Reward</label>
            <input className={fc()} type="number" value={form.xp_reward} onChange={field("xp_reward")} />
          </div>
          <div className="col-span-2">
            <label className={lc()}>Requirements (one per line)</label>
            <textarea className={fc()} rows={4} value={form.requirements} onChange={field("requirements")} placeholder="Implement CRUD operations&#10;Use local storage&#10;Make it responsive" />
          </div>
          <div className="col-span-2">
            <label className={lc()}>Skills Covered (comma-separated)</label>
            <input className={fc()} value={form.skills_covered} onChange={field("skills_covered")} placeholder="Python, OOP, File I/O" />
          </div>
          <div>
            <label className={lc()}>Order</label>
            <input className={fc()} type="number" value={form.order_index} onChange={field("order_index")} />
          </div>
          <div className="flex items-center gap-2 mt-5">
            <input
              type="checkbox"
              id="is_capstone"
              checked={form.is_capstone}
              onChange={(e) => setForm((f) => ({ ...f, is_capstone: e.target.checked }))}
              className="w-4 h-4 accent-[#6c63ff]"
            />
            <label htmlFor="is_capstone" className="text-sm text-[#94a3b8]">Capstone project</label>
          </div>
        </div>
      </AdminModal>

      {/* Delete Confirm */}
      <AdminModal
        title="Delete Project"
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onSubmit={handleDeleteProject}
        submitLabel="Delete"
        size="md"
      >
        <p className="text-sm text-[#94a3b8]">
          Delete project <span className="font-semibold text-[#f1f5f9]">{deleting?.title}</span>? This cannot be undone.
        </p>
      </AdminModal>
    </div>
  );
}
