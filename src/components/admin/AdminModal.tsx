import { X } from "lucide-react";

interface AdminModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  submitting?: boolean;
  submitLabel?: string;
  size?: "md" | "lg" | "xl";
  children: React.ReactNode;
}

export default function AdminModal({
  title,
  isOpen,
  onClose,
  onSubmit,
  submitting = false,
  submitLabel = "Save",
  size = "lg",
  children,
}: AdminModalProps) {
  if (!isOpen) return null;

  const sizeClass =
    size === "xl"
      ? "max-w-4xl"
      : size === "lg"
        ? "max-w-2xl"
        : "max-w-md";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full ${sizeClass} mx-4 bg-[#1e2130] border border-[#2a2d3e] rounded-2xl shadow-2xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2d3e]">
          <h2 className="text-base font-semibold text-[#f1f5f9]">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748b] hover:text-[#f1f5f9] hover:bg-[#252840] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#2a2d3e]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#252840] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="px-5 py-2 bg-[#6c63ff] hover:bg-[#5b52e8] disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            {submitting && (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
