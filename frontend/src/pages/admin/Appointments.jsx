import {
  ArrowLeft,
  CalendarDays,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import AppointmentCard from "@/components/appointments/AppointmentCard";
import AppointmentFilters from "@/components/appointments/AppointmentFilters";
import AppointmentDetailsModal from "@/components/appointments/AppointmentDetailsModal";
import AppointmentSummaryCards from "@/components/appointments/AppointmentSummaryCards";

import { useAppointments } from "@/hooks/useAppointments";
import { useDashboardStats } from "@/hooks/useDashboardStats";

function Appointments() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const view = searchParams.get("view");
  const barberId = searchParams.get("barberId");

  const { stats: dashboardStats, error: dashboardStatsError } =
    useDashboardStats();

  const {
    branches,
    filteredAppointments,
    date,
    setDate,
    branchId,
    setBranchId,
    status,
    setStatus,
    search,
    setSearch,
    selectedAppointment,
    setSelectedAppointment,
    isLoading,
    isRefreshing,
    error,
    loadAppointments,
    handleRefresh,
    handleStatusUpdate,
    updatingStatusId,
  } = useAppointments(view, barberId);

  const combinedError = error || dashboardStatsError;

  return (
    <div className="space-y-6 text-white">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <section>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 rounded-xl border border-[#485F4D]/70 bg-[#172132] px-3.5 py-2 text-xs font-semibold text-[#CAD5E2] shadow-sm transition-all duration-200 hover:border-[#6B8C5E] hover:bg-[#1D293D] hover:text-white active:scale-[0.98]"
        >
          <ArrowLeft className="size-3.5" />
          Back
        </button>

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          {/* Page identity */}
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4A6741] to-[#6B8C5E] text-white shadow-lg shadow-[#4A6741]/20">
              <CalendarDays className="size-6" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  {barberId ? "Barber Appointments" : "Appointments"}
                </h1>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#485F4D] bg-[#172132] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8FA985]">
                  <Sparkles className="size-3" />
                  Live Schedule
                </span>
              </div>

              <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-[#90A1B9] sm:text-sm">
                {barberId
                  ? "Manage and monitor appointments for this barber."
                  : "Manage and monitor appointments across your branches."}
              </p>
            </div>
          </div>

          {/* Refresh */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#485F4D] bg-[#1D293D] px-4 text-xs font-bold text-[#CAD5E2] shadow-sm transition-all duration-200 hover:border-[#6B8C5E] hover:bg-[#26364C] hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`size-4 ${
                isRefreshing ? "animate-spin text-[#8FA985]" : ""
              }`}
            />

            {isRefreshing ? "Refreshing..." : "Refresh Feed"}
          </button>
        </div>
      </section>

      {/* =====================================================
          SUMMARY
      ===================================================== */}
      <section>
        <AppointmentSummaryCards dashboardStats={dashboardStats} />
      </section>

      {/* =====================================================
          FILTERS
      ===================================================== */}
      <section className="rounded-[20px] border border-[#485F4D]/70 bg-[#1E2B3B] p-4 shadow-xl sm:p-5">
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8FA985]">
            Schedule Controls
          </p>

          <h2 className="mt-1 text-base font-bold text-white">
            Find Appointments
          </h2>

          <p className="mt-0.5 text-xs text-[#90A1B9]">
            Filter appointments by branch, date, status, or customer.
          </p>
        </div>

        <AppointmentFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          branchId={branchId}
          setBranchId={setBranchId}
          branches={branches}
          date={date}
          setDate={setDate}
        />
      </section>

      {/* =====================================================
          ERROR
      ===================================================== */}
      {combinedError && (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-950/30 p-4 shadow-sm">
          <p className="text-sm font-semibold text-rose-300">
            Unable to load appointments
          </p>

          <p className="mt-1 text-xs text-rose-400">
            {combinedError}
          </p>
        </div>
      )}

      {/* =====================================================
          CONTENT
      ===================================================== */}
      {isLoading ? (
        <section className="rounded-[20px] border border-[#485F4D]/60 bg-[#1E2B3B] p-6 shadow-xl">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-[16px] border border-[#485F4D]/50 bg-[#172132]"
              />
            ))}
          </div>
        </section>
      ) : filteredAppointments.length === 0 ? (
        <section className="rounded-[20px] border border-dashed border-[#485F4D] bg-[#1E2B3B] px-6 py-16 text-center shadow-xl">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#485F4D] bg-[#172132]">
            <CalendarDays className="size-6 text-[#8FA985]" />
          </div>

          <h2 className="mt-4 text-base font-bold text-white">
            No appointments found
          </h2>

          <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-[#90A1B9]">
            There are no appointments matching the selected date and filter
            criteria.
          </p>
        </section>
      ) : (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8FA985]">
                Schedule
              </p>

              <h2 className="mt-1 text-base font-bold text-white">
                Appointment Feed
              </h2>
            </div>

            <span className="rounded-full border border-[#485F4D] bg-[#172132] px-3 py-1 text-[11px] font-semibold text-[#90A1B9]">
              {filteredAppointments.length}{" "}
              {filteredAppointments.length === 1
                ? "Appointment"
                : "Appointments"}
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                onClick={() => setSelectedAppointment(appointment)}
              />
            ))}
          </div>
        </section>
      )}

      {/* =====================================================
          DETAILS MODAL
      ===================================================== */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onStatusUpdate={handleStatusUpdate}
        isUpdatingStatus={
          selectedAppointment
            ? updatingStatusId === selectedAppointment._id
            : false
        }
        onCancelled={() => loadAppointments({ refresh: true })}
        onRescheduled={() => loadAppointments({ refresh: true })}
        onUpdated={() => loadAppointments({ refresh: true })}
      />
    </div>
  );
}

export default Appointments;