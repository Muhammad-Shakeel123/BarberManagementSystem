import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  Play,
  RefreshCw,
  Scissors,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import AppointmentDetailsModal from "@/components/appointments/AppointmentDetailsModal";
import {
  getBarberAppointments,
  getMyBarberProfile,
} from "@/services/barber.service";
import { updateAppointmentStatus } from "@/services/appointment.service";
import { assignNext, getQueueStatus } from "@/services/queue.service";

const getToday = () => {
  const today = new Date();

  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
};

const getDayRange = () => {
  const today = getToday();

  return { from: `${today}T00:00:00`, to: `${today}T23:59:59` };
};

const formatTime = (value) =>
  new Date(value).toLocaleTimeString("en-PK", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

const statusLabels = {
  booked: "New",
  confirmed: "Ready",
  in_progress: "Serving now",
  completed: "Finished",
  complete: "Finished",
  cancelled: "Cancelled",
  no_show: "No show",
};

function BarberDashboard() {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [queue, setQueue] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadDashboard = useCallback(async ({ refresh = false } = {}) => {
    try {
      setError("");
      setMessage("");
      refresh ? setIsRefreshing(true) : setIsLoading(true);

      const barberResponse = await getMyBarberProfile();
      const barber = barberResponse?.data;
      const branchId = barber.branchId?._id || barber.branchId;
      const [appointmentsResponse, queueResponse] = await Promise.all([
        getBarberAppointments(barber._id, getDayRange()),
        getQueueStatus(branchId),
      ]);

      setProfile(barber);
      setAppointments(appointmentsResponse?.data || []);
      setQueue(queueResponse?.data || null);
    } catch (err) {
      console.error("Barber dashboard error:", err);
      setError(
        err?.response?.data?.message ||
          "We could not load your work for today.",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadDashboard]);

  const counts = useMemo(
    () => ({
      total: appointments.length,
      waiting: appointments.filter((item) =>
        ["booked", "confirmed"].includes(item.status),
      ).length,
      active: appointments.filter((item) => item.status === "in_progress")
        .length,
      finished: appointments.filter((item) =>
        ["completed", "complete"].includes(item.status),
      ).length,
    }),
    [appointments],
  );

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      setUpdatingId(appointmentId);
      setError("");
      await updateAppointmentStatus(appointmentId, status);
      setSelectedAppointment(null);
      setMessage(
        status === "in_progress" ? "Service started." : "Service finished.",
      );
      await loadDashboard({ refresh: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to update this service.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAssignNext = async () => {
    const branchId = profile?.branchId?._id || profile?.branchId;

    if (!branchId || !queue?.waiting?.length || isAssigning) return;

    try {
      setIsAssigning(true);
      setError("");
      await assignNext({ branchId, barberId: profile._id });
      setMessage("The next customer has been called.");
      await loadDashboard({ refresh: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to call the next customer.",
      );
    } finally {
      setIsAssigning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto size-12 animate-spin rounded-2xl border-4 border-[#485F4D] border-t-[#8FA985]" />
          <p className="mt-4 text-base font-bold text-white">
            Loading your work...
          </p>
          <p className="mt-1 text-sm text-[#90A1B9]">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">
      <section className="relative overflow-hidden rounded-3xl border border-[#485F4D] bg-[#1E2B3B] p-6 shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-[#4A6741]/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8FA985]">
              My work today
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Hello, {profile?.userId?.name || "Barber"}
            </h1>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-[#CAD5E2]">
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-[#8FA985]" />
                {profile?.branchId?.name || "Your branch"}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4 text-[#8FA985]" />
                {getToday()}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => loadDashboard({ refresh: true })}
            disabled={isRefreshing}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#485F4D] bg-[#172132] px-5 text-sm font-bold text-[#CAD5E2] transition hover:border-[#8FA985] hover:bg-[#24332F] disabled:opacity-60"
          >
            <RefreshCw
              className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-950/30 p-4 text-sm text-rose-200">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}
      {message && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-4 text-sm text-emerald-200">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={CalendarDays}
          label="Today"
          value={counts.total}
          hint="Total appointments"
        />
        <SummaryCard
          icon={Clock3}
          label="Next"
          value={counts.waiting}
          hint="Customers to serve"
        />
        <SummaryCard
          icon={Scissors}
          label="Now"
          value={counts.active}
          hint="Service in progress"
        />
        <SummaryCard
          icon={CheckCircle2}
          label="Done"
          value={counts.finished}
          hint="Finished today"
        />
      </div>

      <section className="rounded-3xl border border-[#485F4D] bg-[#1E2B3B] p-5 shadow-xl sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8FA985]">
              Waiting customers
            </p>
            <h2 className="mt-1 text-xl font-extrabold">
              Call the next customer
            </h2>
            <p className="mt-1 text-sm text-[#90A1B9]">
              Use this when you are ready to start the next service.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAssignNext}
            disabled={isAssigning || !queue?.waiting?.length}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#6B8C5E] to-[#4A6741] px-6 text-base font-black text-white shadow-lg shadow-[#4A6741]/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play className="size-5 fill-current" />
            {isAssigning ? "Calling..." : "Call Next"}
          </button>
        </div>
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#485F4D]/60 bg-[#172132] p-4">
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#4A6741]/25">
            <Users className="size-5 text-[#8FA985]" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">
              {queue?.waiting?.length || 0}
            </p>
            <p className="text-xs text-[#90A1B9]">
              people waiting in your branch
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8FA985]">
              Your schedule
            </p>
            <h2 className="mt-1 text-xl font-extrabold">
              Today's appointments
            </h2>
          </div>
          <span className="rounded-full border border-[#485F4D] bg-[#172132] px-3 py-1 text-xs font-bold text-[#CAD5E2]">
            {appointments.length} visits
          </span>
        </div>
        {appointments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#485F4D] bg-[#172132]/60 px-6 py-16 text-center">
            <CalendarDays className="mx-auto size-10 text-[#8FA985]" />
            <h3 className="mt-4 text-lg font-bold">No appointments today</h3>
            <p className="mt-1 text-sm text-[#90A1B9]">
              You are all clear for now.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <BarberAppointmentRow
                key={appointment._id}
                appointment={appointment}
                updating={updatingId === appointment._id}
                onOpen={() => setSelectedAppointment(appointment)}
                onStatusUpdate={(status) =>
                  handleStatusUpdate(appointment._id, status)
                }
              />
            ))}
          </div>
        )}
      </section>

      <AppointmentDetailsModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onStatusUpdate={handleStatusUpdate}
        isUpdatingStatus={Boolean(
          selectedAppointment && updatingId === selectedAppointment._id,
        )}
        isBarber
      />
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-2xl border border-[#485F4D] bg-[#1E2B3B] p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-[#90A1B9]">
          {label}
        </p>
        <Icon className="size-5 text-[#8FA985]" />
      </div>
      <p className="mt-3 text-3xl font-black">{value}</p>
      <p className="mt-1 text-xs text-[#90A1B9]">{hint}</p>
    </div>
  );
}

function BarberAppointmentRow({
  appointment,
  updating,
  onOpen,
  onStatusUpdate,
}) {
  const isFinished = ["completed", "complete", "cancelled", "no_show"].includes(
    appointment.status,
  );
  const nextStatus =
    appointment.status === "booked"
      ? "confirmed"
      : appointment.status === "confirmed"
        ? "in_progress"
        : appointment.status === "in_progress"
          ? "completed"
          : null;
  const nextLabel =
    appointment.status === "booked"
      ? "Confirm"
      : appointment.status === "confirmed"
        ? "Start"
        : appointment.status === "in_progress"
          ? "Finish"
          : null;

  return (
    <div className="rounded-2xl border border-[#485F4D] bg-[#1E2B3B] p-4 shadow-lg sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onOpen}
          className="flex min-w-0 items-start gap-4 text-left"
        >
          <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#172132] text-[#8FA985]">
            <Clock3 className="size-4" />
            <span className="mt-1 text-xs font-black">
              {formatTime(appointment.startTime)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-extrabold text-white">
              {appointment.customerId?.name || "Customer"}
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm text-[#90A1B9]">
              <Scissors className="size-3.5 text-[#8FA985]" />
              {appointment.serviceIds
                ?.map((service) => service.name)
                .join(", ") || "Service"}
            </p>
            {appointment.customerId?.phone && (
              <p className="mt-1 flex items-center gap-2 text-xs text-[#90A1B9]">
                <Phone className="size-3.5 text-[#8FA985]" />
                {appointment.customerId.phone}
              </p>
            )}
          </div>
        </button>
        <div className="flex items-center gap-3 sm:shrink-0">
          <span className="rounded-full border border-[#485F4D] bg-[#172132] px-3 py-1.5 text-xs font-bold text-[#CAD5E2]">
            {statusLabels[appointment.status] || appointment.status}
          </span>
          {!isFinished && nextStatus && (
            <button
              type="button"
              onClick={() => onStatusUpdate(nextStatus)}
              disabled={updating}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#4A6741] px-4 text-sm font-black text-white transition hover:bg-[#6B8C5E] disabled:opacity-60"
            >
              {nextStatus === "in_progress" && (
                <Play className="size-4 fill-current" />
              )}
              {nextStatus === "completed" && (
                <CheckCircle2 className="size-4" />
              )}
              {updating ? "Saving..." : nextLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onOpen}
            className="hidden h-11 items-center justify-center rounded-xl border border-[#485F4D] px-4 text-sm font-bold text-[#CAD5E2] hover:bg-[#172132] sm:inline-flex"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default BarberDashboard;
