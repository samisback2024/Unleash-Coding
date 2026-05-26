import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  getAllModules,
  createModule,
  updateModule,
  deleteModule,
  getAllLearningPaths,
} from "@/services/admin";
import { AdminTable, AdminModal } from "@/components/admin";

const LEVELS = ["beginner", "intermediate", "advanced"];

const EMPTY_FORM = {
  title: "",
  path_id: "",
  description: "",
  level: "beginner",
  duration: "2 hours",
  order_index: "0",
};
type ModuleForm = typeof EMPTY_FORM;

function fc() {
  return "w-full bg-[#0f1117] border border-[#2a2d3e] rounded-lg px-3 py-2 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6c63ff]";
}
function lc() {
  return "block text-xs font-medium text-[#94a3b8] mb-1";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildColumns(
  onEdit: (r: Record<string, any>) => void,
  onDel: (r: Record<string, any>) => void,
) {
  return [
    {
      key: "title",
      label: "Title",
      render: (r: Record<string, any>) => (
        <span className="font-medium text-[#f1f5f9]">{r.title}</span>
      ),
    },
    {
      key: "pathTitle",
      label: "Path",
      render: (r: Record<string, any>) => (
        <span className="text-[#94a3b8]">{r.pathTitle}</span>
      ),
    },
    {
      key: "level",
      label: "Level",
      render: (r: Record<string, any>) => (
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${
            r.level === "beginner"
              ? "bg-green-500/20 text-green-400"
              : r.level === "intermediate"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
          }`}
        >
          {r.level}
        </span>
      ),
    },
    {
      key: "order_index",
      label: "Order",
      render: (r: Record<string, any>) => String(r.order_index ?? 0),
    },
    {
      key: "actions",
      label: "",
      width: "80px",
      render: (r: Record<string, any>) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(r)}
            className="p-1.5 rounded text-[#64748b] hover:text-[#6c63ff] hover:bg-[#6c63ff]/10 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDel(r)}
            className="p-1.5 rounded text-[#64748b] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];
}

export default function AdminModulesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<Record<string, any>[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [paths, setPaths] = useState<Record<string, any>[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ModuleForm>(EMPTY_FORM);
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
    const [mods, ps] = await Promise.all([
      getAllModules(),
      getAllLearningPaths(),
    ]);
    setItems(mods);
    setPaths(ps);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

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
      level: row.level ?? "beginner",
      duration: row.duration ?? "",
      order_index: String(row.order_index ?? 0),
    });
    setIsModalOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim() || !form.path_id) {
      showToast("Title and path are required.", "error");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      order_index: parseInt(form.order_index, 10) || 0,
    };
    const result = editingId
      ? await updateModule(editingId, payload)
      : await createModule(payload);
    setSaving(false);
    if (result.error) {
      showToast(result.error, "error");
      return;
    }
    showToast(editingId ? "Module updated." : "Module created.");
    setIsModalOpen(false);
    load();
  }

  async function handleDelete() {
    if (!deleting) return;
    const result = await deleteModule(deleting.id);
    if (result.error) {
      showToast(result.error, "error");
      return;
    }
    showToast("Module deleted.");
    setDeleting(null);
    load();
  }

  function field(key: keyof ModuleForm) {
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
        <h1 className="text-xl font-bold text-[#f1f5f9]">Modules</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Manage curriculum modules within learning paths
        </p>
      </div>

      <AdminTable
        columns={buildColumns(openEdit, (r) => setDeleting(r))}
        data={items}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search modules…"
        onCreateNew={openCreate}
        createLabel="New Module"
        loading={loading}
        emptyMessage="No modules yet."
      />

      <AdminModal
        title={editingId ? "Edit Module" : "Create Module"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        submitting={saving}
        submitLabel={editingId ? "Save Changes" : "Create Module"}
      >
        <div>
          <label className={lc()}>Title *</label>
          <input
            className={fc()}
            value={form.title}
            onChange={field("title")}
            placeholder="Introduction to Python"
          />
        </div>
        <div>
          <label className={lc()}>Learning Path *</label>
          <select
            className={fc()}
            value={form.path_id}
            onChange={field("path_id")}
          >
            <option value="">Select a path…</option>
            {paths.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={lc()}>Description</label>
          <textarea
            className={fc()}
            rows={2}
            value={form.description}
            onChange={field("description")}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={lc()}>Level</label>
            <select
              className={fc()}
              value={form.level}
              onChange={field("level")}
            >
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={lc()}>Duration</label>
            <input
              className={fc()}
              value={form.duration}
              onChange={field("duration")}
              placeholder="2 hours"
            />
          </div>
          <div>
            <label className={lc()}>Order</label>
            <input
              className={fc()}
              type="number"
              value={form.order_index}
              onChange={field("order_index")}
            />
          </div>
        </div>
      </AdminModal>

      <AdminModal
        title="Delete Module"
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onSubmit={handleDelete}
        submitLabel="Delete"
        size="md"
      >
        <p className="text-sm text-[#94a3b8]">
          Delete{" "}
          <span className="font-semibold text-[#f1f5f9]">
            {deleting?.title}
          </span>
          ? All lessons within this module will also be deleted. This cannot be
          undone.
        </p>
      </AdminModal>
    </div>
  );
}
