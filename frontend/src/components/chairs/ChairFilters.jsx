import {
  Search,
  Settings2,
  SlidersHorizontal,
  X,
} from "lucide-react";

function ChairFilters({
  branches,
  selectedBranchId,
  onBranchChange,
  loadingBranches,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  selectedBranch,
}) {
  const hasSearch = search.trim().length > 0;

  return (
    <section className="rounded-3xl border border-slate-800 bg-[#172437] p-4 shadow-sm">
      {/* Branch */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <Settings2 className="size-4 text-[#9ac47d]" />
          Branch
        </div>

        <div className="relative flex-1 lg:max-w-sm">
          <select
            value={selectedBranchId}
            onChange={(e) => onBranchChange(e.target.value)}
            disabled={
              loadingBranches ||
              branches.length === 0
            }
            className="h-11 w-full appearance-none rounded-xl border border-slate-700 bg-[#111b2d] px-3 pr-10 text-sm font-medium text-slate-200 outline-none transition focus:border-[#78a85b]/60 focus:ring-2 focus:ring-[#78a85b]/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {branches.length === 0 && (
              <option value="">
                {loadingBranches
                  ? "Loading branches..."
                  : "No branches available"}
              </option>
            )}

            {branches.map((branch) => (
              <option
                key={branch._id}
                value={branch._id}
              >
                {branch.name}{" "}
                {branch.code
                  ? `(${branch.code})`
                  : ""}
              </option>
            ))}
          </select>

          <SlidersHorizontal className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-slate-800" />

      {/* Search + Status */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search chair by name, number or type..."
            className="h-11 w-full rounded-xl border border-slate-700 bg-[#111b2d] pl-10 pr-10 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-[#78a85b]/60 focus:ring-2 focus:ring-[#78a85b]/10"
          />

          {hasSearch && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-slate-800 hover:text-white"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="h-11 w-full appearance-none rounded-xl border border-slate-700 bg-[#111b2d] px-3 pr-10 text-sm font-medium text-slate-200 outline-none transition focus:border-[#78a85b]/60 focus:ring-2 focus:ring-[#78a85b]/10 lg:w-48"
          >
            <option value="all">All Chairs</option>
            <option value="operational">
              Operational
            </option>
            <option value="non_operational">
              Non-Operational
            </option>
          </select>

          <SlidersHorizontal className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      {/* Current branch */}
      {selectedBranch && (
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-800 pt-3">
          <p className="text-xs text-slate-500">
            Showing chairs for{" "}
            <span className="font-semibold text-slate-300">
              {selectedBranch.name}
            </span>
          </p>

          <span className="hidden text-xs text-slate-600 sm:block">
            Filter your stations above
          </span>
        </div>
      )}
    </section>
  );
}

export default ChairFilters;