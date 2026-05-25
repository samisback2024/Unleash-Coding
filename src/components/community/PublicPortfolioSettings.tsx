import { useState, useEffect } from "react";
import { Globe, GlobeLock, Save, Check } from "lucide-react";
import type { PublicProfile } from "@/types";
import { getMyPublicProfile, upsertPublicProfile } from "@/services/community";

interface Props {
  currentUserId: string;
}

export default function PublicPortfolioSettings({ currentUserId }: Props) {
  const [, setProfile] = useState<PublicProfile | null>(null);
  const [form, setForm] = useState({
    displayName: "",
    bio: "",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    isPublic: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getMyPublicProfile().then((p) => {
      if (p) {
        setProfile(p);
        setForm({
          displayName: p.displayName,
          bio: p.bio,
          githubUrl: p.githubUrl,
          linkedinUrl: p.linkedinUrl,
          portfolioUrl: p.portfolioUrl,
          isPublic: p.isPublic,
        });
      }
    });
  }, [currentUserId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await upsertPublicProfile(form);
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#f1f5f9]">Public Portfolio Settings</h3>
        <button
          onClick={() =>
            setForm((prev) => ({ ...prev, isPublic: !prev.isPublic }))
          }
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all ${
            form.isPublic
              ? "bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]"
              : "bg-[#64748b]/10 border-[#64748b]/30 text-[#64748b]"
          }`}
        >
          {form.isPublic ? (
            <Globe className="w-3.5 h-3.5" />
          ) : (
            <GlobeLock className="w-3.5 h-3.5" />
          )}
          {form.isPublic ? "Public" : "Private"}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#94a3b8] mb-1">Display Name</label>
            <input
              value={form.displayName}
              onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))}
              placeholder="Your name"
              maxLength={60}
              className="w-full bg-[#252840] border border-[#2a2d3e] rounded-lg px-3 py-2 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6c63ff]/50"
            />
          </div>
          <div>
            <label className="block text-xs text-[#94a3b8] mb-1">GitHub URL</label>
            <input
              value={form.githubUrl}
              onChange={(e) => setForm((p) => ({ ...p, githubUrl: e.target.value }))}
              placeholder="https://github.com/you"
              className="w-full bg-[#252840] border border-[#2a2d3e] rounded-lg px-3 py-2 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6c63ff]/50"
            />
          </div>
          <div>
            <label className="block text-xs text-[#94a3b8] mb-1">LinkedIn URL</label>
            <input
              value={form.linkedinUrl}
              onChange={(e) => setForm((p) => ({ ...p, linkedinUrl: e.target.value }))}
              placeholder="https://linkedin.com/in/you"
              className="w-full bg-[#252840] border border-[#2a2d3e] rounded-lg px-3 py-2 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6c63ff]/50"
            />
          </div>
          <div>
            <label className="block text-xs text-[#94a3b8] mb-1">Portfolio URL</label>
            <input
              value={form.portfolioUrl}
              onChange={(e) => setForm((p) => ({ ...p, portfolioUrl: e.target.value }))}
              placeholder="https://yoursite.dev"
              className="w-full bg-[#252840] border border-[#2a2d3e] rounded-lg px-3 py-2 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6c63ff]/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-[#94a3b8] mb-1">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
            placeholder="Tell the community about yourself..."
            rows={3}
            maxLength={300}
            className="w-full bg-[#252840] border border-[#2a2d3e] rounded-lg px-3 py-2 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6c63ff]/50 resize-none"
          />
          <p className="text-xs text-[#64748b] mt-1 text-right">{form.bio.length}/300</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[#6c63ff] hover:bg-[#5b52e8] rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Profile"}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
