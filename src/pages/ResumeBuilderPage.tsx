import { useState, useRef, useEffect, useCallback } from "react";
import { Download, Save, Plus, Trash2 } from "lucide-react";
import { ResumePreview } from "@/components/resume";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  getResumeProfile,
  saveResumeProfile,
  defaultResumeData,
  type ResumeData,
  type ResumeTemplate,
  type ResumeExperience,
  type ResumeEducation,
  type ResumeProject,
  type ResumeCertification,
} from "@/services/resume";

const TEMPLATES: { id: ResumeTemplate; label: string; desc: string }[] = [
  { id: "modern", label: "Modern", desc: "Colored header, left accent bars" },
  { id: "minimal", label: "Minimal", desc: "Clean lines, light typography" },
  { id: "classic", label: "Classic", desc: "Dark header, traditional layout" },
];

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function SkillsInput({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const add = () => {
    const t = input.trim();
    if (!t || items.includes(t)) return;
    onChange([...items, t]);
    setInput("");
  };
  return (
    <div className="space-y-2">
      <label className="text-xs text-[#94a3b8] font-medium">{label}</label>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={`Add ${label.toLowerCase()}…`}
          className="flex-1 px-3 py-1.5 rounded-lg bg-[#0f1117] border border-[#2a2d3e] text-[#f1f5f9] text-sm outline-none focus:border-[#6c63ff]"
        />
        <button
          onClick={add}
          className="px-3 py-1.5 rounded-lg bg-[#252840] text-[#94a3b8] hover:text-white text-sm"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#6c63ff]/20 text-[#6c63ff] text-xs font-medium"
          >
            {item}
            <button
              onClick={() => onChange(items.filter((i) => i !== item))}
              className="hover:text-white"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-[#94a3b8] font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg bg-[#0f1117] border border-[#2a2d3e] text-[#f1f5f9] text-sm outline-none focus:border-[#6c63ff] placeholder:text-[#64748b]"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-[#94a3b8] font-medium">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-[#0f1117] border border-[#2a2d3e] text-[#f1f5f9] text-sm outline-none focus:border-[#6c63ff] resize-none"
      />
    </div>
  );
}

export default function ResumeBuilderPage() {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [template, setTemplate] = useState<ResumeTemplate>("modern");
  const [data, setData] = useState<ResumeData>(() => {
    try {
      const cached = localStorage.getItem("resume-draft");
      return cached ? JSON.parse(cached) : defaultResumeData;
    } catch {
      return defaultResumeData;
    }
  });
  const [activeSection, setActiveSection] = useState("personal");
  const [saving, setSaving] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Persist draft in localStorage
  useEffect(() => {
    localStorage.setItem("resume-draft", JSON.stringify(data));
  }, [data]);

  // Load from Supabase on mount
  useEffect(() => {
    if (!user) return;
    getResumeProfile(user.id)
      .then((result) => {
        if (result) {
          setData(result.data);
          setTemplate(result.template);
        }
      })
      .catch(() => {});
  }, [user]);

  const setP = (field: keyof ResumeData["personalInfo"], val: string) =>
    setData((d) => ({
      ...d,
      personalInfo: { ...d.personalInfo, [field]: val },
    }));

  const setSkill = (cat: keyof ResumeData["skills"], items: string[]) =>
    setData((d) => ({ ...d, skills: { ...d.skills, [cat]: items } }));

  // ── Experience ──
  const addExp = () =>
    setData((d) => ({
      ...d,
      experience: [
        ...d.experience,
        {
          id: uid(),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          current: false,
          bullets: [""],
        },
      ],
    }));
  const updateExp = (id: string, patch: Partial<ResumeExperience>) =>
    setData((d) => ({
      ...d,
      experience: d.experience.map((e) =>
        e.id === id ? { ...e, ...patch } : e,
      ),
    }));
  const removeExp = (id: string) =>
    setData((d) => ({
      ...d,
      experience: d.experience.filter((e) => e.id !== id),
    }));

  // ── Education ──
  const addEdu = () =>
    setData((d) => ({
      ...d,
      education: [
        ...d.education,
        {
          id: uid(),
          school: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          gpa: "",
        },
      ],
    }));
  const updateEdu = (id: string, patch: Partial<ResumeEducation>) =>
    setData((d) => ({
      ...d,
      education: d.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  const removeEdu = (id: string) =>
    setData((d) => ({
      ...d,
      education: d.education.filter((e) => e.id !== id),
    }));

  // ── Projects ──
  const addProj = () =>
    setData((d) => ({
      ...d,
      projects: [
        ...d.projects,
        { id: uid(), name: "", description: "", technologies: [], link: "" },
      ],
    }));
  const updateProj = (id: string, patch: Partial<ResumeProject>) =>
    setData((d) => ({
      ...d,
      projects: d.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  const removeProj = (id: string) =>
    setData((d) => ({ ...d, projects: d.projects.filter((p) => p.id !== id) }));

  // ── Certifications ──
  const addCert = () =>
    setData((d) => ({
      ...d,
      certifications: [
        ...d.certifications,
        { id: uid(), name: "", issuer: "", date: "", link: "" },
      ],
    }));
  const updateCert = (id: string, patch: Partial<ResumeCertification>) =>
    setData((d) => ({
      ...d,
      certifications: d.certifications.map((c) =>
        c.id === id ? { ...c, ...patch } : c,
      ),
    }));
  const removeCert = (id: string) =>
    setData((d) => ({
      ...d,
      certifications: d.certifications.filter((c) => c.id !== id),
    }));

  // ── Save ──
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await saveResumeProfile(user.id, data, template);
      success("Resume saved");
    } catch {
      toastError("Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  // ── Export PDF ──
  const handleExport = useCallback(async () => {
    const el = previewRef.current;
    if (!el) return;
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const pdf = new jsPDF({
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2],
      });
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        canvas.width / 2,
        canvas.height / 2,
      );
      pdf.save(`${data.personalInfo.name || "resume"}.pdf`);
      success("PDF downloaded");
    } catch {
      toastError("Export failed");
    }
  }, [data.personalInfo.name, success, toastError]);

  const sections = [
    { id: "personal", label: "Personal Info" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "certifications", label: "Certifications" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0f1117]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#2a2d3e] shrink-0">
        <h1 className="text-lg font-bold text-[#f1f5f9]">Resume Builder</h1>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e2130] border border-[#2a2d3e] text-[#94a3b8] hover:text-white text-sm transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-sm font-semibold transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Form panel */}
        <div className="w-[420px] shrink-0 flex flex-col border-r border-[#2a2d3e] overflow-hidden">
          {/* Template selector */}
          <div className="px-4 py-3 border-b border-[#2a2d3e]">
            <p className="text-xs text-[#94a3b8] font-medium mb-2">Template</p>
            <div className="flex gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    template === t.id
                      ? "bg-[#6c63ff] text-white"
                      : "bg-[#1e2130] text-[#94a3b8] border border-[#2a2d3e] hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section nav */}
          <div className="flex overflow-x-auto border-b border-[#2a2d3e] px-2 py-1 gap-0.5 shrink-0">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  activeSection === s.id
                    ? "bg-[#6c63ff]/20 text-[#6c63ff]"
                    : "text-[#64748b] hover:text-[#94a3b8]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Form body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Personal Info */}
            {activeSection === "personal" && (
              <>
                <Input
                  label="Full Name"
                  value={data.personalInfo.name}
                  onChange={(v) => setP("name", v)}
                  placeholder="Jane Doe"
                />
                <Input
                  label="Email"
                  value={data.personalInfo.email}
                  onChange={(v) => setP("email", v)}
                  placeholder="jane@example.com"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Phone"
                    value={data.personalInfo.phone}
                    onChange={(v) => setP("phone", v)}
                    placeholder="+1 555-0100"
                  />
                  <Input
                    label="Location"
                    value={data.personalInfo.location}
                    onChange={(v) => setP("location", v)}
                    placeholder="City, State"
                  />
                </div>
                <Input
                  label="LinkedIn"
                  value={data.personalInfo.linkedin}
                  onChange={(v) => setP("linkedin", v)}
                  placeholder="linkedin.com/in/janedoe"
                />
                <Input
                  label="GitHub"
                  value={data.personalInfo.github}
                  onChange={(v) => setP("github", v)}
                  placeholder="github.com/janedoe"
                />
                <Input
                  label="Website"
                  value={data.personalInfo.website}
                  onChange={(v) => setP("website", v)}
                  placeholder="janedoe.dev"
                />
                <Textarea
                  label="Summary"
                  rows={4}
                  value={data.personalInfo.summary}
                  onChange={(v) => setP("summary", v)}
                />
              </>
            )}

            {/* Experience */}
            {activeSection === "experience" && (
              <>
                {data.experience.map((e) => (
                  <div
                    key={e.id}
                    className="bg-[#1a1d27] rounded-xl border border-[#2a2d3e] p-4 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-[#6c63ff]">
                        {e.company || "New Experience"}
                      </span>
                      <button
                        onClick={() => removeExp(e.id)}
                        className="text-[#64748b] hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <Input
                      label="Position"
                      value={e.position}
                      onChange={(v) => updateExp(e.id, { position: v })}
                      placeholder="Software Engineer"
                    />
                    <Input
                      label="Company"
                      value={e.company}
                      onChange={(v) => updateExp(e.id, { company: v })}
                      placeholder="Acme Corp"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Start Date"
                        value={e.startDate}
                        onChange={(v) => updateExp(e.id, { startDate: v })}
                        placeholder="Jan 2022"
                      />
                      <Input
                        label="End Date"
                        value={e.endDate}
                        onChange={(v) => updateExp(e.id, { endDate: v })}
                        placeholder="Present"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-[#94a3b8] font-medium">
                        Bullets (one per line)
                      </label>
                      <textarea
                        rows={3}
                        value={e.bullets.join("\n")}
                        onChange={(ev) =>
                          updateExp(e.id, {
                            bullets: ev.target.value.split("\n"),
                          })
                        }
                        placeholder="• Built feature X, reducing load time by 30%"
                        className="w-full px-3 py-2 rounded-lg bg-[#0f1117] border border-[#2a2d3e] text-[#f1f5f9] text-sm outline-none focus:border-[#6c63ff] resize-none"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={addExp}
                  className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#2a2d3e] text-[#64748b] hover:border-[#6c63ff] hover:text-[#6c63ff] text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Experience
                </button>
              </>
            )}

            {/* Education */}
            {activeSection === "education" && (
              <>
                {data.education.map((e) => (
                  <div
                    key={e.id}
                    className="bg-[#1a1d27] rounded-xl border border-[#2a2d3e] p-4 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-[#6c63ff]">
                        {e.school || "New Education"}
                      </span>
                      <button
                        onClick={() => removeEdu(e.id)}
                        className="text-[#64748b] hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <Input
                      label="School"
                      value={e.school}
                      onChange={(v) => updateEdu(e.id, { school: v })}
                      placeholder="MIT"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Degree"
                        value={e.degree}
                        onChange={(v) => updateEdu(e.id, { degree: v })}
                        placeholder="B.S."
                      />
                      <Input
                        label="Field"
                        value={e.field}
                        onChange={(v) => updateEdu(e.id, { field: v })}
                        placeholder="Computer Science"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <Input
                        label="Start"
                        value={e.startDate}
                        onChange={(v) => updateEdu(e.id, { startDate: v })}
                        placeholder="2018"
                      />
                      <Input
                        label="End"
                        value={e.endDate}
                        onChange={(v) => updateEdu(e.id, { endDate: v })}
                        placeholder="2022"
                      />
                      <Input
                        label="GPA"
                        value={e.gpa}
                        onChange={(v) => updateEdu(e.id, { gpa: v })}
                        placeholder="3.9"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={addEdu}
                  className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#2a2d3e] text-[#64748b] hover:border-[#6c63ff] hover:text-[#6c63ff] text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Education
                </button>
              </>
            )}

            {/* Skills */}
            {activeSection === "skills" && (
              <>
                <SkillsInput
                  label="Technical Skills"
                  items={data.skills.technical}
                  onChange={(v) => setSkill("technical", v)}
                />
                <SkillsInput
                  label="Programming Languages"
                  items={data.skills.languages}
                  onChange={(v) => setSkill("languages", v)}
                />
                <SkillsInput
                  label="Tools & Frameworks"
                  items={data.skills.tools}
                  onChange={(v) => setSkill("tools", v)}
                />
                <SkillsInput
                  label="Soft Skills"
                  items={data.skills.soft}
                  onChange={(v) => setSkill("soft", v)}
                />
              </>
            )}

            {/* Projects */}
            {activeSection === "projects" && (
              <>
                {data.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-[#1a1d27] rounded-xl border border-[#2a2d3e] p-4 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-[#6c63ff]">
                        {proj.name || "New Project"}
                      </span>
                      <button
                        onClick={() => removeProj(proj.id)}
                        className="text-[#64748b] hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <Input
                      label="Project Name"
                      value={proj.name}
                      onChange={(v) => updateProj(proj.id, { name: v })}
                      placeholder="Portfolio Website"
                    />
                    <Textarea
                      label="Description"
                      rows={2}
                      value={proj.description}
                      onChange={(v) => updateProj(proj.id, { description: v })}
                    />
                    <Input
                      label="Link"
                      value={proj.link}
                      onChange={(v) => updateProj(proj.id, { link: v })}
                      placeholder="github.com/you/project"
                    />
                    <SkillsInput
                      label="Technologies"
                      items={proj.technologies}
                      onChange={(v) => updateProj(proj.id, { technologies: v })}
                    />
                  </div>
                ))}
                <button
                  onClick={addProj}
                  className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#2a2d3e] text-[#64748b] hover:border-[#6c63ff] hover:text-[#6c63ff] text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </>
            )}

            {/* Certifications */}
            {activeSection === "certifications" && (
              <>
                {data.certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-[#1a1d27] rounded-xl border border-[#2a2d3e] p-4 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-[#6c63ff]">
                        {cert.name || "New Certification"}
                      </span>
                      <button
                        onClick={() => removeCert(cert.id)}
                        className="text-[#64748b] hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <Input
                      label="Name"
                      value={cert.name}
                      onChange={(v) => updateCert(cert.id, { name: v })}
                      placeholder="AWS Solutions Architect"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Issuer"
                        value={cert.issuer}
                        onChange={(v) => updateCert(cert.id, { issuer: v })}
                        placeholder="Amazon"
                      />
                      <Input
                        label="Date"
                        value={cert.date}
                        onChange={(v) => updateCert(cert.id, { date: v })}
                        placeholder="2024"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={addCert}
                  className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#2a2d3e] text-[#64748b] hover:border-[#6c63ff] hover:text-[#6c63ff] text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Certification
                </button>
              </>
            )}
          </div>
        </div>

        {/* Preview panel */}
        <div className="flex-1 overflow-auto bg-[#252840] p-6">
          <div
            className="origin-top-left shadow-2xl inline-block"
            style={{ transform: "scale(0.85)", transformOrigin: "top center" }}
          >
            <ResumePreview ref={previewRef} data={data} template={template} />
          </div>
        </div>
      </div>
    </div>
  );
}
