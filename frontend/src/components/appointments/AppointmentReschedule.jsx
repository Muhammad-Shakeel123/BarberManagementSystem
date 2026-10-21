import { useState } from "react";
import { rescheduleAppointment } from "@/services/appointment.service";

function AppointmentReschedule({ appointment, onRescheduled }) {
  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [reason, setReason] = useState("");
  const [isRescheduling, setIsRescheduling] = useState(false);

  const canReschedule = ["booked", "confirmed"].includes(appointment?.status);

  if (!canReschedule) {
    return null;
  }

  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      alert("Please select new date and time.");
      return;
    }

    try {
      setIsRescheduling(true);

      const newStartTime = new Date(`${newDate}T${newTime}`).toISOString();

      await rescheduleAppointment(appointment._id, newStartTime, reason);

      onRescheduled?.();
    } catch (error) {
      console.error("Reschedule appointment error:", error);

      alert(
        error?.response?.data?.message ||
          "Unable to reschedule appointment. Please try again.",
      );
    } finally {
      setIsRescheduling(false);
    }
  };

  return (
    <section className="border-t border-[#485F4D]/60 pt-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Reschedule Appointment
          </h3>

          <p className="mt-1 text-xs text-[#90A1B9]">
            Select a new date and time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowReschedule((prev) => !prev)}
          disabled={isRescheduling}
          className="rounded-xl border border-[#485F4D] bg-[#172132] px-4 py-2 text-xs font-semibold text-[#CAD5E2] transition hover:border-[#8FA985] hover:bg-[#1D293D] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {showReschedule ? "Close" : "Reschedule"}
        </button>
      </div>

      {showReschedule && (
        <div className="mt-4 space-y-4 rounded-2xl border border-[#485F4D]/70 bg-[#172132] p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-[#CAD5E2]">
                New Date
              </label>

              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                disabled={isRescheduling}
                className="mt-1 w-full rounded-xl border border-[#485F4D] bg-[#1E2B3B] px-3.5 py-2 text-sm text-white outline-none focus:border-[#8FA985]"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#CAD5E2]">
                New Time
              </label>

              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                disabled={isRescheduling}
                className="mt-1 w-full rounded-xl border border-[#485F4D] bg-[#1E2B3B] px-3.5 py-2 text-sm text-white outline-none focus:border-[#8FA985]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#CAD5E2]">Reason</label>

            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isRescheduling}
              placeholder="Optional reason"
              className="mt-1 w-full rounded-xl border border-[#485F4D] bg-[#1E2B3B] px-3.5 py-2 text-sm text-white outline-none placeholder:text-[#90A1B9] focus:border-[#8FA985]"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleReschedule}
              disabled={isRescheduling}
              className="rounded-xl bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] border border-[#8FA985]/40 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#4A6741]/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRescheduling ? "Rescheduling..." : "Confirm Reschedule"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default AppointmentReschedule;
