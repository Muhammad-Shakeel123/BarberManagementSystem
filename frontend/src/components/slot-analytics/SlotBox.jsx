function SlotBox({ slot }) {
  const isBooked = slot.status === "booked";

  return (
    <div
      title={
        isBooked
          ? `${slot.label} — Booked`
          : `${slot.label} — Available`
      }
      className={`group cursor-pointer rounded-xl border p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-lg ${
        isBooked
          ? "border-[#65434a] bg-[#30252d] hover:border-[#80505a]"
          : "border-[#405b47] bg-[#203328] hover:border-[#59785e]"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-100">
          {slot.label}
        </span>

        <span
          className={`size-2 rounded-full ${
            isBooked ? "bg-[#c86b72]" : "bg-[#78ad58]"
          }`}
        />
      </div>

      <p
        className={`mt-1 text-xs font-semibold ${
          isBooked ? "text-[#d17b82]" : "text-[#91bd73]"
        }`}
      >
        {isBooked ? "Booked" : "Available"}
      </p>
    </div>
  );
}

export default SlotBox;