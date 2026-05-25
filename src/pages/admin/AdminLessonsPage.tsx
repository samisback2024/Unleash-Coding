import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  getAllLessons,
  getAllModules,
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonContent,
} from "@/services/admin";
import { AdminTable, AdminModal } from "@/components/admin";

const LESSON_TYPES = ["reading", "video", "interactive"];

const EMPTY_FORM = {
  title: "",
  module_id: "",
  content: "",
  type: "reading",
  duration: "15 min",
  order_index: "0",
  estimated_minutes: "15",
};
type LessonForm = typeof EMPTY_FORM;

function fc() {
  return "w-full bg-[#0f1117] border border-[#2a2d3e] rounded-lg px-3 py-2 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6c63ff]";
}
function lc() { return "block text-xs font-medium text-[#94a3b8] mb-1"; }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildColumns(onEdit: (r: Record<string, any>) => void, onDel: (r: Record<string, any>) => void) {
  return [
    { key: "title", label: "Title", render: (r: Record<string, any>) => <span className="font-medium text-[#f1f5f9]">{r.title}</span> },
    { key: "moduleTitle", label: "Module", render: (r: Record<string, any>) => <span className="text-[#94a3b8]">{r.moduleTitle}</span> },
    { key: "type", label: "Type", render: (r: Record<string, any>) => (
      <span className="px-2 py-0.5 bg-[#6c63ff]/20 text-[#6c63ff] rounded text-xs">{r.type}</span>
    )},
    { key: "duration", label: "Duration" },
    { key: "order_index", label: "Order", render: (r: Record<string, any>) => String(r.order_index ?? 0) },
    { key: "actions", label: "", width: "80px", render: (r: Record<string, any>) => (
      <div className="flex items-center justify-end gap-1">
        <button onClick={() => onEdit(r)} className="p-1.5 rounded text-[#64748b] hover:text-[#6c63ff] hover:bg-[#6c63ff]/10 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
        <button onClick={() => onDel(r)} className="p-1.5 rounded text-[#64748b] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    )},
  ];
}

export default function AdminLessonsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<Record<string, any>[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [modules, setModules] = useState<Record<string, any>[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LessonForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deleting, setDeleting] = useState<Record<string, any> | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function load() {
    setLoading(true);
    const [ls, mods] = await Promise.all([getAllLessons(), getAllModules()]);
    setItems(ls);
    setModules(mods);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, module_id: modules[0]?.id ?? "" });
    setIsModalOpen(true);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function openEdit(row: Record<string, any>) {
    setEditingId(row.id);
    const { content } = await getLessonContent(row.id);
    setForm({
      title: row.title ?? "",
      module_id: row.module_id ?? "",
      content,
      type: row.type ?? "reading",
      duration: row.duration ?? "",
      order_index: String(row.order_index ?? 0),
      estimated_minutes: String(row.estimated_minutes ?? 15),
    });
    setIsModalOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim() || !form.module_id) {
      showToast("Title and module are required.", "error");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      order_index: parseInt(form.order_index, 10) || 0,
      estimated_minutes: parseInt(form.estimated_minutes, 10) || 15,
    };
    const result = editingId ? await updateLesson(editingId, payload) : await createLesson(payload);
    setSaving(false);
    if (result.error) { showToast(result.error, "error"); return; }
    showToast(editingId ? "Lesson updated." : "Lesson created.");
    setIsModalOpen(false);
    load();
  }

  async function handleDelete() {
    if (!deleting) return;
    const result = await deleteLesson(deleting.id);
    if (result.error) { showToast(result.error, "error"); return; }
    showToast("Lesson deleted.");
    setDeleting(null);
    load();
  }

  function field(key: keyof LessonForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  return (
    <div className="p-6 space-y-5">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-xl ${
          toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>{toast.message}</div>
      )}
      <div>
        <h1 className="text-xl font-bold text-[#f1f5f9]">Lessons</h1>
        <p className="text-sm text-[#64748b] mt-1">Manage lesson content within modules</p>
      </div>

      <AdminTable
        columns={buildColumns(openEdit, (r) => setDeleting(r))}
        data={items}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search lessons…"
        onCreateNew={openCreate}
        createLabel="New Lesson"
        loading={loading}
        emptyMessage="No lessons yet."
      />

      <AdminModal
        title={editingId ? "Edit Lesson" : "Create Lesson"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        submitting={saving}
        submitLabel={editingId ? "Save Changes" : "Create Lesson"}
        size="xl"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={lc()}>Title *</label>
            <input className={fc()} value={form.title} onChange={field("title")} placeholder="Getting Started with Python" />
          </div>
          <div className="col-span-2">
            <label className={lc()}>Module *</label>
            <select className={fc()} value={form.module_id} onChange={field("module_id")}>
              <option value="">Select a module…</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>{m.pathTitle ? `${m.pathTitle} → ` : ""}{m.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={lc()}>Type</label>
            <select className={fc()} value={form.type} onChange={field("type")}>
              {LESSON_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={lc()}>Duration</label>
            <input className={fc()} value={form.duration} onChange={field("duration")} placeholder="15 min" />
          </div>
          <div>
            <label className={lc()}>Estimated Minutes</label>
            <input className={fc()} type="number" value={form.estimated_minutes} onChange={field("estimated_minutes")} />
          </div>
          <div>
            <label className={lc()}>Order</label>
            <input className={fc()} type="number" value={form.order_index} onChange={field("order_index")} />
          </div>
          <div className="col-span-2">
            <label className={lc()}>Content (Markdown)</label>
            <textarea
              className={fc()}
              rows={12}
              value={form.content}
              onChange={field("content")}
              placeholder="# Lesson Title&#10;&#10;Write your lesson content here using Markdown…"
            />
          </div>
        </div>
      </AdminModal>

      <AdminModal
        title="Delete Lesson"
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onSubmit={handleDelete}
        submitLabel="Delete"
        size="md"
      >
        <p className="text-sm text-[#94a3b8]">
          Delete lesson <span className="font-semibold text-[#f1f5f9]">{deleting?.title}</span>? This cannot be undone.
        </p>
      </AdminModal>
    </div>
  );
}
