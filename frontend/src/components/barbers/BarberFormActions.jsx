import { Check, Loader2 } from "lucide-react";

function BarberFormActions({ isEditMode, loading }) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-gradient-to-b from-[#6B8C5E] to-[#4A6741] px-5 text-xs font-bold text-white shadow-lg shadow-[#4A6741]/20 transition hover:from-[#78996A] hover:to-[#58784E] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {isEditMode ? "Updating..." : "Creating..."}
          </>
        ) : (
          <>
            <Check className="size-4" />
            {isEditMode ? "Update Barber" : "Create Barber"}
          </>
        )}
      </button>
    </div>
  );
}

export default BarberFormActions;