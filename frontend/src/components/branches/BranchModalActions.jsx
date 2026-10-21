import { Check, Loader2 } from "lucide-react";

function BranchModalActions({ onClose, loading }) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-slate-700/80 pt-6 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="h-11 rounded-xl border border-slate-700 bg-slate-800 px-5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Creating Branch...
          </>
        ) : (
          <>
            <Check className="size-4" />
            Create Branch
          </>
        )}
      </button>
    </div>
  );
}

export default BranchModalActions;