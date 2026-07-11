import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useToastContext, type ToastType } from "@/contexts/ToastContext";

const ICONS: Record<ToastType, typeof Info> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const STYLES: Record<ToastType, string> = {
  success: "border-emerald-500/30 bg-emerald-950/90 text-emerald-100",
  error: "border-red-500/30 bg-red-950/90 text-red-100",
  info: "border-[#4C8DFF]/30 bg-[#0B1220]/95 text-white",
  warning: "border-amber-500/30 bg-amber-950/90 text-amber-100",
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useToastContext();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type];
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-xl animate-in slide-in-from-right ${STYLES[toast.type]}`}
            role="alert"
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm flex-1 leading-relaxed">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
