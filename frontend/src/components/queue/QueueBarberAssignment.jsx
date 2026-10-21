import {
  Scissors,
  ChevronDown,
  UserRound,
  Play,
} from "lucide-react";

function QueueBarberAssignment({
  barbers,
  selectedBarberId,
  onBarberChange,
  isLoadingBarbers,
  isAssigning,
  selectedBranchId,
  hasWaitingCustomers,
  onAssignNext,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#304156] bg-[#172132] shadow-lg shadow-black/5">
      <div className="border-b border-[#304156] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-[#485F4D] bg-[#223328]">
            <Scissors className="size-4.5 text-[#8FA985]" />
          </div>

          <div>
            <h2 className="text-sm font-extrabold text-white">
              Barber Assignment
            </h2>

            <p className="mt-0.5 text-xs text-[#71829B]">
              Choose a barber to call the next waiting customer.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-end md:justify-between">
        <div className="w-full md:max-w-md">
          <label
            htmlFor="queue-barber"
            className="mb-2 block text-[11px] font-extrabold uppercase tracking-wider text-[#71829B]"
          >
            Select Barber
          </label>

          {isLoadingBarbers ? (
            <div className="flex h-12 items-center rounded-xl border border-[#304156] bg-[#1D293D] px-4">
              <div className="size-4 animate-spin rounded-full border-2 border-[#405169] border-t-[#8FA985]" />

              <span className="ml-3 text-sm text-[#90A1B9]">
                Loading barbers...
              </span>
            </div>
          ) : (
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#71829B]" />

              <select
                id="queue-barber"
                value={selectedBarberId}
                onChange={(event) =>
                  onBarberChange(event.target.value)
                }
                className="h-12 w-full appearance-none rounded-xl border border-[#3A4B61] bg-[#1D293D] pl-10 pr-10 text-sm font-semibold text-white outline-none transition hover:border-[#52677D] focus:border-[#6B8C5E] focus:ring-2 focus:ring-[#6B8C5E]/20"
              >
                <option value="" className="bg-[#172132]">
                  Select a barber
                </option>

                {barbers.map((barber) => (
                  <option
                    key={barber._id}
                    value={barber._id}
                    className="bg-[#172132]"
                  >
                    {barber.userId?.name || "Unnamed Barber"}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8FA985]" />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onAssignNext}
          disabled={
            !selectedBranchId ||
            !selectedBarberId ||
            isAssigning ||
            !hasWaitingCustomers
          }
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4A6741] to-[#6B8C5E] px-6 text-sm font-extrabold text-white shadow-lg shadow-[#4A6741]/20 transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 md:w-auto"
        >
          <Play className="size-4 fill-current" />

          {isAssigning ? "Assigning..." : "Assign Next"}
        </button>
      </div>

      {!hasWaitingCustomers && (
        <div className="border-t border-[#304156] bg-[#141F2F] px-5 py-3">
          <p className="text-xs font-medium text-[#71829B]">
            No waiting customers are currently available for assignment.
          </p>
        </div>
      )}
    </div>
  );
}

export default QueueBarberAssignment;