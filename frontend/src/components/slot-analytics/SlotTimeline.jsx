import SlotBox from "./SlotBox";

function SlotTimeline({ slots }) {
  return (
    <div className="mt-7">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">
            Today's Slot Timeline
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Visual overview of branch slots.
          </p>
        </div>

        <div className="hidden items-center gap-4 text-xs sm:flex">
          <Legend
            label="Available"
            className="bg-[#78ad58]"
          />

          <Legend
            label="Booked"
            className="bg-[#c86b72]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-11">
        {slots.map((slot) => (
          <SlotBox
            key={`${slot.start}-${slot.end}`}
            slot={slot}
          />
        ))}
      </div>
    </div>
  );
}

function Legend({ label, className }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`size-2 rounded-full ${className}`} />

      <span className="text-slate-400">
        {label}
      </span>
    </div>
  );
}

export default SlotTimeline;