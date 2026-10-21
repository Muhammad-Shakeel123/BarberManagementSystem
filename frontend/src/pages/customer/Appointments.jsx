import { CalendarDays, RefreshCw, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import AppointmentCard from "@/components/appointments/AppointmentCard";
import AppointmentDetailsModal from "@/components/appointments/AppointmentDetailsModal";

import { getMyAppointments } from "@/services/appointment.service";

function CustomerAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadAppointments = useCallback(async ({ refresh = false } = {}) => {
    try {
      setError("");

      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await getMyAppointments();

      setAppointments(response?.data || []);
    } catch (err) {
      console.error("Customer appointments loading error:", err);

      setError(
        err?.response?.data?.message || "Unable to load your appointments.",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadAppointments();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadAppointments]);

  const filteredAppointments = useMemo(() => {
    const now = new Date();

    if (filter === "upcoming") {
      return appointments
        .filter(
          (appointment) =>
            new Date(appointment.startTime) > now &&
            ["booked", "confirmed", "in_progress"].includes(appointment.status),
        )
        .sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        );
    }

    if (filter === "completed") {
      return appointments.filter(
        (appointment) => appointment.status === "completed",
      );
    }

    if (filter === "cancelled") {
      return appointments.filter(
        (appointment) => appointment.status === "cancelled",
      );
    }

    if (filter === "no_show") {
      return appointments.filter(
        (appointment) => appointment.status === "no_show",
      );
    }

    return appointments;
  }, [appointments, filter]);

  const handleAppointmentUpdated = async () => {
    await loadAppointments({ refresh: true });
  };

  const filters = [
    {
      value: "all",
      label: "All",
      count: appointments.length,
    },
    {
      value: "upcoming",
      label: "Upcoming",
      count: appointments.filter(
        (appointment) =>
          new Date(appointment.startTime) > new Date() &&
          ["booked", "confirmed", "in_progress"].includes(appointment.status),
      ).length,
    },
    {
      value: "completed",
      label: "Completed",
      count: appointments.filter(
        (appointment) => appointment.status === "completed",
      ).length,
    },
    {
      value: "cancelled",
      label: "Cancelled",
      count: appointments.filter(
        (appointment) => appointment.status === "cancelled",
      ).length,
    },
    {
      value: "no_show",
      label: "No Show",
      count: appointments.filter(
        (appointment) => appointment.status === "no_show",
      ).length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* =========================================================
          Header
      ========================================================== */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3.5">
          {/* Icon */}
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-lg shadow-[#4A6741]/25">
            <CalendarDays className="size-6" />
          </div>

          {/* Heading */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                My Appointments
              </h1>

              <span className="inline-flex items-center gap-1 rounded-full border border-[#485F4D] bg-[#172132] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8FA985]">
                <Sparkles className="size-3 text-[#8FA985]" />
                Official Bookings
              </span>
            </div>

            <p className="mt-1 text-xs font-medium text-[#90A1B9] sm:text-sm">
              View and manage all of your appointments.
            </p>
          </div>
        </div>

        {/* Refresh */}
        <button
          type="button"
          onClick={() => loadAppointments({ refresh: true })}
          disabled={isRefreshing}
          className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-2xl border border-[#485F4D] bg-[#172132] px-4 text-xs font-bold text-[#CAD5E2] shadow-sm transition hover:border-[#8FA985] hover:bg-[#1D293D] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 lg:self-auto"
        >
          <RefreshCw
            className={`size-4 text-[#8FA985] ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />

          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* =========================================================
          Filter Panel
      ========================================================== */}
      <div className="rounded-3xl border border-[#485F4D] bg-[#1E2B3B] p-2 shadow-xl shadow-black/20">
        <div className="flex flex-wrap items-center gap-1.5">
          {filters.map((item) => {
            const isActive = filter === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all duration-200 sm:text-sm ${
                  isActive
                    ? "bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-lg shadow-[#4A6741]/25 border border-[#8FA985]/40"
                    : "text-[#90A1B9] hover:bg-[#172132] hover:text-white"
                }`}
              >
                <span>{item.label}</span>

                <span
                  className={`min-w-6 rounded-full px-1.5 py-0.5 text-center text-[10px] font-extrabold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#172132] text-[#90A1B9]"
                  }`}
                >
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          Error
      ========================================================== */}
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3.5 text-sm font-medium text-red-300">
          {error}
        </div>
      )}

      {/* =========================================================
          Loading
      ========================================================== */}
      {isLoading ? (
        <div className="flex min-h-72 items-center justify-center rounded-3xl border border-[#485F4D] bg-[#1E2B3B]">
          <div className="text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-2xl border border-[#485F4D] bg-[#172132]">
              <RefreshCw className="size-5 animate-spin text-[#8FA985]" />
            </div>

            <p className="mt-4 text-sm font-semibold text-white">
              Loading appointments...
            </p>

            <p className="mt-1 text-xs text-[#90A1B9]">
              Please wait while we fetch your bookings.
            </p>
          </div>
        </div>
      ) : filteredAppointments.length === 0 ? (
        /* =========================================================
           Empty State
        ========================================================== */
        <div className="rounded-3xl border border-dashed border-[#485F4D] bg-[#172132]/60 px-6 py-16 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#485F4D] bg-[#172132]">
            <CalendarDays className="size-6 text-[#8FA985]" />
          </div>

          <h2 className="mt-5 text-base font-bold text-white">
            No appointments found
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#90A1B9]">
            You don't have any appointments in this category yet.
          </p>

          {filter !== "all" && (
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="mt-5 rounded-full bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] border border-[#8FA985]/40 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#4A6741]/20 transition hover:brightness-110 active:scale-95"
            >
              View All Appointments
            </button>
          )}
        </div>
      ) : (
        /* =========================================================
           Appointment Cards
        ========================================================== */
        <div>
          {/* Section Heading */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                {filter === "all"
                  ? "All Appointments"
                  : `${filters.find((item) => item.value === filter)?.label} Appointments`}
              </h2>

              <p className="mt-1 text-xs text-[#90A1B9]">
                {filteredAppointments.length}{" "}
                {filteredAppointments.length === 1
                  ? "appointment"
                  : "appointments"}{" "}
                found
              </p>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <span className="size-2 rounded-full bg-[#8FA985]" />

              <span className="text-xs font-medium text-[#90A1B9]">
                Your bookings
              </span>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                isCustomer
                onClick={() => setSelectedAppointment(appointment)}
              />
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          Appointment Details
      ========================================================== */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        isCustomer={true}
        onCancelled={handleAppointmentUpdated}
        onRescheduled={handleAppointmentUpdated}
        onUpdated={handleAppointmentUpdated}
      />
    </div>
  );
}

export default CustomerAppointments;
