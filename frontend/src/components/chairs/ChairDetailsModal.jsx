import { useEffect, useState } from "react";
import {
  Armchair,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  UserRound,
  X,
} from "lucide-react";

import chairService from "@/services/chair.service";

const ChairDetailsModal = ({
  open,
  onClose,
  chair,
}) => {
  const [details, setDetails] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [loadingDetails, setLoadingDetails] =
    useState(false);

  const [loadingAvailability, setLoadingAvailability] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !chair?._id) return;

    const loadDetails = async () => {
      try {
        setLoadingDetails(true);
        setError("");

        const response =
          await chairService.getChairById(
            chair._id
          );

        setDetails(response?.data || null);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load chair details"
        );
      } finally {
        setLoadingDetails(false);
      }
    };

    loadDetails();
  }, [open, chair]);

  useEffect(() => {
    if (!open || !chair?._id || !selectedDate) return;

    const loadAvailability = async () => {
      try {
        setLoadingAvailability(true);
        setError("");

        const response =
          await chairService.getChairAvailability(
            chair._id,
            selectedDate
          );

        setAppointments(response?.data || []);
      } catch (err) {
        setAppointments([]);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load chair availability"
        );
      } finally {
        setLoadingAvailability(false);
      }
    };

    loadAvailability();
  }, [open, chair, selectedDate]);

  if (!open || !chair) return null;

  const chairData = details || chair;

  const formatTime = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-800 bg-[#111b2d] shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-[#78a85b]/30 bg-[#78a85b]/10">
              <Armchair className="size-5 text-[#9ac47d]" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                {chairData.name}
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Chair #{chairData.number}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-145px)] overflow-y-auto">
          <div className="space-y-6 p-5">
            {/* Error */}
            {error && (
              <div className="rounded-2xl border border-red-900/60 bg-red-950/20 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Details */}
            {loadingDetails ? (
              <div className="flex items-center justify-center rounded-2xl border border-slate-800 bg-[#172437] py-12">
                <Loader2 className="size-6 animate-spin text-[#9ac47d]" />
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {/* Type */}
                <div className="rounded-2xl border border-slate-800 bg-[#172437] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Type
                  </p>

                  <p className="mt-2 font-semibold capitalize text-slate-200">
                    {chairData.type || "General"}
                  </p>
                </div>

                {/* Status */}
                <div className="rounded-2xl border border-slate-800 bg-[#172437] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`size-2 rounded-full ${
                        chairData.isOperational
                          ? "bg-[#78a85b]"
                          : "bg-slate-500"
                      }`}
                    />

                    <p className="font-semibold text-slate-200">
                      {chairData.isOperational
                        ? "Operational"
                        : "Non-Operational"}
                    </p>
                  </div>
                </div>

                {/* Shared */}
                <div className="rounded-2xl border border-slate-800 bg-[#172437] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Shared Station
                  </p>

                  <p className="mt-2 font-semibold text-slate-200">
                    {chairData.isShared ? "Yes" : "No"}
                  </p>
                </div>

                {/* Barber */}
                <div className="rounded-2xl border border-slate-800 bg-[#172437] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Assigned Barber
                  </p>

                  <p className="mt-2 flex items-center gap-2 font-semibold text-slate-200">
                    <UserRound className="size-4 text-[#9ac47d]" />

                    {chairData.assignedBarberId
                      ? "Assigned"
                      : "Unassigned"}
                  </p>
                </div>

                {chairData.description && (
                  <div className="rounded-2xl border border-slate-800 bg-[#172437] p-4 sm:col-span-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Description
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {chairData.description}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Availability */}
            <div className="border-t border-slate-800 pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-[#9ac47d]" />

                    <h3 className="font-semibold text-white">
                      Chair Availability
                    </h3>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Appointments scheduled for the selected
                    date.
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </label>

                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />

                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) =>
                        setSelectedDate(e.target.value)
                      }
                      className="h-10 rounded-xl border border-slate-700 bg-[#0d1728] pl-9 pr-3 text-sm text-slate-200 outline-none transition focus:border-[#78a85b]/60 focus:ring-2 focus:ring-[#78a85b]/10"
                    />
                  </div>
                </div>
              </div>

              {/* Loading */}
              {loadingAvailability && (
                <div className="mt-4 flex items-center justify-center rounded-2xl border border-slate-800 bg-[#172437] py-8">
                  <Loader2 className="size-5 animate-spin text-[#9ac47d]" />

                  <span className="ml-2 text-sm text-slate-500">
                    Loading availability...
                  </span>
                </div>
              )}

              {/* Empty */}
              {!loadingAvailability &&
                appointments.length === 0 && (
                  <div className="mt-4 rounded-2xl border border-dashed border-slate-700 bg-[#172437] p-8 text-center">
                    <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-slate-800">
                      <Clock3 className="size-5 text-slate-500" />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-300">
                      No appointments
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      This chair has no appointments for
                      this date.
                    </p>
                  </div>
                )}

              {/* Appointments */}
              {!loadingAvailability &&
                appointments.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {appointments.map(
                      (appointment) => (
                        <div
                          key={appointment._id}
                          className="rounded-2xl border border-slate-800 bg-[#172437] p-4 transition hover:border-slate-700"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold text-slate-200">
                                Appointment
                              </p>

                              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
                                <Clock3 className="size-3.5" />

                                {formatTime(
                                  appointment.startTime
                                )}{" "}
                                -{" "}
                                {formatTime(
                                  appointment.endTime
                                )}
                              </p>
                            </div>

                            <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-400">
                              {formatStatus(
                                appointment.status
                              )}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-800 p-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChairDetailsModal;