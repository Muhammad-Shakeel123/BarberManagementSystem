import { useState } from "react";
import { cancelAppointment } from "@/services/appointment.service";

function AppointmentCancel({ appointment, onCancelled }) {
  const [isCancelling, setIsCancelling] = useState(false);

  const canCancel = ["booked", "confirmed"].includes(appointment?.status);

  if (!canCancel) {
    return null;
  }

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmed) return;

    try {
      setIsCancelling(true);

      await cancelAppointment(appointment._id);

      onCancelled?.();
    } catch (error) {
      console.error("Cancel appointment error:", error);

      alert(
        error?.response?.data?.message ||
          "Unable to cancel appointment. Please try again.",
      );
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="flex justify-end border-t border-[#485F4D]/60 pt-5">
      <button
        type="button"
        onClick={handleCancel}
        disabled={isCancelling}
        className="rounded-xl border border-rose-500/40 bg-rose-600/90 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-900/20 transition hover:bg-rose-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isCancelling ? "Cancelling..." : "Cancel Appointment"}
      </button>
    </div>
  );
}

export default AppointmentCancel;
