import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CircleAlert,
  Search,
  BarChart3,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { getSlotAnalytics } from "@/services/dashboard.service";

import SlotSummaryCards from "@/components/slot-analytics/SlotSummaryCards";
import SlotUtilization from "@/components/slot-analytics/SlotUtilization";
import SystemOverview from "@/components/slot-analytics/SystemOverview";
import BranchAnalytics from "@/components/slot-analytics/BranchAnalytics";

function SlotAnalytics() {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [branchSearch, setBranchSearch] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadAnalytics = async () => {
      try {
        const response = await getSlotAnalytics(date);

        console.log("SLOT ANALYTICS:", response);

        if (isMounted) {
          setAnalytics(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Slot analytics error:", error);

        if (isMounted) {
          setAnalytics(null);
          setIsLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      isMounted = false;
    };
  }, [date]);

  const handleDateChange = (event) => {
    setIsLoading(true);
    setDate(event.target.value);
  };

  const filteredBranches =
    analytics?.branches?.filter((branch) => {
      const search = branchSearch.toLowerCase().trim();

      if (!search) return true;

      return (
        branch.branchName.toLowerCase().includes(search) ||
        branch.branchCode.toLowerCase().includes(search)
      );
    }) || [];

  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 size-9 animate-spin rounded-full border-[3px] border-[#485F4D] border-t-[#8FA985]" />

          <p className="text-xs font-semibold text-[#90A1B9]">
            Loading slot capacity analytics...
          </p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-5">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="inline-flex items-center gap-2 rounded-xl border border-[#485F4D]/70 bg-[#172132] px-3.5 py-2 text-sm font-medium text-[#CAD5E2] transition hover:border-[#8FA985] hover:bg-[#1D293D] hover:text-white active:scale-[0.98]"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </button>

        <div className="rounded-3xl border border-dashed border-[#485F4D] bg-[#1D293D80] p-12 text-center">
          <CircleAlert className="mx-auto mb-3 size-9 text-[#90A1B9]" />

          <p className="text-sm font-bold text-white">
            No slot analytics available
          </p>

          <p className="mt-1 text-xs text-[#90A1B9]">
            Try selecting another date or check your server connection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="slot-analytics space-y-7">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="mb-5 inline-flex items-center gap-2 rounded-xl border border-[#485F4D]/70 bg-[#172132] px-3.5 py-2 text-sm font-medium text-[#CAD5E2] transition hover:border-[#8FA985] hover:bg-[#1D293D] hover:text-white active:scale-[0.98]"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </button>

        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          {/* Title */}
          <div className="flex items-center gap-3.5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-lg shadow-[#4A6741]/25">
              <BarChart3 className="size-6" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Capacity & Slot Analytics
                </h1>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#485F4D] bg-[#172132] px-2.5 py-1 text-[11px] font-bold text-[#8FA985]">
                  <Sparkles className="size-3.5" />
                  Live Utilization
                </span>
              </div>

              <p className="mt-1 text-xs font-medium text-[#90A1B9] sm:text-sm">
                Monitor branch slots, chairs, barbers, peak hours, and
                appointment fulfillment.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="flex h-11 items-center gap-2.5 rounded-2xl border border-[#485F4D]/70 bg-[#172132] px-3.5 transition focus-within:border-[#8FA985]">
              <Search className="size-4 text-[#90A1B9]" />

              <input
                type="text"
                placeholder="Search branch..."
                value={branchSearch}
                onChange={(event) => setBranchSearch(event.target.value)}
                className="w-36 bg-transparent text-xs font-medium text-[#CAD5E2] outline-none placeholder:text-[#90A1B9]/60 sm:w-44"
              />
            </div>

            {/* Date */}
            <div className="flex h-11 items-center gap-2.5 rounded-2xl border border-[#485F4D]/70 bg-[#172132] px-3.5 transition focus-within:border-[#8FA985]">
              <CalendarDays className="size-4 text-[#8FA985]" />

              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                className="bg-transparent text-xs font-bold text-[#CAD5E2] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <SlotSummaryCards summary={analytics.summary} />

      {/* Utilization */}
      <SlotUtilization summary={analytics.summary} />

      {/* System Overview */}
      <SystemOverview summary={analytics.summary} />

      {/* Branches */}
      <div className="space-y-5">
        {filteredBranches.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#485F4D] bg-[#1D293D80] p-12 text-center">
            <CircleAlert className="mx-auto mb-3 size-8 text-[#90A1B9]" />

            <p className="text-sm font-bold text-white">
              No branches match your query
            </p>

            <p className="mt-1 text-xs text-[#90A1B9]">
              Try changing your search keywords.
            </p>
          </div>
        ) : (
          filteredBranches.map((branch) => (
            <BranchAnalytics key={branch.branchId} branch={branch} />
          ))
        )}
      </div>
    </div>
  );
}

export default SlotAnalytics;
