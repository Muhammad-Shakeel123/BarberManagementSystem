import {
  CheckCircle2,
  CircleX,
  Wallet,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CalendarCheck,
} from "lucide-react";

// import { Card, CardContent } from "@/components/ui/card";
import { getDashboardCardsConfig } from "@/config/adminDashboard.config";
import { useDashboardStats } from "@/hooks/useDashboardStats";

function AdminDashboard() {
  const { stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-60 animate-pulse rounded-2xl bg-[#1D293D]" />
          <div className="h-4 w-80 animate-pulse rounded-lg bg-[#172132]" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="h-32 rounded-[16px] border border-[#485F4D]/40 bg-[#1D293D80] p-5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const dashboardCards = getDashboardCardsConfig(stats);
  const revenueThisMonth = stats?.revenueThisMonth?.[0]?.total ?? 0;
  const statusCounts = stats?.appointmentsByStatus || [];

  const completedAppointments =
    statusCounts.find((item) => item._id === "completed" || item._id === "complete")?.count ?? 0;

  const cancelledAppointments =
    statusCounts.find((item) => item._id === "cancelled")?.count ?? 0;

  const totalCompletedCancelled = completedAppointments + cancelledAppointments;
  const completionRate = totalCompletedCancelled > 0 
    ? Math.round((completedAppointments / totalCompletedCancelled) * 100) 
    : 100;

  return (
    <div className="space-y-6 text-white">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-[24px] border border-[#485F4D] bg-[#1E2B3B] p-6 shadow-2xl sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-[#4A6741]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 right-32 size-48 rounded-full bg-[#6B8C5E]/15 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#485F4D] bg-[#172132] px-3.5 py-1 text-xs font-semibold text-[#8FA985]">
              <Sparkles className="size-3.5 text-[#8FA985]" />
              Executive Dashboard
              <span className="size-1.5 rounded-full bg-[#4bad46]" />
              <span className="text-[11px] font-normal text-[#90A1B9]">Live Sync</span>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
              BarberPro Manager Overview
            </h1>
            <h2 className="text-xl font-extrabold bg-gradient-to-r from-[#8FA985] via-[#6B8C5E] to-[#4A6741] bg-clip-text text-transparent sm:text-2xl">
              Real-time Salon Analytics
            </h2>

            <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-[#90A1B9] sm:text-sm">
              Live operational summary today. Monitor appointments, customer queues,
              staff capacity, and revenue fulfillment.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-[14px] border border-[#485F4D] bg-[#172132] px-4 py-2.5 shadow-sm">
              <ShieldCheck className="size-5 text-[#8FA985]" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-[#90A1B9] font-bold">System Status</p>
                <p className="text-xs font-bold text-white">All Branches Online</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Overview Stats */}
      <section>
        <div className="mb-3.5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">
              Key Metrics & Capacity
            </h2>
            <p className="text-xs font-medium text-[#90A1B9]">
              Real-time operational metrics across salon branches
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-[16px] border border-[#485F4D] bg-[#1D293D80] p-5 shadow-sm transition-all duration-300 hover:border-[#8FA985] hover:bg-[#1D293D] hover:shadow-xl hover:scale-101"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold uppercase tracking-wider text-[#90A1B9]">
                      {card.title}
                    </p>

                    <p className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                      {card.value}
                    </p>
                  </div>

                  <div className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-md shadow-[#4A6741]/25 transition-transform duration-300 group-hover:scale-105">
                    <Icon className="size-5.5" />
                  </div>
                </div>

                <div className="mt-3.5 flex items-center gap-1.5 text-[11px] font-medium text-[#90A1B9]">
                  <span className="size-1.5 rounded-full bg-[#4bad46]" />
                  <span>Real-time Active</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Revenue & Appointment Performance Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Card */}
        <div className="relative overflow-hidden rounded-[20px] border border-[#485F4D] bg-[#1E2B3B] text-white shadow-xl lg:col-span-1 p-6 flex flex-col justify-between">
          <div className="pointer-events-none absolute -bottom-10 -right-10 size-48 rounded-full bg-[#4A6741]/20 blur-2xl" />

          <div>
            <div className="flex items-center justify-between">
              <div className="flex size-12 items-center justify-center rounded-[14px] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-md">
                <Wallet className="size-6 text-white" />
              </div>

              <div className="inline-flex items-center gap-1 rounded-full border border-[#485F4D] bg-[#172132] px-2.5 py-1 text-xs font-bold text-[#8FA985]">
                <TrendingUp className="size-3.5" />
                Monthly Total
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#90A1B9]">
                Revenue This Month
              </p>
              <h3 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Rs. {revenueThisMonth.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="mt-6 rounded-[14px] border border-[#485F4D]/50 bg-[#172132] p-3.5 text-xs text-[#CAD5E2]">
            <p className="flex items-center justify-between">
              <span>Calculated based on confirmed paid bookings</span>
              <ArrowUpRight className="size-4 text-[#8FA985]" />
            </p>
          </div>
        </div>

        {/* Appointment Performance */}
        <div className="rounded-[20px] border border-[#485F4D] bg-[#1E2B3B] p-6 shadow-xl lg:col-span-2">
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#90A1B9]">
                Fulfillment Metrics
              </p>
              <h2 className="mt-0.5 text-lg font-bold text-white">
                Appointment Completion Status
              </h2>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#485F4D] bg-[#172132] px-3.5 py-1 text-xs font-bold text-[#8FA985]">
              <CalendarCheck className="size-3.5 text-[#4bad46]" />
              {completionRate}% Success Rate
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Completed */}
            <div className="group relative overflow-hidden rounded-[16px] border border-[#485F4D]/70 bg-[#1D293D80] p-5 transition-all hover:border-[#8FA985]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8FA985]">
                    Completed
                  </p>
                  <p className="mt-1 text-3xl font-extrabold tracking-tight text-white">
                    {completedAppointments}
                  </p>
                </div>

                <div className="flex size-11 items-center justify-center rounded-[12px] bg-emerald-950/60 text-[#4bad46] border border-emerald-500/40 shadow-sm">
                  <CheckCircle2 className="size-6" />
                </div>
              </div>

              <p className="mt-3 text-xs font-medium text-[#90A1B9]">
                Appointments successfully serviced
              </p>
            </div>

            {/* Cancelled */}
            <div className="group relative overflow-hidden rounded-[16px] border border-[#485F4D]/70 bg-[#1D293D80] p-5 transition-all hover:border-[#8FA985]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    Cancelled
                  </p>
                  <p className="mt-1 text-3xl font-extrabold tracking-tight text-white">
                    {cancelledAppointments}
                  </p>
                </div>

                <div className="flex size-11 items-center justify-center rounded-[12px] bg-rose-950/60 text-rose-400 border border-rose-500/40 shadow-sm">
                  <CircleX className="size-6" />
                </div>
              </div>

              <p className="mt-3 text-xs font-medium text-[#90A1B9]">
                Cancelled by customer or staff
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-[16px] border border-rose-500/50 bg-rose-950/30 p-4">
          <p className="text-sm font-semibold text-rose-300">
            Unable to load some dashboard data.
          </p>
          <p className="mt-1 text-xs text-rose-400">{error}</p>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

