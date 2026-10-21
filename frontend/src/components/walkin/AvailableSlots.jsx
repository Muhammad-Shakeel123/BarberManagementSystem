import {
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

function AvailableSlots({
  slots,
  selectedSlot,
  onSelectSlot,
  onBook,
  onAddToQueue,
  booking,
  formatTime,
  isAdmin = false,
}) {
  if (!slots || slots.length === 0) {
    return null;
  }

  const openSlots = slots.filter((slot) => slot.available).length;

  return (
    <section className="rounded-3xl border border-[#485F4D] bg-[#1E2B3B] p-6 shadow-xl sm:p-7">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-xl bg-[#4A6741]/25 text-[#8FA985]">
              <Clock className="size-4" />
            </span>

            <h2 className="text-lg font-bold text-white">
              Available Time Slots
            </h2>
          </div>

          <p className="mt-1 text-xs font-medium text-[#90A1B9]">
            Pick your preferred appointment start time.
          </p>
        </div>

        <span className="w-fit rounded-full border border-[#485F4D] bg-[#172132] px-3 py-1 text-xs font-bold text-[#8FA985]">
          {openSlots} Open Slots
        </span>
      </div>

      {/* Slots */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {slots.map((slot) => {
          const isSelected = selectedSlot?.start === slot.start;

          return (
            <button
              key={`${slot.start}-${slot.end}`}
              type="button"
              disabled={!slot.available}
              onClick={() => onSelectSlot(slot)}
              className={`group relative rounded-2xl border p-4 text-left transition-all duration-200 active:scale-[0.97] ${
                !slot.available
                  ? "cursor-not-allowed border-[#485F4D]/30 bg-[#172132]/50 opacity-40"
                  : isSelected
                    ? "border-[#8FA985] bg-gradient-to-br from-[#4A6741] to-[#1D293D] text-white shadow-lg shadow-[#4A6741]/20 ring-2 ring-[#8FA985]/20"
                    : "border-[#485F4D]/70 bg-[#172132] hover:-translate-y-0.5 hover:border-[#8FA985] hover:bg-[#1D293D] hover:shadow-lg"
              }`}
            >
              <div className="flex items-center justify-between">
                <p
                  className={`text-sm font-extrabold tracking-tight ${
                    isSelected ? "text-white" : "text-[#CAD5E2]"
                  }`}
                >
                  {formatTime(slot.start)} - {formatTime(slot.end)}
                </p>

                {isSelected && (
                  <CheckCircle2 className="size-4 text-[#8FA985]" />
                )}
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span
                  className={`text-xs font-medium ${
                    isSelected ? "text-[#CAD5E2]" : "text-[#64748B]"
                  }`}
                >
                  ⏱ {slot.duration} mins
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isSelected
                      ? "bg-white/15 text-white"
                      : slot.available
                        ? "border border-emerald-500/20 bg-emerald-950/40 text-emerald-300"
                        : "border border-rose-500/20 bg-rose-950/30 text-rose-300"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      isSelected
                        ? "bg-[#8FA985]"
                        : slot.available
                          ? "bg-emerald-400"
                          : "bg-rose-400"
                    }`}
                  />

                  {isSelected
                    ? "Selected"
                    : slot.available
                      ? "Open"
                      : "Booked"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Slot */}
      {selectedSlot && (
        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#485F4D] bg-gradient-to-r from-[#172132] via-[#1D293D] to-[#24332F] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8FA985]">
              <Sparkles className="size-3" />
              Selected Time Window
            </div>

            <p className="mt-1 text-base font-black text-white">
              {formatTime(selectedSlot.start)} –{" "}
              {formatTime(selectedSlot.end)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onBook}
              disabled={booking}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4A6741] to-[#6B8C5E] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#4A6741]/20 transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
            >
              <CheckCircle2 className="size-4" />

              {booking
                ? "Processing Booking..."
                : isAdmin
                  ? "Confirm Walk-in Appointment"
                  : "Confirm & Book Visit"}
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={onAddToQueue}
                disabled={booking}
                className="inline-flex items-center justify-center rounded-xl border border-[#485F4D] bg-[#172132] px-5 py-2.5 text-xs font-bold text-[#CAD5E2] transition hover:border-[#8FA985] hover:bg-[#1D293D] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
              >
                {booking ? "Please wait..." : "Add to Waiting Queue"}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default AvailableSlots;