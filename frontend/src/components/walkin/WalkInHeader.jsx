import { ArrowLeft, CalendarDays, Sparkles } from "lucide-react";

function WalkInHeader({ onBack, isAdmin }) {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 rounded-xl border border-[#485F4D]/70 bg-[#172132] px-3.5 py-1.5 text-xs font-semibold text-[#CAD5E2] shadow-sm transition hover:border-[#8FA985] hover:bg-[#1D293D] hover:text-white active:scale-95"
      >
        <ArrowLeft className="size-3.5" />
        Back
      </button>

      <div className="flex items-center gap-3.5">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-md shadow-[#4A6741]/25">
          <CalendarDays className="size-6 text-white" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {isAdmin ? "Walk-in Desk" : "Book Your Appointment"}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-[#485F4D] bg-[#172132] px-2.5 py-0.5 text-xs font-bold text-[#8FA985]">
              <Sparkles className="size-3 text-[#8FA985]" />
              Official Portal
            </span>
          </div>

          <p className="mt-0.5 text-xs font-medium text-[#90A1B9] sm:text-sm">
            {isAdmin
              ? "Instantly register walk-in guests or schedule priority queue slots."
              : "Choose your favorite salon branch, barber, and preferred time slot."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default WalkInHeader;