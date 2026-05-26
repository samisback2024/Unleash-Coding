import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  getAllLearningPaths,
  createLearningPath,
  updateLearningPath,
  deleteLearningPath,
} from "@/services/admin";
import { AdminTable, AdminModal } from "@/components/admin";

const DIFFICULTIES = ["beginner", "intermediate", "advanced"];
const CATEGORIES = [
  "Python",
  "JavaScript",
  "Frontend",
  "Backend",
  "Full-Stack",
  "AI/ML",
  "DevOps",
  "Cybersecurity",
];

const EMPTY_FORM = {
  title: "",
  slug: "",
  description: "",
  category: "Python",
  difficulty: "beginner",
  estimated_timeline: "3 months",
  weekly_hours: "10-15 hours/week",
  icon: "🐍",
  color: "#6c63ff",
  tags: "",
};

type PathForm = typeof EMPTY_FORM;

function fieldClass() {
  return "w-full bg-[#0f1117] border border-[#2a2d3e] rounded-lg px-3 py-2 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6c63ff]";
}

function labelClass() {
  return "block text-xs font-medium text-[#94a3b8] mb-1";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function columns(
  onEdit: (row: Record<string, any>) => void,
  onDelete: (row: Record<string, any>) => void,
) {
  return [
    {
      key: "title",
      label: "Title",
      render: (r: Record<string, any>) => (
        <span className="font-medium text-[#f1f5f9]">{r.title}</span>
      ),
    },
    { key: "slug", label: "Slug" },
    { key: "category", label: "Category" },
    {
      key: "difficulty",
      label: "Difficulty",
      render: (r: Record<string, any>) => (
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${
            r.difficulty === "beginner"
              ? "bg-green-500/20 text-green-400"
              : r.difficulty === "intermediate"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
          }`}
        >
          {r.difficulty}
        </span>
      ),
    },
    {
      key: "enrolled",
      label: "Enrolled",
      render: (r: Record<string, any>) => String(r.enrolled ?? 0),
    },
    {
      key: "actions",
      label: "",
      width: "100px",
      render: (r: Record<string, any>) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(r)}
            className="p-1.5 rounded text-[#64748b] hover:text-[#6c63ff] hover:bg-[#6c63ff]/10 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(r)}
            className="p-1.5 rounded text-[#64748b] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];
}

export default function AdminPathsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [paths, setPaths] = useState<Record<string, any>[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PathForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deleting, setDeleting] = useState<Record<string, any> | null>(null);
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
    setPaths(await getAllLearningPaths());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function openEdit(row: Record<string, any>) {
    setEditingId(row.id);
    setForm({
      title: row.title ?? "",
      slug: row.slug ?? "",
      description: row.description ?? "",
      category: row.category ?? "Python",
      difficulty: row.difficulty ?? "beginner",
      estimated_timeline: row.estimated_timeline ?? "",
      weekly_hours: row.weekly_hours ?? "",
      icon: row.icon ?? "",
      color: row.color ?? "#6c63ff",
      tags: Array.isArray(row.tags) ? row.tags.join(", ") : (row.tags ?? ""),
    });
    setIsModalOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim() || !form.slug.trim()) {
      showToast("Title and slug are required.", "error");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    const result = editingId
      ? await updateLearningPath(editingId, payload)
      : await createLearningPath(payload);
    setSaving(false);
    if (result.error) {
      showToast(result.error, "error");
    } else {
      showToast(editingId ? "Path updated." : "Path created.");
      setIsModalOpen(false);
      load();
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    const result = await deleteLearningPath(deleting.id);
    if (result.error) {
      showToast(result.error, "error");
    } else {
      showToast("Path deleted.");
      setDeleting(null);
      load();
    }
  }

  function field(key: keyof PathForm) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

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

      <div>
        <h1 className="text-xl font-bold text-[#f1f5f9]">Learning Paths</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Manage all career learning paths
        </p>
      </div>

      <AdminTable
        columns={columns(openEdit, (r) => setDeleting(r))}
        data={paths}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search paths…"
        onCreateNew={openCreate}
        createLabel="New Path"
        loading={loading}
        emptyMessage="No learning paths yet."
      />

      {/* Create / Edit Modal */}
      <AdminModal
        title={editingId ? "Edit Learning Path" : "Create Learning Path"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        submitting={saving}
        submitLabel={editingId ? "Save Changes" : "Create Path"}
        size="xl"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass()}>Title *</label>
            <input
              className={fieldClass()}
              value={form.title}
              onChange={field("title")}
              placeholder="Python Career Path"
            />
          </div>
          <div>
            <label className={labelClass()}>Slug *</label>
            <input
              className={fieldClass()}
              value={form.slug}
              onChange={field("slug")}
              placeholder="python-career-path"
            />
          </div>
        </div>
        <div>
          <label className={labelClass()}>Description</label>
          <textarea
            className={fieldClass()}
            rows={3}
            value={form.description}
            onChange={field("description")}
            placeholder="A comprehensive path to…"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass()}>Category</label>
            <select
              className={fieldClass()}
              value={form.category}
              onChange={field("category")}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass()}>Difficulty</label>
            <select
              className={fieldClass()}
              value={form.difficulty}
              onChange={field("difficulty")}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass()}>Estimated Timeline</label>
            <input
              className={fieldClass()}
              value={form.estimated_timeline}
              onChange={field("estimated_timeline")}
              placeholder="3 months"
            />
          </div>
          <div>
            <label className={labelClass()}>Weekly Hours</label>
            <input
              className={fieldClass()}
              value={form.weekly_hours}
              onChange={field("weekly_hours")}
              placeholder="10-15 hours/week"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass()}>Icon (emoji)</label>
            <input
              className={fieldClass()}
              value={form.icon}
              onChange={field("icon")}
              placeholder="🐍"
            />
          </div>
          <div>
            <label className={labelClass()}>Color (hex)</label>
            <input
              className={fieldClass()}
              value={form.color}
              onChange={field("color")}
              placeholder="#6c63ff"
            />
          </div>
        </div>
        <div>
          <label className={labelClass()}>Tags (comma-separated)</label>
          <input
            className={fieldClass()}
            value={form.tags}
            onChange={field("tags")}
            placeholder="python, automation, data science"
          />
        </div>
      </AdminModal>

      {/* Delete Confirm Modal */}
      <AdminModal
        title="Delete Learning Path"
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onSubmit={handleDelete}
        submitLabel="Delete"
        size="md"
      >
        <p className="text-sm text-[#94a3b8]">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[#f1f5f9]">
            {deleting?.title}
          </span>
          ? This will also delete all modules, lessons, challenges, and projects
          under it. This action cannot be undone.
        </p>
      </AdminModal>
    </div>
  );
}
