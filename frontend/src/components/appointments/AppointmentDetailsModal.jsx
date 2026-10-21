import {
  CalendarDays,
  Clock3,
  Wallet,
  X,
  MapPin,
  UserRound,
  ClipboardCheck,
} from "lucide-react";

import AppointmentStatusActions from "./AppointmentStatusActions";
import AppointmentCustomerInfo from "./AppointmentCustomerInfo";
import AppointmentServices from "./AppointmentServices";
import AppointmentExtraService from "./AppointmentExtraService";
import AppointmentReschedule from "./AppointmentReschedule";
import AppointmentCancel from "./AppointmentCancel";

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const statusLabels = {
  booked: "Booked",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  complete: "Completed",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No Show",
};

const statusStyles = {
  booked: "border-blue-400/30 bg-blue-950/40 text-blue-300",
  confirmed: "border-emerald-400/30 bg-emerald-950/40 text-emerald-300",
  in_progress: "border-amber-400/30 bg-amber-950/40 text-amber-300",
  complete: "border-emerald-400/30 bg-emerald-950/40 text-emerald-300",
  completed: "border-emerald-400/30 bg-emerald-950/40 text-emerald-300",
  cancelled: "border-rose-400/30 bg-rose-950/40 text-rose-300",
  no_show: "border-slate-400/20 bg-slate-800 text-slate-300",
};

