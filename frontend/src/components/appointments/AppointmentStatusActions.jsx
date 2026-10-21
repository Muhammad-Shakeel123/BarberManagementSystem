function AppointmentStatusActions({
  status,
  onStatusUpdate,
  isUpdatingStatus,
}) {
  if (["completed", "complete", "cancelled", "no_show"].includes(status)) {
    return null;
  }

  const handleUpdate = (newStatus) => {
    onStatusUpdate?.(newStatus);
  };

  return (
    <section className="border-t border-[#485F4D]/60 pt-5">
      <h3 className="mb-3 text-sm font-semibold text-white">
        Appointment Status
      </h3>

      <div className="flex flex-wrap gap-3">
        {status === "booked" && (
          <button
            type="button"
            onClick={() => handleUpdate("confirmed")}
            disabled={isUpdatingStatus}
            className="rounded-xl bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] border border-[#8FA985]/40 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-[#4A6741]/20 transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdatingStatus ? "Updating..." : "Confirm Appointment"}
          </button>
        )}

        {status === "confirmed" && (
          <button
            type="button"
            onClick={() => handleUpdate("in_progress")}
            disabled={isUpdatingStatus}
            className="rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-amber-900/20 transition hover:bg-amber-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdatingStatus ? "Updating..." : "Start Appointment"}
          </button>
        )}

        {status === "in_progress" && (
          <button
            type="button"
            onClick={() => handleUpdate("completed")}
            disabled={isUpdatingStatus}
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-900/20 transition hover:bg-emerald-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdatingStatus ? "Updating..." : "Complete Appointment"}
          </button>
        )}
      </div>
    </section>
  );
}

export default AppointmentStatusActions;
