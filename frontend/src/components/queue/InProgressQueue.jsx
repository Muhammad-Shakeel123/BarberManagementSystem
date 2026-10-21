import {
  Activity,
  Scissors,
  UserRound,
} from "lucide-react";

function InProgressQueue({ queue }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#304156] bg-[#172132] shadow-lg shadow-black/5">
      <div className="border-b border-[#304156] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-[#485F4D] bg-[#223328]">
            <Activity className="size-4.5 text-[#8FA985]" />
          </div>

          <div>
            <h2 className="text-sm font-extrabold text-white">
              In Progress
            </h2>

            <p className="mt-0.5 text-xs text-[#71829B]">
              Customers currently being served.
            </p>
          </div>
        </div>
      </div>

      {queue.inProgress?.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#304156] bg-[#1D293D]">
            <Scissors className="size-6 text-[#71829B]" />
          </div>

          <p className="mt-4 font-bold text-white">
            No active services
          </p>

          <p className="mt-1 text-sm text-[#71829B]">
            No customers are currently in progress.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 p-4 sm:grid-cols-2">
          {queue.inProgress.map((entry) => (
            <div
              key={entry.id || entry._id}
              className="rounded-2xl border border-[#3A4B61] bg-[#1D293D] p-4 transition hover:border-[#485F4D] hover:bg-[#202E42]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#223328] text-sm font-bold text-[#A5C39A] ring-1 ring-[#485F4D]">
                    {(entry.customer?.name || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <p className="font-bold text-white">
                      {entry.customer?.name ||
                        "Unknown Customer"}
                    </p>

                    <div className="mt-1 flex items-center gap-1.5">
                      <UserRound className="size-3 text-[#71829B]" />

                      <p className="text-xs text-[#90A1B9]">
                        {entry.customer?.phone || "No phone"}
                      </p>
                    </div>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#485F4D] bg-[#223328] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#9AB88E]">
                  <span className="size-1.5 animate-pulse rounded-full bg-[#78B65B]" />
                  Active
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-[#304156] pt-3">
                <Scissors className="size-3.5 text-[#8FA985]" />

                <span className="text-xs font-semibold text-[#90A1B9]">
                  Service in progress
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InProgressQueue;