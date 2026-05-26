import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// ─── Individual Toast ─────────────────────────────────────────────────────────

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-4 h-4 text-[#22c55e]" />,
  error: <XCircle className="w-4 h-4 text-[#ef4444]" />,
  warning: <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />,
  info: <Info className="w-4 h-4 text-[#6c63ff]" />,
};

const BARS: Record<ToastType, string> = {
  success: "bg-[#22c55e]",
  error: "bg-[#ef4444]",
  warning: "bg-[#f59e0b]",
  info: "bg-[#6c63ff]",
};

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const duration = toast.duration ?? 4000;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // slide in
    const t1 = setTimeout(() => setVisible(true), 10);
    // slide out before removal
    const t2 = setTimeout(() => setVisible(false), duration - 300);
    const t3 = setTimeout(() => onRemove(toast.id), duration);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [toast.id, duration, onRemove]);

  return (
    <div
      className={`relative flex items-start gap-3 bg-[#1e2130] border border-[#2a2d3e] rounded-xl px-4 py-3 shadow-xl max-w-xs w-full overflow-hidden transition-all duration-300 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
      }`}
    >
      <span className="mt-0.5 shrink-0">{ICONS[toast.type]}</span>
      <p className="text-sm text-[#f1f5f9] flex-1 leading-snug">
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-[#64748b] hover:text-[#f1f5f9] transition-colors shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      {/* progress bar */}
      <span
        className={`absolute bottom-0 left-0 h-0.5 ${BARS[toast.type]} animate-toast-progress`}
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback(
    (message: string, type: ToastType = "info", duration = 4000) => {
      const id = String(++idRef.current);
      setToasts((prev) => [...prev.slice(-4), { id, type, message, duration }]);
    },
    [],
  );

  const value: ToastContextValue = {
    toast: add,
    success: (msg) => add(msg, "success"),
    error: (msg) => add(msg, "error"),
    warning: (msg) => add(msg, "warning"),
    info: (msg) => add(msg, "info"),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Portal: fixed bottom-right stack */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
