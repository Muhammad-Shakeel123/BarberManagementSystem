import {
  Search,
  SlidersHorizontal,
  CalendarDays,
  GitBranch,
  CircleDot,
} from "lucide-react";

function AppointmentFilters({
  search,
  setSearch,
  status,
  setStatus,
  branchId,
  setBranchId,
  branches,
  date,
  setDate,
}) {
  return (
    <div className="rounded-[20px] border border-[#485F4D]/70 bg-[#1E2B3B] p-5 text-white shadow-lg shadow-black/10 sm:p-6">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-[#172132]">
          <SlidersHorizontal className="size-4 text-[#8FA985]" />
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">
            Appointment Filters
          </h2>

          <p className="mt-0.5 text-[11px] text-[#90A1B9]">
            Find and filter appointments quickly
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#90A1B9]" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer..."
            className="h-11 w-full rounded-xl border border-[#485F4D]/70 bg-[#172132] pl-10 pr-3 text-xs font-medium text-white placeholder:text-[#68788E] outline-none transition focus:border-[#8FA985] focus:ring-2 focus:ring-[#6B8C5E]/20"
          />
        </div>

        {/* Date */}
        <div className="relative">
          <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-[#8FA985]" />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-11 w-full rounded-xl border border-[#485F4D]/70 bg-[#172132] px-3 pl-10 text-xs font-medium text-white outline-none transition focus:border-[#8FA985] focus:ring-2 focus:ring-[#6B8C5E]/20"
          />
        </div>

        {/* Branch */}
        <div className="relative">
          <GitBranch className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-[#8FA985]" />

          <select
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-[#485F4D]/70 bg-[#172132] px-3 pl-10 pr-8 text-xs font-medium text-white outline-none transition focus:border-[#8FA985] focus:ring-2 focus:ring-[#6B8C5E]/20"
          >
            <option value="all">All branches</option>

            {branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.name}
              </option>
            ))}
          </select>

          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#90A1B9]">
            ▾
          </span>
        </div>

        {/* Status */}
        <div className="relative">
          <CircleDot className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-[#8FA985]" />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-[#485F4D]/70 bg-[#172132] px-3 pl-10 pr-8 text-xs font-medium text-white outline-none transition focus:border-[#8FA985] focus:ring-2 focus:ring-[#6B8C5E]/20"
          >
            <option value="all">All statuses</option>
            <option value="booked">Booked</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In Progress</option>
            <option value="complete">Completed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>

          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#90A1B9]">
            ▾
          </span>
        </div>
      </div>
    </div>
  );
}

export default AppointmentFilters;