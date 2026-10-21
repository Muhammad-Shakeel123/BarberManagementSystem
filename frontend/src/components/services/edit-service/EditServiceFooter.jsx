import { Power } from "lucide-react";

function EditServiceFooter({
  service,
  loading,
  onClose,
  onDeactivate,
}) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-700/80 bg-[#111b2d] px-6 py-4">
      <div>
        {service.isActive && (
          <button
            type="button"
            onClick={onDeactivate}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/5 px-4 py-2.5 text-sm font-semibold text-rose-400 transition hover:border-rose-500/50 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Power className="size-4" />
            Deactivate
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="rounded-xl border border-slate-600 bg-[#182638] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-[#203147] disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[#769f5b] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#769f5b]/10 transition hover:bg-[#82a967] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Service"}
        </button>
      </div>
    </div>
  );
}

export default EditServiceFooter;