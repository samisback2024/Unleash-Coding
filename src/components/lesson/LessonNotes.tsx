import { useState, useEffect, useRef, useCallback } from "react";
import { FileText, Save, Loader2 } from "lucide-react";
import { getLessonNote, saveLessonNote } from "@/services/lesson";

interface LessonNotesProps {
  userId: string;
  lessonId: string;
  onChange?: (hasContent: boolean) => void;
}

export function LessonNotes({ userId, lessonId, onChange }: LessonNotesProps) {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load existing note
  useEffect(() => {
    setLoaded(false);
    setNote("");
    getLessonNote(userId, lessonId).then(({ note: existing }) => {
      setNote(existing);
      setLoaded(true);
      onChange?.(existing.trim().length > 0);
    });
  }, [userId, lessonId, onChange]);

  const save = useCallback(
    async (text: string) => {
      setSaving(true);
      await saveLessonNote(userId, lessonId, text);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
    [userId, lessonId],
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNote(value);
    setSaved(false);
    onChange?.(value.trim().length > 0);

    // Debounced auto-save (1 s)
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => save(value), 1000);
  };

  const handleBlur = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    save(note);
  };

  return (
    <section className="mt-10 border-t border-[#2a2d3e] pt-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-[#6c63ff]" />
        <h2 className="text-base font-bold text-[#f1f5f9]">My Notes</h2>
        <span className="ml-auto text-xs text-[#64748b]">
          {saving ? (
            <span className="flex items-center gap-1 text-[#64748b]">
              <Loader2 className="w-3 h-3 animate-spin" /> Saving…
            </span>
          ) : saved ? (
            <span className="flex items-center gap-1 text-[#10b981]">
              <Save className="w-3 h-3" /> Saved
            </span>
          ) : (
            "Auto-saves while you type"
          )}
        </span>
      </div>

      <textarea
        value={note}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={loaded ? "Write your notes here…" : "Loading…"}
        disabled={!loaded}
        rows={6}
        className="w-full resize-y rounded-xl bg-[#151823] border border-[#2a2d3e]
          text-sm text-[#e2e8f0] placeholder-[#3a3f52] p-4 font-mono leading-relaxed
          focus:outline-none focus:border-[#6c63ff]/60 focus:ring-1 focus:ring-[#6c63ff]/30
          transition-colors disabled:opacity-50"
      />
      <p className="mt-1.5 text-xs text-[#64748b]">
        Notes are saved automatically and private to you.
      </p>
    </section>
  );
}
