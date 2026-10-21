import {
  CalendarClock,
  Clock3,
  MapPin,
  Scissors,
  User,
  Wallet,
  ArrowRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const statusStyles = {
  booked: {
    label: "Booked",
    className:
      "border-blue-400/30 bg-blue-950/40 text-blue-300",
    dot: "bg-blue-400",
  },

  confirmed: {
    label: "Confirmed",
    className:
      "border-emerald-400/30 bg-emerald-950/40 text-emerald-300",
    dot: "bg-emerald-400",
  },

  in_progress: {
    label: "In Progress",
    className:
      "border-amber-400/30 bg-amber-950/40 text-amber-300",
    dot: "bg-amber-400 animate-pulse",
  },

  complete: {
    label: "Completed",
    className:
      "border-emerald-400/30 bg-emerald-950/40 text-emerald-300",
    dot: "bg-emerald-400",
  },

  completed: {
    label: "Completed",
    className:
      "border-emerald-400/30 bg-emerald-950/40 text-emerald-300",
    dot: "bg-emerald-400",
  },

  cancelled: {
    label: "Cancelled",
    className:
      "border-rose-400/30 bg-rose-950/40 text-rose-300",
    dot: "bg-rose-400",
  },

  no_show: {
    label: "No Show",
    className:
      "border-slate-400/20 bg-slate-800/60 text-slate-300",
    dot: "bg-slate-400",
  },
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
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

function AppointmentCard({
  appointment,
  onClick,
  isCustomer = false,
}) {
  const status = statusStyles[appointment.status] || {
    label: appointment.status || "Unknown",
    className:
      "border-slate-400/20 bg-slate-800/60 text-slate-300",
    dot: "bg-slate-400",
  };

  const serviceNames =
    appointment.serviceIds?.map((service) => service.name).join(", ") ||
    "No service";

  const totalDuration =
    appointment.serviceIds?.reduce(
      (total, service) => total + (service.duration || 0),
      0,
    ) || 0;

  const barberName =
    appointment.barberId?.userId?.name ||
    appointment.barberId?.name ||
    "Assigned barber";

  const branchName =
    appointment.branchId?.name ||
    appointment.branchName ||
    "Branch not available";

  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-[20px] border border-[#485F4D] bg-[#1E2B3B] text-white shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#6B8C5E] hover:bg-[#213247] hover:shadow-xl hover:shadow-black/20 active:scale-[0.99]"
    >
      <CardContent className="p-5 sm:p-6">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-[#172132]">
                <CalendarClock className="size-3.5 text-[#8FA985]" />
              </div>

              <p className="text-sm font-extrabold tracking-tight text-white">
                {formatTime(appointment.startTime)}
                {" – "}
                {formatTime(appointment.endTime)}
              </p>
            </div>

            <p className="mt-2 text-[11px] font-medium text-[#90A1B9]">
              {formatDate(appointment.startTime)}
              {" · "}
              {appointment.isWalkIn
                ? "Walk-in"
                : "Online Booking"}
            </p>
          </div>

          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${status.className}`}
          >
            <span
              className={`size-1.5 rounded-full ${status.dot}`}
            />

            {status.label}
          </span>
        </div>

        {/* Customer / Barber */}
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#485F4D]/50 bg-[#172132] p-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4A6741] to-[#6B8C5E] text-white shadow-md shadow-[#4A6741]/20">
            <User className="size-5" />
          </div>

          <div className="min-w-0">
            {isCustomer ? (
              <>
                <p className="truncate text-xs font-bold text-white">
                  With Stylist {barberName}
                </p>

                <p className="mt-0.5 truncate text-[11px] font-medium text-[#90A1B9]">
                  Confirmed booking
                </p>
              </>
            ) : (
              <>
                <p className="truncate text-xs font-bold text-white">
                  {appointment.customerId?.name ||
                    "Guest Customer"}
                </p>

                <p className="mt-0.5 truncate text-[11px] font-medium text-[#90A1B9]">
                  {appointment.customerId?.phone ||
                    appointment.customerId?.email ||
                    "No contact provided"}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Branch & Service */}
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center gap-2.5">
            <MapPin className="size-3.5 shrink-0 text-[#8FA985]" />

            <span className="truncate text-xs font-semibold text-[#CAD5E2]">
              {branchName}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Scissors className="size-3.5 shrink-0 text-[#8FA985]" />

            <span className="truncate text-xs text-[#90A1B9]">
              {serviceNames}
            </span>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-5 flex items-center justify-between border-t border-[#485F4D]/50 pt-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#90A1B9]">
            <Clock3 className="size-3.5 text-[#8FA985]" />

            <span>{totalDuration} mins</span>
          </div>

          <div className="flex items-center gap-1.5 text-sm font-extrabold text-white">
            <Wallet className="size-4 text-[#8FA985]" />

            <span>
              Rs. {appointment.totalAmount ?? 0}
            </span>
          </div>
        </div>

        {/* View Details */}
        <div className="mt-4 flex items-center justify-end gap-1.5 text-[11px] font-bold text-[#8FA985] opacity-70 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">
          <span>View full details</span>

          <ArrowRight className="size-3.5" />
        </div>
      </CardContent>
    </Card>
  );
}

export default AppointmentCard;