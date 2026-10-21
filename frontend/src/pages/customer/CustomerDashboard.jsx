import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  MapPin,
  Scissors,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import AppointmentDetailsModal from "@/components/appointments/AppointmentDetailsModal";
import { getMyAppointments } from "@/services/appointment.service";
import { useAuth } from "@/hooks/useAuth";

function CustomerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadAppointments = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getMyAppointments();

        if (isMounted) {
          setAppointments(response?.data || []);
        }
      } catch (err) {
        console.error("Customer appointments loading error:", err);

        if (isMounted) {
          setError(
            err?.response?.data?.message || "Unable to load your appointments.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAppointments();

    return () => {
      isMounted = false;
    };
  }, []);

  const now = new Date();

  const upcomingAppointments = useMemo(() => {
    return appointments
      .filter(
        (appointment) =>
          new Date(appointment.startTime) > now &&
          ["booked", "confirmed", "in_progress"].includes(appointment.status),
      )
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [appointments]);

  const upcomingAppointment = upcomingAppointments[0] || null;

  const completedCount = appointments.filter(
    (appointment) =>
      appointment.status === "completed" || appointment.status === "complete",
  ).length;

  const cancelledCount = appointments.filter(
    (appointment) => appointment.status === "cancelled",
  ).length;

  const formatDate = (value) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  };

  const formatShortDate = (value) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  };

  const formatTime = (value) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(value));
  };

  const getStatusLabel = (status) => {
    if (!status) return "Unknown";

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "booked":
      case "confirmed":
        return "border-[#485F4D] bg-[#4A6741]/20 text-[#8FA985]";

      case "in_progress":
        return "border-amber-500/30 bg-amber-950/40 text-amber-300";

      case "completed":
      case "complete":
        return "border-[#485F4D] bg-[#4A6741]/20 text-[#8FA985]";

      case "cancelled":
        return "border-rose-500/30 bg-rose-950/40 text-rose-300";

      case "no_show":
        return "border-[#45556C] bg-[#172132] text-[#90A1B9]";

      default:
        return "border-[#485F4D]/50 bg-[#172132] text-[#CAD5E2]";
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#485F4D] bg-[#172132]">
            <div className="size-7 animate-spin rounded-full border-[3px] border-[#485F4D] border-t-[#8FA985]" />
          </div>

          <p className="mt-4 text-sm font-semibold text-[#90A1B9]">
            Loading your dashboard...
          </p>

          <p className="mt-1 text-xs text-[#64748B]">
            Preparing your appointment overview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden rounded-3xl border border-[#485F4D] bg-[#1E2B3B] p-6 shadow-2xl shadow-black/30 sm:p-8">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full bg-[#4A6741]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-[#6B8C5E]/15 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#485F4D] bg-[#172132] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#8FA985]">
              <Sparkles className="size-3.5 text-[#8FA985]" />
              Member Portal
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Welcome back,{" "}
              <span className="text-[#8FA985]">{user?.name || "Friend"}</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#90A1B9] sm:text-base">
              Your personal grooming dashboard. Manage your visits,
              appointments, and salon bookings all in one place.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 rounded-xl border border-[#485F4D]/70 bg-[#172132] px-3 py-2 text-xs font-semibold text-[#CAD5E2]">
                <CalendarDays className="size-3.5 text-[#8FA985]" />
                {upcomingAppointments.length} upcoming{" "}
                {upcomingAppointments.length === 1 ? "visit" : "visits"}
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-[#485F4D]/70 bg-[#172132] px-3 py-2 text-xs font-semibold text-[#CAD5E2]">
                <CheckCircle2 className="size-3.5 text-[#4bad46]" />
                {completedCount} completed
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/customer/book-appointment")}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] border border-[#8FA985]/40 px-6 text-sm font-extrabold text-white shadow-lg shadow-[#4A6741]/25 transition-all hover:brightness-110 active:scale-[0.97]"
          >
            <CalendarPlus className="size-4" />
            Book New Visit
          </button>
        </div>
      </section>

      {/* =========================================================
          ERROR
      ========================================================= */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm font-medium text-rose-300">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-rose-500/10">
            <AlertCircle className="size-4 text-rose-400" />
          </div>

          <span>{error}</span>
        </div>
      )}

      {/* =========================================================
          STAT CARDS
      ========================================================= */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Upcoming */}
        <Card className="group overflow-hidden rounded-3xl border border-[#485F4D] bg-[#1D293D80] shadow-xl shadow-black/20 transition-all hover:-translate-y-0.5 hover:border-[#8FA985] hover:bg-[#1D293D]">
          <CardContent className="relative p-5">
            <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-[#4A6741]/10 blur-2xl" />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#90A1B9]">
                  Upcoming Visits
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {upcomingAppointments.length}
                </p>

                <p className="mt-1 text-xs font-medium text-[#8FA985]">
                  Scheduled for you
                </p>
              </div>

              <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-md shadow-[#4A6741]/20">
                <CalendarDays className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completed */}
        <Card className="group overflow-hidden rounded-3xl border border-[#485F4D] bg-[#1D293D80] shadow-xl shadow-black/20 transition-all hover:-translate-y-0.5 hover:border-[#8FA985] hover:bg-[#1D293D]">
          <CardContent className="relative p-5">
            <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-[#6B8C5E]/10 blur-2xl" />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#90A1B9]">
                  Completed Visits
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {completedCount}
                </p>

                <p className="mt-1 text-xs font-medium text-[#8FA985]">
                  Grooming history
                </p>
              </div>

              <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-md shadow-[#4A6741]/20">
                <CheckCircle2 className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cancelled */}
        <Card className="group overflow-hidden rounded-3xl border border-[#485F4D] bg-[#1D293D80] shadow-xl shadow-black/20 transition-all hover:-translate-y-0.5 hover:border-rose-400/40 hover:bg-[#1D293D]">
          <CardContent className="relative p-5">
            <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-rose-500/5 blur-2xl" />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#90A1B9]">
                  Cancelled
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {cancelledCount}
                </p>

                <p className="mt-1 text-xs font-medium text-rose-300">
                  Cancelled bookings
                </p>
              </div>

              <div className="flex size-12 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-950/40 text-rose-300 shadow-md">
                <XCircle className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* =========================================================
          NEXT APPOINTMENT
      ========================================================= */}
      <Card className="overflow-hidden rounded-3xl border border-[#485F4D] bg-[#1E2B3B] shadow-xl shadow-black/20">
        <CardContent className="p-0">
          {/* Section Header */}
          <div className="flex flex-col justify-between gap-3 border-b border-[#485F4D]/60 bg-[#172132]/50 px-6 py-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8FA985]">
                Next Scheduled Visit
              </p>

              <h2 className="mt-1 text-lg font-bold text-white">
                Upcoming Appointment
              </h2>
            </div>

            {upcomingAppointment && (
              <span
                className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${getStatusClasses(
                  upcomingAppointment.status,
                )}`}
              >
                <span className="size-1.5 rounded-full bg-current" />
                {getStatusLabel(upcomingAppointment.status)}
              </span>
            )}
          </div>

          {upcomingAppointment ? (
            <div className="p-6">
              {/* Appointment Main Panel */}
              <div className="relative overflow-hidden rounded-2xl border border-[#485F4D]/70 bg-[#172132] p-5 sm:p-6 shadow-md">
                <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-[#4A6741]/10 blur-3xl" />

                <div className="relative grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                  {/* Date / Time */}
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#90A1B9]">
                      <CalendarDays className="size-4 text-[#8FA985]" />
                      Your appointment
                    </div>

                    <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-white">
                      {formatDate(upcomingAppointment.startTime)}
                    </h3>

                    <div className="mt-2 flex items-center gap-2">
                      <Clock3 className="size-4 text-[#8FA985]" />

                      <span className="text-base font-bold text-[#8FA985]">
                        {formatTime(upcomingAppointment.startTime)}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <div className="inline-flex items-center gap-2 rounded-xl border border-[#485F4D]/60 bg-[#1D293D80] px-3 py-2 text-xs font-semibold text-[#CAD5E2]">
                        <MapPin className="size-3.5 text-[#8FA985]" />

                        {upcomingAppointment.branchId?.name || "Main Branch"}
                      </div>

                      <div className="inline-flex items-center gap-2 rounded-xl border border-[#485F4D]/60 bg-[#1D293D80] px-3 py-2 text-xs font-semibold text-[#CAD5E2]">
                        <Scissors className="size-3.5 text-[#8FA985]" />

                        {upcomingAppointment.serviceIds
                          ?.map((service) => service.name)
                          .join(", ") || "Salon Service"}
                      </div>
                    </div>
                  </div>

                  {/* Payment / Action */}
                  <div className="flex flex-col justify-between rounded-2xl border border-[#485F4D]/60 bg-[#1D293D80] p-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                        Total Payable
                      </p>

                      <p className="mt-1 text-2xl font-black text-white">
                        Rs.{" "}
                        {Number(
                          upcomingAppointment.totalAmount ?? 0,
                        ).toLocaleString()}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedAppointment(upcomingAppointment)
                      }
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] border border-[#8FA985]/40 px-4 py-3 text-xs font-extrabold text-white shadow-md shadow-[#4A6741]/20 transition-all hover:brightness-110 active:scale-[0.98]"
                    >
                      View Details & Actions
                      <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-[#485F4D] bg-[#172132]">
                <CalendarDays className="size-7 text-[#8FA985]" />
              </div>

              <h3 className="mt-5 text-base font-bold text-white">
                No upcoming appointments
              </h3>

              <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#90A1B9]">
                You don't have any appointments scheduled right now. Book your
                next grooming visit in just a few steps.
              </p>

              <button
                type="button"
                onClick={() => navigate("/customer/book-appointment")}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] border border-[#8FA985]/40 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-[#4A6741]/20 transition hover:brightness-110 active:scale-95"
              >
                <CalendarPlus className="size-4" />
                Book Your Appointment
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* =========================================================
          RECENT APPOINTMENTS
      ========================================================= */}
      <Card className="overflow-hidden rounded-3xl border border-[#485F4D] bg-[#1E2B3B] shadow-xl shadow-black/20">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex flex-col justify-between gap-3 border-b border-[#485F4D]/60 bg-[#172132]/50 px-6 py-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8FA985]">
                Activity
              </p>

              <h2 className="mt-1 text-lg font-bold text-white">
                Recent Appointments
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/customer/appointments")}
              className="inline-flex w-fit items-center gap-1.5 text-xs font-bold text-[#8FA985] transition hover:text-white"
            >
              View Full History
              <ArrowRight className="size-3.5" />
            </button>
          </div>

          {/* List */}
          <div className="p-4 sm:p-5">
            {appointments.length === 0 ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-[#485F4D] bg-[#172132]">
                  <Scissors className="size-5 text-[#90A1B9]" />
                </div>

                <p className="mt-3 text-sm font-semibold text-white">
                  No appointments yet
                </p>

                <p className="mt-1 text-xs text-[#90A1B9]">
                  Your appointment history will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {appointments
                  .filter((app) => app._id !== upcomingAppointment?._id)
                  .slice(0, 4)
                  .map((appointment) => (
                    <button
                      key={appointment._id}
                      type="button"
                      onClick={() => setSelectedAppointment(appointment)}
                      className="group flex w-full flex-col gap-4 rounded-2xl border border-[#485F4D]/60 bg-[#172132] p-4 text-left transition-all hover:border-[#8FA985] hover:bg-[#1D293D] sm:flex-row sm:items-center sm:justify-between"
                    >
                      {/* Appointment Info */}
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#485F4D]/60 bg-[#1D293D80] transition group-hover:border-[#8FA985] group-hover:bg-[#4A6741]/20">
                          <Scissors className="size-4 text-[#8FA985]" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-white group-hover:text-[#8FA985] transition-colors">
                            {appointment.serviceIds
                              ?.map((service) => service.name)
                              .join(", ") || "Salon Service"}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#90A1B9]">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="size-3 text-[#8FA985]" />
                              {appointment.branchId?.name || "Branch"}
                            </span>

                            <span className="text-[#45556C]">•</span>

                            <span>
                              {formatShortDate(appointment.startTime)}
                            </span>

                            <span className="text-[#45556C]">•</span>

                            <span>{formatTime(appointment.startTime)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Amount / Status */}
                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <span className="text-sm font-extrabold text-white">
                          Rs.{" "}
                          {Number(
                            appointment.totalAmount ?? 0,
                          ).toLocaleString()}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold capitalize ${getStatusClasses(
                            appointment.status,
                          )}`}
                        >
                          <span className="size-1.5 rounded-full bg-current" />

                          {getStatusLabel(appointment.status)}
                        </span>

                        <ArrowRight className="hidden size-4 text-[#90A1B9] transition group-hover:translate-x-0.5 group-hover:text-[#8FA985] sm:block" />
                      </div>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* =========================================================
          APPOINTMENT DETAILS MODAL
      ========================================================= */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        isCustomer={true}
        onCancelled={() => setSelectedAppointment(null)}
        onRescheduled={() => setSelectedAppointment(null)}
      />
    </div>
  );
}

export default CustomerDashboard;
