import { Building2, ChevronDown, MapPin } from "lucide-react";

function QueueBranchSelector({
  branches,
  selectedBranchId,
  onBranchChange,
  isLoading,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#304156] bg-[#172132] shadow-lg shadow-black/5">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#485F4D] bg-[#223328]">
            <Building2 className="size-5 text-[#8FA985]" />
          </div>

          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#71829B]">
              Queue Location
            </p>

            <p className="mt-0.5 text-sm font-bold text-white">
              Select Branch
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="h-11 w-full animate-pulse rounded-xl bg-[#223047] sm:max-w-md" />
        ) : (
          <div className="relative w-full sm:max-w-md">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#71829B]" />

            <select
              id="queue-branch"
              value={selectedBranchId}
              onChange={(event) =>
                onBranchChange(event.target.value)
              }
              className="h-11 w-full appearance-none rounded-xl border border-[#3A4B61] bg-[#1D293D] pl-10 pr-10 text-sm font-semibold text-white outline-none transition hover:border-[#52677D] focus:border-[#6B8C5E] focus:ring-2 focus:ring-[#6B8C5E]/20"
            >
              <option value="" className="bg-[#172132]">
                Select a branch
              </option>

              {branches
                .filter((branch) => branch.isActive)
                .map((branch) => (
                  <option
                    key={branch._id}
                    value={branch._id}
                    className="bg-[#172132]"
                  >
                    {branch.name}
                    {branch.code ? ` (${branch.code})` : ""}
                  </option>
                ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8FA985]" />
          </div>
        )}
      </div>
    </div>
  );
}

export default QueueBranchSelector;