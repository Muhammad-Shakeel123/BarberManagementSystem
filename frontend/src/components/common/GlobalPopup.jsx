import {
  AlertCircle,
  CheckCircle2,
  Info,
  XCircle,
  X,
} from "lucide-react";

const icons = {
  error: <XCircle className="size-5 text-rose-500" />,
  success: <CheckCircle2 className="size-5 text-emerald-500" />,
  warning: <AlertCircle className="size-5 text-amber-500" />,
  info: <Info className="size-5 text-indigo-500" />,
};

const borderStyles = {
  error: "border-rose-500/40 bg-[#1E2B3B]/95 text-rose-200 shadow-xl shadow-black/40",
  success: "border-[#485F4D] bg-[#1E2B3B]/95 text-[#CAD5E2] shadow-xl shadow-black/40",
  warning: "border-amber-500/40 bg-[#1E2B3B]/95 text-amber-200 shadow-xl shadow-black/40",
  info: "border-[#8FA985]/40 bg-[#1E2B3B]/95 text-[#CAD5E2] shadow-xl shadow-black/40",
};

export default function GlobalPopup({
  isOpen,
  onClose,
  type = "error",
  title,
  message,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed right-5 top-5 z-[9999] w-full max-w-sm animate-in slide-in-from-top-3 fade-in duration-300">
      <div
        className={`rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${
          borderStyles[type] || borderStyles.error
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#172132] border border-[#485F4D]/60 shadow-xs">
            {icons[type] || icons.error}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              {title ||
                (type === "error"
                  ? "Action Failed"
                  : type === "success"
                    ? "Success"
                    : "Notice")}
            </h3>

            <p className="mt-1 text-xs font-medium leading-relaxed text-[#90A1B9]">
              {message}
            </p>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="shrink-0 rounded-xl p-1 text-[#90A1B9] transition hover:bg-[#1D293D] hover:text-white active:scale-95"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
