import {
  Clock3,
  RefreshCw,
  UserRound,
} from "lucide-react";

function WaitingQueue({
  queue,
  selectedBranchId,
  isLoadingQueue,
  onRefresh,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#304156] bg-[#172132] shadow-lg shadow-black/5">
      <div className="flex flex-col gap-4 border-b border-[#304156] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-[#3C5068] bg-[#1D2A3E]">
            <Clock3 className="size-4.5 text-[#8FA985]" />
          </div>

          <div>
            <h2 className="text-sm font-extrabold text-white">
              Waiting Queue
            </h2>

            <p className="mt-0.5 text-xs text-[#71829B]">
              Customers currently waiting for service.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRefresh(selectedBranchId)}
          disabled={isLoadingQueue}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#3A4B61] bg-[#1D293D] px-3.5 py-2 text-xs font-bold text-[#CAD5E2] transition hover:border-[#52677D] hover:bg-[#223047] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`size-3.5 ${
              isLoadingQueue ? "animate-spin text-[#8FA985]" : ""
            }`}
          />

          Refresh
        </button>
      </div>

      {queue.waiting?.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#304156] bg-[#1D293D]">
            <Clock3 className="size-6 text-[#71829B]" />
          </div>

          <p className="mt-4 font-bold text-white">
            Queue is empty
          </p>

          <p className="mt-1 text-sm text-[#71829B]">
            There are no customers waiting right now.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#304156]">
          {queue.waiting.map((entry) => (
            <div
              key={entry.id || entry._id}
              className="group flex flex-col gap-4 px-5 py-5 transition hover:bg-[#1A2638] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#485F4D] bg-[#223328] text-sm font-black text-[#A5C39A]">
                  {entry.position}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-white">
                      {entry.customer?.name ||
                        "Unknown Customer"}
                    </p>

                    <span className="rounded-full border border-[#304156] bg-[#1D293D] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#71829B]">
                      #{entry.position}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-1.5">
                    <UserRound className="size-3.5 text-[#71829B]" />

                    <p className="text-sm text-[#90A1B9]">
                      {entry.customer?.phone || "No phone"}
                    </p>
                  </div>

                  {entry.services?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {entry.services.map((service) => (
                        <span
                          key={service._id}
                          className="rounded-lg border border-[#3A4B61] bg-[#1D293D] px-2.5 py-1 text-[11px] font-semibold text-[#AEBBCB]"
                        >
                          {service.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-[#304156] bg-[#1D293D] px-4 py-3 sm:min-w-[130px] sm:text-right">
                <p className="text-lg font-black text-white">
                  {entry.estimatedWaitTime || 0}
                  <span className="ml-1 text-xs font-bold text-[#71829B]">
                    min
                  </span>
                </p>

                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-[#71829B]">
                  Estimated wait
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WaitingQueue;