function AppointmentDetailsModal({
  appointment,
  onClose,
  onStatusUpdate,
  isUpdatingStatus,
  onCancelled,
  onRescheduled,
  onUpdated,
  isCustomer = false,
  isBarber = false,
}) {
  if (!appointment) return null;

  const services = appointment.serviceIds || [];

  const statusLabel =
    statusLabels[appointment.status] || appointment.status || "Unknown";

  const statusClass =
    statusStyles[appointment.status] ||
    "border-slate-400/20 bg-slate-800 text-slate-300";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070D16]/80 p-3 backdrop-blur-md sm:p-5">
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[24px] border border-[#485F4D]/70 bg-[#1E2B3B] text-white shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="sticky top-0 z-20 flex shrink-0 items-start justify-between border-b border-[#485F4D]/60 bg-[#1E2B3B]/95 px-5 py-5 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#4A6741] to-[#6B8C5E] shadow-md shadow-[#4A6741]/20">
              <ClipboardCheck className="size-5 text-white" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#90A1B9]">
                Appointment Details
              </p>

              <h2 className="mt-1 truncate text-lg font-extrabold tracking-tight text-white sm:text-xl">
                {isCustomer
                  ? "Appointment Details"
                  : appointment.customerId?.name || "Unknown customer"}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-3 flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#485F4D]/60 bg-[#172132] text-[#90A1B9] transition hover:border-[#8FA985] hover:bg-[#213247] hover:text-white active:scale-95"
            aria-label="Close appointment details"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto">
          <div className="space-y-6 p-5 sm:p-6">
            {/* Date / Time / Status */}
            <div className="grid gap-3 sm:grid-cols-3">
              {/* Date */}
              <div className="rounded-2xl border border-[#485F4D]/60 bg-[#172132] p-4">
                <div className="flex size-8 items-center justify-center rounded-lg bg-[#4A6741]/20">
                  <CalendarDays className="size-4 text-[#8FA985]" />
                </div>

                <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                  Date
                </p>

                <p className="mt-1 text-sm font-bold text-white">
                  {formatDate(appointment.startTime)}
                </p>
              </div>

              {/* Time */}
              <div className="rounded-2xl border border-[#485F4D]/60 bg-[#172132] p-4">
                <div className="flex size-8 items-center justify-center rounded-lg bg-[#4A6741]/20">
                  <Clock3 className="size-4 text-[#8FA985]" />
                </div>

                <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                  Time
                </p>

                <p className="mt-1 text-sm font-bold text-white">
                  {formatTime(appointment.startTime)} –{" "}
                  {formatTime(appointment.endTime)}
                </p>
              </div>

              {/* Status */}
              <div className="rounded-2xl border border-[#485F4D]/60 bg-[#172132] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                    Status
                  </p>

                  <span
                    className={`size-2 rounded-full ${
                      appointment.status === "in_progress"
                        ? "animate-pulse bg-amber-400"
                        : appointment.status === "cancelled"
                          ? "bg-rose-400"
                          : "bg-emerald-400"
                    }`}
                  />
                </div>

                <span
                  className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusClass}`}
                >
                  {statusLabel}
                </span>
              </div>
            </div>

            {/* Status Actions */}
            {!isCustomer && (
              <section>
                <AppointmentStatusActions
                  status={appointment.status}
                  onStatusUpdate={(status) =>
                    onStatusUpdate?.(appointment._id, status)
                  }
                  isUpdatingStatus={isUpdatingStatus}
                />
              </section>
            )}

            {/* Customer / Appointment Information */}
            {isCustomer ? (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-[#4A6741]/20">
                    <ClipboardCheck className="size-4 text-[#8FA985]" />
                  </div>

                  <h3 className="text-sm font-bold text-white">
                    Appointment Information
                  </h3>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#485F4D]/60 bg-[#172132] p-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-3.5 text-[#8FA985]" />

                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                        Branch
                      </p>
                    </div>

                    <p className="mt-2 text-sm font-bold text-white">
                      {appointment.branchId?.name || "Branch unavailable"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#485F4D]/60 bg-[#172132] p-4">
                    <div className="flex items-center gap-2">
                      <UserRound className="size-3.5 text-[#8FA985]" />

                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                        Barber
                      </p>
                    </div>

                    <p className="mt-2 text-sm font-bold text-white">
                      {appointment.barberId?.userId?.name ||
                        appointment.barberId?.name ||
                        "Assigned barber"}
                    </p>
                  </div>
                </div>
              </section>
            ) : (
              <AppointmentCustomerInfo appointment={appointment} />
            )}

            {/* Services */}
            <AppointmentServices services={services} />

            {/* Extra Service */}
            {!isCustomer && !isBarber && (
              <AppointmentExtraService
                appointment={appointment}
                onUpdated={onUpdated}
              />
            )}

            {/* Payment */}
            <section className="relative overflow-hidden rounded-2xl border border-[#485F4D]/70 bg-gradient-to-br from-[#243446] to-[#172132] p-5 text-white">
              <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-[#4A6741]/15 blur-2xl" />

              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#4A6741] to-[#6B8C5E] shadow-md">
                    <Wallet className="size-5 text-white" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                      Total Amount
                    </p>

                    <p className="mt-1 text-2xl font-black tracking-tight text-white">
                      Rs. {appointment.totalAmount ?? 0}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#485F4D]/50 bg-[#172132]/80 px-4 py-3 sm:text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                    Deposit Paid
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#CAD5E2]">
                    Rs. {appointment.depositPaid ?? 0}
                  </p>
                </div>
              </div>
            </section>

            {/* Notes */}
            {appointment.notes && (
              <section>
                <h3 className="mb-3 text-sm font-bold text-white">Notes</h3>

                <div className="rounded-2xl border border-[#485F4D]/60 bg-[#172132] p-4">
                  <p className="text-sm leading-6 text-[#CAD5E2]">
                    {appointment.notes}
                  </p>
                </div>
              </section>
            )}

            {/* Reschedule */}
            {!isBarber && (
              <AppointmentReschedule
                appointment={appointment}
                onRescheduled={() => {
                  onRescheduled?.();
                  onClose();
                }}
              />
            )}

            {/* Cancel */}
            {!isBarber && (
              <AppointmentCancel
                appointment={appointment}
                onCancelled={() => {
                  onCancelled?.();
                  onClose();
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetailsModal;
