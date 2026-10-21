import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarClock,
  Clock3,
  MapPin,
  Phone,
  RefreshCw,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getAllBranches } from "@/services/branch.service";
import { getMonthlyBranchAppointments } from "@/services/appointment.service";

function RescheduledAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [branches, setBranches] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadRescheduledAppointments = async ({ refresh = false } = {}) => {
    try {
      setError("");

      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      let branchList = branches;

      if (!branchList.length) {
        const branchResponse = await getAllBranches();

        branchList = branchResponse.data || [];

        setBranches(branchList);
      }

      const activeBranches = branchList.filter(
        (branch) => branch.isActive !== false,
      );

      const responses = await Promise.all(
        activeBranches.map((branch) =>
          getMonthlyBranchAppointments(branch._id),
        ),
      );

      const allAppointments = responses.flatMap(
        (response) => response.data || [],
      );

      const rescheduled = allAppointments
        .filter((appointment) => appointment.rescheduleHistory?.length > 0)
        .map((appointment) => {
          const branch = branchList.find(
            (item) => item._id === appointment.branchId,
          );

          return {
            ...appointment,
            branchName: branch?.name || "Unknown branch",
          };
        });

      setAppointments(rescheduled);
    } catch (err) {
      console.error("Rescheduled appointments loading error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load rescheduled appointments.",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadRescheduledAppointments();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/admin/dashboard")}
        className="
              mb-6 inline-flex items-center gap-2
              rounded-xl
              border border-[#485F4D]/70
              bg-[#172132]
              px-3.5 py-2
              text-xs font-bold
              text-[#CAD5E2]
              shadow-sm
              transition-all duration-200
              hover:border-[#8FA985]
              hover:bg-[#202F43]
              hover:text-white
              active:scale-[0.97]
            "
      >
        <ArrowLeft className="size-3.5" />
        Back to Dashboard
      </button>

      {/* Page Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-lg shadow-[#4A6741]/20">
            <CalendarClock className="size-6" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Rescheduled Appointments
              </h1>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#485F4D]/70 bg-[#182438] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#9FB794]">
                <Sparkles className="size-3" />
                Appointment History
              </span>
            </div>

            <p className="mt-1 text-xs font-medium text-[#90A1B9] sm:text-sm">
              Review appointments that have been rescheduled and track their
              schedule changes.
            </p>
          </div>
        </div>

        {/* Refresh */}
        <button
          type="button"
          onClick={() =>
            loadRescheduledAppointments({
              refresh: true,
            })
          }
          disabled={isRefreshing}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#34445A] bg-[#172234] px-4 text-xs font-bold text-[#C7D2E1] shadow-sm transition hover:border-[#485F4D] hover:bg-[#1D293D] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`size-4 ${
              isRefreshing ? "animate-spin text-[#8FA985]" : ""
            }`}
          />

          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Summary */}
      {!isLoading && !error && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total */}
          <div className="rounded-2xl border border-[#2E4057] bg-[#1B2A3B] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#8EA2BB]">
                  Total Rescheduled
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {appointments.length}
                </p>

                <p className="mt-1 text-xs text-[#71849D]">
                  Appointments with schedule changes
                </p>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl border border-[#485F4D] bg-[#22352C]">
                <RotateCcw className="size-5 text-[#9BB68F]" />
              </div>
            </div>
          </div>

          {/* Branches */}
          <div className="rounded-2xl border border-[#2E4057] bg-[#1B2A3B] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#8EA2BB]">
                  Active Branches
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {
                    branches.filter((branch) => branch.isActive !== false)
                      .length
                  }
                </p>

                <p className="mt-1 text-xs text-[#71849D]">
                  Locations included in history
                </p>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl border border-[#314158] bg-[#202F42]">
                <MapPin className="size-5 text-[#9BAFC6]" />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="rounded-2xl border border-[#485F4D]/80 bg-[#1B2A3B] p-5 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#8EA2BB]">
                  History Status
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#77C95B] shadow-[0_0_10px_rgba(119,201,91,0.45)]" />

                  <p className="text-lg font-bold text-[#B5CEAA]">
                    Tracking Active
                  </p>
                </div>

                <p className="mt-1 text-xs text-[#71849D]">
                  Reschedule activity is being monitored
                </p>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl border border-[#485F4D] bg-[#22352C]">
                <Clock3 className="size-5 text-[#9BB68F]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4 text-sm text-rose-300 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 size-2 shrink-0 rounded-full bg-rose-400" />

            <div>
              <p className="font-semibold text-rose-200">
                Unable to load appointment history
              </p>

              <p className="mt-1 text-rose-300/80">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex min-h-72 items-center justify-center rounded-2xl border border-[#2E4057] bg-[#172437]">
          <div className="text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-[#485F4D] bg-[#22352C]">
              <RefreshCw className="size-5 animate-spin text-[#91AA87]" />
            </div>

            <p className="mt-4 text-sm font-semibold text-[#CAD5E2]">
              Loading rescheduled appointments...
            </p>

            <p className="mt-1 text-xs text-[#71849D]">
              Fetching appointment history from active branches
            </p>
          </div>
        </div>
      ) : appointments.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-[#3A4B62] bg-[#172437] px-6 py-16 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#34445A] bg-[#202F42]">
            <CalendarClock className="size-6 text-[#8395AC]" />
          </div>

          <h2 className="mt-5 text-base font-bold text-white">
            No rescheduled appointments
          </h2>

          <p className="mx-auto mt-1.5 max-w-md text-sm text-[#71849D]">
            There are currently no appointments with reschedule history.
            Rescheduled appointments will appear here automatically.
          </p>
        </div>
      ) : (
        /* Appointment Cards */
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-base font-bold text-white">
                Reschedule History
              </h2>

              <p className="mt-1 text-xs text-[#71849D]">
                Appointments with previous schedule changes
              </p>
            </div>

            <div className="hidden items-center gap-2 text-xs font-medium text-[#71849D] sm:flex">
              <span className="size-1.5 rounded-full bg-[#77C95B]" />
              {appointments.length} records
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {appointments.map((appointment) => {
              const history = appointment.rescheduleHistory || [];
              const latest = history[history.length - 1];

              return (
                <div
                  key={appointment._id}
                  className="group overflow-hidden rounded-2xl border border-[#2E4057] bg-[#1B2A3B] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#485F4D] hover:shadow-lg hover:shadow-black/10"
                >
                  {/* Green top accent */}
                  <div className="h-1 bg-gradient-to-r from-[#4A6741] to-[#7A9B69]" />

                  <div className="p-5">
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#485F4D] bg-[#22352C] text-sm font-bold text-[#A8BE9E]">
                          {(appointment.customerId?.name || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#71849D]">
                            Customer
                          </p>

                          <h3 className="mt-0.5 truncate text-sm font-bold text-white">
                            {appointment.customerId?.name || "Unknown customer"}
                          </h3>
                        </div>
                      </div>

                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-300">
                        <span className="size-1.5 rounded-full bg-amber-400" />
                        Rescheduled
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="mt-5 grid gap-2.5">
                      <div className="flex items-center gap-2.5 text-xs">
                        <Phone className="size-3.5 text-[#71849D]" />

                        <span className="text-[#71849D]">Phone</span>

                        <span className="ml-auto truncate font-medium text-[#CAD5E2]">
                          {appointment.customerId?.phone || "-"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 text-xs">
                        <MapPin className="size-3.5 text-[#71849D]" />

                        <span className="text-[#71849D]">Branch</span>

                        <span className="ml-auto truncate font-medium text-[#CAD5E2]">
                          {appointment.branchName}
                        </span>
                      </div>
                    </div>

                    {/* Schedule Change */}
                    {latest && (
                      <div className="mt-5 rounded-xl border border-[#314158] bg-[#152235] p-4">
                        <div className="flex items-center gap-2">
                          <RotateCcw className="size-3.5 text-[#8FA985]" />

                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8EA2BB]">
                            Latest Schedule Change
                          </p>
                        </div>

                        <div className="mt-4 grid gap-3">
                          <div className="rounded-lg border border-[#2E4057] bg-[#1B2A3B] p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#687B93]">
                              Previous Time
                            </p>

                            <p className="mt-1.5 text-xs font-medium leading-5 text-[#A9B7C9]">
                              {new Date(latest.from).toLocaleString("en-PK")}
                            </p>
                          </div>

                          <div className="flex justify-center">
                            <div className="flex size-7 items-center justify-center rounded-full border border-[#485F4D] bg-[#22352C]">
                              <ArrowLeft className="size-3.5 rotate-[-90deg] text-[#91AA87]" />
                            </div>
                          </div>

                          <div className="rounded-lg border border-[#485F4D]/70 bg-[#203128] p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#7F9A78]">
                              New Time
                            </p>

                            <p className="mt-1.5 text-xs font-bold leading-5 text-[#C2D5BC]">
                              {new Date(latest.to).toLocaleString("en-PK")}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reason */}
                    {latest?.reason && (
                      <div className="mt-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#687B93]">
                          Reason
                        </p>

                        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[#A5B3C5]">
                          {latest.reason}
                        </p>
                      </div>
                    )}

                    {/* Payment */}
                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#2E4057] pt-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#687B93]">
                          Total Amount
                        </p>

                        <p className="mt-1 text-sm font-bold text-white">
                          Rs. {appointment.totalAmount ?? 0}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#687B93]">
                          Deposit
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#AFC0D2]">
                          Rs. {appointment.depositPaid ?? 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default RescheduledAppointments;
