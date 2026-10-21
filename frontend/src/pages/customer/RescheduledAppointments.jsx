import { useCallback, useEffect, useState } from "react";
import { CalendarClock, RefreshCw } from "lucide-react";

import { getMyAppointments } from "@/services/appointment.service";

function RescheduledAppointments() {
  const [appointments, setAppointments] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadRescheduledAppointments = useCallback(
    async ({ refresh = false } = {}) => {
      try {
        setError("");

        if (refresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        const response = await getMyAppointments();

        const allAppointments = response?.data || [];

        const rescheduled = allAppointments.filter(
          (appointment) => appointment.rescheduleHistory?.length > 0,
        );

        setAppointments(rescheduled);
      } catch (err) {
        console.error("Customer rescheduled appointments loading error:", err);

        setError(
          err?.response?.data?.message ||
            "Unable to load rescheduled appointments.",
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadRescheduledAppointments();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadRescheduledAppointments]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <CalendarClock className="size-5 text-[#8FA985]" />

            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Rescheduled Appointments
            </h1>
          </div>

          <p className="mt-1 text-sm text-[#90A1B9]">
            View your appointments that have been rescheduled and their history.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadRescheduledAppointments({ refresh: true })}
          disabled={isRefreshing}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#485F4D] bg-[#172132] px-4 text-xs font-semibold text-[#CAD5E2] shadow-sm transition hover:border-[#8FA985] hover:bg-[#1D293D] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`size-3.5 text-[#8FA985] ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex min-h-60 items-center justify-center rounded-2xl border border-[#485F4D] bg-[#1E2B3B]">
          <div className="text-center">
            <div className="mx-auto size-6 animate-spin rounded-full border-2 border-[#485F4D] border-t-[#8FA985]" />

            <p className="mt-3 text-sm text-[#90A1B9]">
              Loading rescheduled appointments...
            </p>
          </div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#485F4D] bg-[#172132]/60 px-6 py-16 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-[#485F4D] bg-[#172132]">
            <CalendarClock className="size-5 text-[#8FA985]" />
          </div>

          <h2 className="mt-4 text-sm font-semibold text-white">
            No rescheduled appointments
          </h2>

          <p className="mt-1 text-sm text-[#90A1B9]">
            You don't have any rescheduled appointments yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {appointments.map((appointment) => {
            const history = appointment.rescheduleHistory || [];
            const latest = history[history.length - 1];

            return (
              <div
                key={appointment._id}
                className="rounded-3xl border border-[#485F4D] bg-[#1E2B3B] p-5 shadow-xl shadow-black/20"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#90A1B9]">Appointment</p>

                    <h2 className="mt-1 font-bold text-white">
                      Rescheduled Appointment
                    </h2>
                  </div>

                  <span className="rounded-full border border-amber-500/30 bg-amber-950/40 px-3 py-1 text-xs font-semibold text-amber-300">
                    Rescheduled
                  </span>
                </div>

                {/* Appointment Info */}
                <div className="mt-4 space-y-2 text-sm">
                  <p className="text-[#90A1B9]">
                    Branch:{" "}
                    <span className="font-semibold text-white">
                      {appointment.branchId?.name || "-"}
                    </span>
                  </p>

                  <p className="text-[#90A1B9]">
                    Barber:{" "}
                    <span className="font-semibold text-white">
                      {appointment.barberId?.name ||
                        appointment.barberId?.userId?.name ||
                        "Assigned barber"}
                    </span>
                  </p>
                </div>

                {/* Services */}
                <div className="mt-4">
                  <p className="text-xs text-[#90A1B9]">Services</p>

                  <p className="mt-1 text-sm font-semibold text-[#8FA985]">
                    {appointment.serviceIds
                      ?.map((service) => service.name)
                      .join(", ") || "-"}
                  </p>
                </div>

                {/* Previous → New */}
                {latest && (
                  <div className="mt-5 rounded-2xl border border-[#485F4D]/60 bg-[#172132] p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#8FA985]">
                      Reschedule Details
                    </p>

                    <div className="mt-3 space-y-3">
                      <div>
                        <p className="text-xs text-[#90A1B9]">Previous Time</p>

                        <p className="mt-1 text-sm font-medium text-[#CAD5E2]">
                          {new Date(latest.from).toLocaleString("en-PK")}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#90A1B9]">New Time</p>

                        <p className="mt-1 text-sm font-bold text-white">
                          {new Date(latest.to).toLocaleString("en-PK")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reason */}
                {latest?.reason && (
                  <div className="mt-4">
                    <p className="text-xs text-[#90A1B9]">Reason</p>

                    <p className="mt-1 text-sm text-[#CAD5E2]">
                      {latest.reason}
                    </p>
                  </div>
                )}

                {/* Payment */}
                <div className="mt-4 flex items-center justify-between border-t border-[#485F4D]/50 pt-4">
                  <div>
                    <p className="text-xs text-[#90A1B9]">Total Amount</p>

                    <p className="text-sm font-bold text-white">
                      Rs. {appointment.totalAmount ?? 0}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-[#90A1B9]">Deposit</p>

                    <p className="text-sm font-semibold text-[#8FA985]">
                      Rs. {appointment.depositPaid ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RescheduledAppointments;
