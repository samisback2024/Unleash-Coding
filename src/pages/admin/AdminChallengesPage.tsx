import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  getAllChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  getChallengeDetail,
  getAllLearningPaths,
} from "@/services/admin";
import { AdminTable, AdminModal } from "@/components/admin";

const DIFFICULTIES = ["beginner", "intermediate", "advanced"];
const CHALLENGE_TYPES = [
  "multiple_choice",
  "short_answer",
  "code_reading",
  "debugging",
  "algorithm",
  "scenario",
  "implementation",
];

const EMPTY_FORM = {
  title: "",
  path_id: "",
  description: "",
  difficulty: "beginner",
  challenge_type: "multiple_choice",
  instructions: "",
  starter_code: "",
  options: "",
  expected_answer: "",
  hints: "",
  solution_explanation: "",
  xp_reward: "25",
  order_index: "0",
};
type ChallengeForm = typeof EMPTY_FORM;

function fc() {
  return "w-full bg-[#0f1117] border border-[#2a2d3e] rounded-lg px-3 py-2 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6c63ff]";
}
function lc() { return "block text-xs font-medium text-[#94a3b8] mb-1"; }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildColumns(onEdit: (r: Record<string, any>) => void, onDel: (r: Record<string, any>) => void) {
  return [
    { key: "title", label: "Title", render: (r: Record<string, any>) => <span className="font-medium text-[#f1f5f9]">{r.title}</span> },
    { key: "pathTitle", label: "Path", render: (r: Record<string, any>) => <span className="text-[#94a3b8]">{r.pathTitle}</span> },
    { key: "challenge_type", label: "Type", render: (r: Record<string, any>) => (
      <span className="px-2 py-0.5 bg-[#f59e0b]/20 text-[#f59e0b] rounded text-xs">{r.challenge_type}</span>
    )},
    { key: "difficulty", label: "Difficulty", render: (r: Record<string, any>) => (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
        r.difficulty === "beginner" ? "bg-green-500/20 text-green-400" :
        r.difficulty === "intermediate" ? "bg-yellow-500/20 text-yellow-400" :
        "bg-red-500/20 text-red-400"
      }`}>{r.difficulty}</span>
    )},
    { key: "xp_reward", label: "XP", render: (r: Record<string, any>) => `${r.xp_reward ?? 25} XP` },
    { key: "order_index", label: "Order", render: (r: Record<string, any>) => String(r.order_index ?? 0) },
    { key: "actions", label: "", width: "80px", render: (r: Record<string, any>) => (
      <div className="flex items-center justify-end gap-1">
        <button onClick={() => onEdit(r)} className="p-1.5 rounded text-[#64748b] hover:text-[#6c63ff] hover:bg-[#6c63ff]/10 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
        <button onClick={() => onDel(r)} className="p-1.5 rounded text-[#64748b] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    )},
  ];
}

export default function AdminChallengesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<Record<string, any>[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [paths, setPaths] = useState<Record<string, any>[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ChallengeForm>(EMPTY_FORM);
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
    const [chs, ps] = await Promise.all([getAllChallenges(), getAllLearningPaths()]);
    setItems(chs);
    setPaths(ps);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, path_id: paths[0]?.id ?? "" });
    setIsModalOpen(true);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function openEdit(row: Record<string, any>) {
    setEditingId(row.id);
    const detail = await getChallengeDetail(row.id);
    if (detail) {
      setForm({
        title: detail.title ?? "",
        path_id: detail.path_id ?? "",
        description: detail.description ?? "",
        difficulty: detail.difficulty ?? "beginner",
        challenge_type: detail.challenge_type ?? "multiple_choice",
        instructions: detail.instructions ?? "",
        starter_code: detail.starter_code ?? "",
        options: Array.isArray(detail.options) ? detail.options.join("\n") : (detail.options ?? ""),
        expected_answer: detail.expected_answer ?? "",
        hints: Array.isArray(detail.hints) ? detail.hints.join("\n") : (detail.hints ?? ""),
        solution_explanation: detail.solution_explanation ?? "",
        xp_reward: String(detail.xp_reward ?? 25),
        order_index: String(detail.order_index ?? 0),
      });
    }
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
      options: form.options.split("\n").map((s) => s.trim()).filter(Boolean),
      hints: form.hints.split("\n").map((s) => s.trim()).filter(Boolean),
      xp_reward: parseInt(form.xp_reward, 10) || 25,
      order_index: parseInt(form.order_index, 10) || 0,
    };
    const result = editingId ? await updateChallenge(editingId, payload) : await createChallenge(payload);
    setSaving(false);
    if (result.error) { showToast(result.error, "error"); return; }
    showToast(editingId ? "Challenge updated." : "Challenge created.");
    setIsModalOpen(false);
    load();
  }

  async function handleDelete() {
    if (!deleting) return;
    const result = await deleteChallenge(deleting.id);
    if (result.error) { showToast(result.error, "error"); return; }
    showToast("Challenge deleted.");
    setDeleting(null);
    load();
  }

  function field(key: keyof ChallengeForm) {
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
        <h1 className="text-xl font-bold text-[#f1f5f9]">Challenges</h1>
        <p className="text-sm text-[#64748b] mt-1">Manage coding challenges for each learning path</p>
      </div>

      <AdminTable
        columns={buildColumns(openEdit, (r) => setDeleting(r))}
        data={items}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search challenges…"
        onCreateNew={openCreate}
        createLabel="New Challenge"
        loading={loading}
        emptyMessage="No challenges yet."
      />

      <AdminModal
        title={editingId ? "Edit Challenge" : "Create Challenge"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        submitting={saving}
        submitLabel={editingId ? "Save Changes" : "Create Challenge"}
        size="xl"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={lc()}>Title *</label>
            <input className={fc()} value={form.title} onChange={field("title")} placeholder="FizzBuzz Challenge" />
          </div>
          <div>
            <label className={lc()}>Learning Path *</label>
            <select className={fc()} value={form.path_id} onChange={field("path_id")}>
              <option value="">Select path…</option>
              {paths.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div>
            <label className={lc()}>Type</label>
            <select className={fc()} value={form.challenge_type} onChange={field("challenge_type")}>
              {CHALLENGE_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={lc()}>Difficulty</label>
            <select className={fc()} value={form.difficulty} onChange={field("difficulty")}>
              {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={lc()}>XP Reward</label>
            <input className={fc()} type="number" value={form.xp_reward} onChange={field("xp_reward")} />
          </div>
          <div className="col-span-2">
            <label className={lc()}>Description</label>
            <textarea className={fc()} rows={2} value={form.description} onChange={field("description")} />
          </div>
          <div className="col-span-2">
            <label className={lc()}>Instructions</label>
            <textarea className={fc()} rows={4} value={form.instructions} onChange={field("instructions")} placeholder="Write the full challenge instructions…" />
          </div>
          <div className="col-span-2">
            <label className={lc()}>Starter Code</label>
            <textarea className={fc()} rows={4} value={form.starter_code} onChange={field("starter_code")} placeholder="def solution():&#10;    pass" />
          </div>
          <div className="col-span-2">
            <label className={lc()}>Options (one per line — for multiple choice)</label>
            <textarea className={fc()} rows={4} value={form.options} onChange={field("options")} placeholder="Option A&#10;Option B&#10;Option C&#10;Option D" />
          </div>
          <div className="col-span-2">
            <label className={lc()}>Expected Answer</label>
            <input className={fc()} value={form.expected_answer} onChange={field("expected_answer")} placeholder="The correct answer or answer key" />
          </div>
          <div className="col-span-2">
            <label className={lc()}>Hints (one per line)</label>
            <textarea className={fc()} rows={3} value={form.hints} onChange={field("hints")} placeholder="Think about loops…&#10;Check the range function" />
          </div>
          <div className="col-span-2">
            <label className={lc()}>Solution Explanation</label>
            <textarea className={fc()} rows={3} value={form.solution_explanation} onChange={field("solution_explanation")} />
          </div>
          <div>
            <label className={lc()}>Order</label>
            <input className={fc()} type="number" value={form.order_index} onChange={field("order_index")} />
          </div>
        </div>
      </AdminModal>

      <AdminModal
        title="Delete Challenge"
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onSubmit={handleDelete}
        submitLabel="Delete"
        size="md"
      >
        <p className="text-sm text-[#94a3b8]">
          Delete challenge <span className="font-semibold text-[#f1f5f9]">{deleting?.title}</span>? This cannot be undone.
        </p>
      </AdminModal>
    </div>
  );
}
