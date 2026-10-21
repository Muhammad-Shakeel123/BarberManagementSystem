import {
  ArrowLeft,
  Building2,
  CircleAlert,
  ShieldCheck,
  Sparkles,
  Users,
  Armchair,
  Activity,
  MapPin,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { useBranchDetails } from "@/hooks/useBranchDetails";

import BranchInfo from "@/components/branches/BranchInfo";
import BranchLocation from "@/components/branches/BranchLocation";
import BranchHours from "@/components/branches/BranchHours";
import BranchCapacity from "@/components/branches/BranchCapacity";
import BranchSettings from "@/components/branches/BranchSettings";

function BranchDetails() {
  const navigate = useNavigate();
  const { branchId } = useParams();

  const { branch, isLoading, error } = useBranchDetails(branchId);

  if (isLoading) {
    return (
      <div className="space-y-6 text-white">
        <div className="relative overflow-hidden rounded-[24px] border border-[#485F4D]/70 bg-[#1E2B3B] p-6 shadow-xl sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 size-64 animate-pulse rounded-full bg-[#4A6741]/10 blur-3xl" />

          <div className="relative flex items-center gap-4">
            <div className="size-11 animate-pulse rounded-2xl bg-[#172132]" />

            <div className="space-y-2">
              <div className="h-5 w-48 animate-pulse rounded-lg bg-[#172132]" />
              <div className="h-3 w-72 animate-pulse rounded-lg bg-[#172132]" />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-[20px] border border-[#485F4D]/50 bg-[#1D293D]"
            />
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-[18px] border border-[#485F4D]/50 bg-[#1D293D]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !branch) {
    return (
      <div className="space-y-5 text-white">
        <button
          type="button"
          onClick={() => navigate("/admin/branches")}
          className="inline-flex items-center gap-2 rounded-xl border border-[#485F4D] bg-[#172132] px-3.5 py-2 text-xs font-bold text-[#CAD5E2] transition hover:border-[#8FA985] hover:bg-[#1E2B3B] hover:text-white active:scale-95"
        >
          <ArrowLeft className="size-3.5" />
          Back to Branches
        </button>

        <div className="rounded-[24px] border border-rose-500/40 bg-[#1E2B3B] p-10 text-center shadow-xl">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-rose-950/50">
            <CircleAlert className="size-6 text-rose-400" />
          </div>

          <h2 className="mt-4 text-base font-bold text-white">
            Unable to load branch
          </h2>

          <p className="mt-1 text-xs text-[#90A1B9]">
            We could not retrieve the requested branch details.
          </p>
        </div>
      </div>
    );
  }

  const statistics = branch.statistics || {};

  return (
    <div className="space-y-6 text-white">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/admin/branches")}
        className="inline-flex items-center gap-2 rounded-xl border border-[#485F4D] bg-[#172132] px-3.5 py-2 text-xs font-bold text-[#CAD5E2] shadow-sm transition hover:border-[#8FA985] hover:bg-[#1E2B3B] hover:text-white active:scale-95"
      >
        <ArrowLeft className="size-3.5" />
        Back to Branches
      </button>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[24px] border border-[#485F4D] bg-[#1E2B3B] p-6 shadow-2xl sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-[#4A6741]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 size-56 rounded-full bg-[#6B8C5E]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-lg shadow-[#4A6741]/25">
              <Building2 className="size-7" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {branch.name}
                </h1>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                    branch.isActive
                      ? "border-[#4A6741]/70 bg-[#4A6741]/15 text-[#8FA985]"
                      : "border-rose-500/30 bg-rose-950/30 text-rose-300"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      branch.isActive ? "bg-[#4bad46]" : "bg-rose-400"
                    }`}
                  />
                  {branch.isActive ? "Active Branch" : "Inactive Branch"}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-[#90A1B9]">
                <span>Branch Code: {branch.code || "N/A"}</span>

                <span className="hidden size-1 rounded-full bg-[#485F4D] sm:block" />

                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {branch.address?.city || "Location not available"}
                </span>
              </div>

              <p className="mt-3 max-w-2xl text-xs leading-relaxed text-[#90A1B9] sm:text-sm">
                Monitor branch operations, staff capacity, working hours,
                location and booking configuration from one place.
              </p>
            </div>
          </div>

          <div className="shrink-0 rounded-[16px] border border-[#485F4D] bg-[#172132] px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-[#4A6741]/20">
                <ShieldCheck className="size-4.5 text-[#8FA985]" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                  Branch Status
                </p>

                <p className="mt-0.5 text-xs font-bold text-white">
                  {branch.isActive ? "Operational" : "Currently Inactive"}
                </p>
              </div>

              <span
                className={`ml-2 size-2 rounded-full ${
                  branch.isActive ? "bg-[#4bad46]" : "bg-slate-500"
                }`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section>
        <div className="mb-3.5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Branch Overview</h2>

            <p className="text-xs font-medium text-[#90A1B9]">
              Current operational capacity and status
            </p>
          </div>

          <div className="hidden items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8FA985] sm:flex">
            <Sparkles className="size-3" />
            Live Overview
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Barbers */}
          <div className="group relative overflow-hidden rounded-[20px] border border-[#485F4D] bg-[#1D293D] p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#8FA985] hover:bg-[#1E2B3B] hover:shadow-xl">
            <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-[#4A6741]/10 blur-2xl" />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#90A1B9]">
                  Active Barbers
                </p>

                <p className="mt-2 text-3xl font-extrabold tracking-tight text-white">
                  {statistics.barberCount ?? 0}
                </p>

                <p className="mt-1 text-[11px] font-medium text-[#90A1B9]">
                  Staff members assigned
                </p>
              </div>

              <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-md shadow-[#4A6741]/20">
                <Users className="size-5" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold text-[#8FA985]">
              <span className="size-1.5 rounded-full bg-[#4bad46]" />
              Staff capacity
            </div>
          </div>

          {/* Chairs */}
          <div className="group relative overflow-hidden rounded-[20px] border border-[#485F4D] bg-[#1D293D] p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#8FA985] hover:bg-[#1E2B3B] hover:shadow-xl">
            <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-[#6B8C5E]/10 blur-2xl" />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#90A1B9]">
                  Registered Chairs
                </p>

                <p className="mt-2 text-3xl font-extrabold tracking-tight text-white">
                  {statistics.chairCount ?? 0}
                </p>

                <p className="mt-1 text-[11px] font-medium text-[#90A1B9]">
                  Operational stations
                </p>
              </div>

              <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-md shadow-[#4A6741]/20">
                <Armchair className="size-5" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold text-[#8FA985]">
              <span className="size-1.5 rounded-full bg-[#4bad46]" />
              Station capacity
            </div>
          </div>

          {/* Status */}
          <div className="group relative overflow-hidden rounded-[20px] border border-[#485F4D] bg-[#1D293D] p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#8FA985] hover:bg-[#1E2B3B] hover:shadow-xl">
            <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-[#4A6741]/10 blur-2xl" />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#90A1B9]">
                  Branch Status
                </p>

                <p className="mt-2 text-2xl font-extrabold tracking-tight text-white">
                  {branch.isActive ? "Operational" : "Inactive"}
                </p>

                <p className="mt-1 text-[11px] font-medium text-[#90A1B9]">
                  Current system state
                </p>
              </div>

              <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-[#4A6741]/40 bg-[#4A6741]/15">
                <Activity className="size-5 text-[#8FA985]" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold text-[#8FA985]">
              <span
                className={`size-1.5 rounded-full ${
                  branch.isActive ? "bg-[#4bad46]" : "bg-slate-500"
                }`}
              />
              {branch.isActive ? "All systems operational" : "Branch disabled"}
            </div>
          </div>
        </div>
      </section>

      {/* Branch Information */}
      <section>
        <div className="mb-3.5">
          <h2 className="text-base font-bold text-white">Branch Information</h2>

          <p className="mt-0.5 text-xs font-medium text-[#90A1B9]">
            Contact, location and general branch information
          </p>
        </div>

        <BranchInfo branch={branch} />
      </section>

      {/* Location */}
      <BranchLocation branch={branch} />

      {/* Operations */}
      <section>
        <div className="mb-3.5">
          <h2 className="text-base font-bold text-white">
            Operational Configuration
          </h2>

          <p className="mt-0.5 text-xs font-medium text-[#90A1B9]">
            Working hours, staff stations and appointment capacity
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <BranchHours branch={branch} />
          <BranchCapacity branch={branch} />
        </div>
      </section>

      {/* Settings */}
      <section>
        <div className="mb-3.5">
          <h2 className="text-base font-bold text-white">
            Booking Configuration
          </h2>

          <p className="mt-0.5 text-xs font-medium text-[#90A1B9]">
            Current online booking and appointment rules
          </p>
        </div>

        <BranchSettings branch={branch} />
      </section>
    </div>
  );
}

export default BranchDetails;
