import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  X,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { getBarberAvailability } from "@/services/barber.service";
import { getAllServices } from "@/services/service.service";

function BarberAvailability({ barber, onClose }) {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);

  const [loadingData, setLoadingData] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoadingData(true);
        setError("");

        const response = await getAllServices();

        setServices(response?.data || []);
      } catch (err) {
        console.error("Services error:", err);

        setError(err?.response?.data?.message || "Unable to load services.");
      } finally {
        setLoadingData(false);
      }
    };

    loadServices();
  }, []);

  const handleCheckAvailability = async () => {
    if (!date) {
      setError("Please select a date.");
      return;
    }

    if (!selectedService) {
      setError("Please select a service.");
      return;
    }

    try {
      setLoadingSlots(true);
      setError("");
      setSlots([]);

      const response = await getBarberAvailability(barber._id, date, [
        selectedService,
      ]);

      setSlots(response?.data || []);
    } catch (err) {
      console.error("Availability error:", err);

      setError(
        err?.response?.data?.message || "Unable to load barber availability.",
      );
    } finally {
      setLoadingSlots(false);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-PK", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080F1C]/80 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto overflow-x-hidden rounded-[24px] border border-[#485F4D] bg-[#1E2B3B] shadow-2xl">
        {/* Glow */}
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[#4A6741]/15 blur-3xl" />

        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-[#485F4D]/70 bg-gradient-to-r from-[#1E2B3B] to-[#21332F] px-6 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-[14px] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] shadow-lg shadow-[#4A6741]/20">
              <Clock className="size-5 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">
                  Barber Availability
                </h2>

                <span className="hidden rounded-full border border-[#485F4D] bg-[#172132] px-2 py-1 text-[10px] font-bold text-[#8FA985] sm:inline-flex">
                  LIVE SLOTS
                </span>
              </div>

              <p className="mt-0.5 text-xs font-medium text-[#708198]">
                {barber?.userId?.name || "Unknown Barber"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#485F4D] bg-[#172132] p-2 text-[#708198] transition hover:border-[#6B8C5E] hover:bg-[#24372E] hover:text-white active:scale-95"
            title="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="relative p-6 sm:p-7">
          {loadingData ? (
            <div className="rounded-[18px] border border-[#485F4D]/60 bg-[#172132] p-10 text-center">
              <div className="mx-auto size-8 animate-spin rounded-full border-2 border-[#485F4D] border-t-[#8FA985]" />

              <p className="mt-3 text-xs font-semibold text-[#90A1B9]">
                Loading services...
              </p>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="rounded-[20px] border border-[#485F4D] bg-[#172132] p-5 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-[#24372E]">
                    <Sparkles className="size-4 text-[#8FA985]" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Check Availability
                    </h3>

                    <p className="text-[11px] font-medium text-[#708198]">
                      Select a service and date to view appointment slots.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {/* Service */}
                  <div>
                    <label className="mb-2 block text-xs font-bold text-[#CAD5E2]">
                      Service
                    </label>

                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full rounded-[14px] border border-[#485F4D] bg-[#1D293D] px-3.5 py-3 text-sm font-medium text-white outline-none transition focus:border-[#8FA985] focus:ring-2 focus:ring-[#4A6741]/20"
                    >
                      <option value="">Select service</option>

                      {services.map((service) => (
                        <option
                          key={service._id}
                          value={service._id}
                          className="bg-[#172132] text-white"
                        >
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="mb-2 block text-xs font-bold text-[#CAD5E2]">
                      Date
                    </label>

                    <div className="relative">
                      <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#708198]" />

                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full rounded-[14px] border border-[#485F4D] bg-[#1D293D] py-3 pl-10 pr-3 text-sm font-medium text-white outline-none transition focus:border-[#8FA985] focus:ring-2 focus:ring-[#4A6741]/20"
                      />
                    </div>
                  </div>

                  {/* Button */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleCheckAvailability}
                      disabled={loadingSlots}
                      className="flex h-[46px] w-full items-center justify-center gap-2 rounded-[14px] bg-gradient-to-b from-[#6B8C5E] to-[#4A6741] px-4 text-xs font-bold text-white shadow-lg shadow-[#4A6741]/20 transition hover:from-[#78996A] hover:to-[#58784E] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loadingSlots ? (
                        <>
                          <div className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Checking...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="size-4" />
                          Check Availability
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-5 rounded-[16px] border border-rose-500/40 bg-rose-950/30 px-4 py-3.5">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-400" />

                    <p className="text-xs font-medium leading-relaxed text-rose-300">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Slots */}
              {slots.length > 0 && (
                <div className="mt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Clock className="size-4 text-[#8FA985]" />

                        <h3 className="text-sm font-bold text-white">
                          Appointment Slots
                        </h3>
                      </div>

                      <p className="mt-1 text-[11px] font-medium text-[#708198]">
                        Available booking windows for the selected service.
                      </p>
                    </div>

                    <span className="rounded-full border border-[#485F4D] bg-[#24372E] px-2.5 py-1 text-[10px] font-bold text-[#8FA985]">
                      {slots.filter((slot) => slot.available).length} available
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {slots.map((slot) => (
                      <div
                        key={`${slot.start}-${slot.end}`}
                        className={`rounded-[16px] border p-4 transition ${
                          slot.available
                            ? "border-[#485F4D] bg-[#24372E]/70 hover:border-[#6B8C5E]"
                            : "border-[#3B4656] bg-[#172132]"
                        }`}
                      >
                        <p
                          className={`text-sm font-bold ${
                            slot.available ? "text-[#CADCC5]" : "text-[#708198]"
                          }`}
                        >
                          {formatTime(slot.start)} - {formatTime(slot.end)}
                        </p>

                        <p className="mt-1 text-[11px] font-medium text-[#708198]">
                          {slot.duration} minutes
                        </p>

                        <div className="mt-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                              slot.available
                                ? "border-[#485F4D] bg-[#24372E] text-[#8FA985]"
                                : "border-[#3B4656] bg-[#1D293D] text-[#708198]"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                slot.available ? "bg-[#4bad46]" : "bg-[#62738A]"
                              }`}
                            />

                            {slot.available ? "Available" : "Not Available"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No slots */}
              {!loadingSlots &&
                !error &&
                date &&
                selectedService &&
                slots.length === 0 && (
                  <div className="mt-6 rounded-[20px] border border-dashed border-[#485F4D] bg-[#172132] p-10 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#24372E]">
                      <Clock className="size-5 text-[#708198]" />
                    </div>

                    <p className="mt-4 text-sm font-bold text-white">
                      No slots found
                    </p>

                    <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-[#708198]">
                      This barber has no available slots for the selected date
                      and service.
                    </p>
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BarberAvailability;
