import {
  Users,
  UserRoundCheck,
  Activity,
} from "lucide-react";

function QueueStats({ queue }) {
  const waiting = queue.totalWaiting || 0;
  const inProgress = queue.totalInProgress || 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="group overflow-hidden rounded-2xl border border-[#304156] bg-[#172132] shadow-lg shadow-black/5 transition hover:border-[#485F4D]">
        <div className="relative p-5">
          <div className="absolute right-5 top-5 opacity-10 transition group-hover:opacity-20">
            <Users className="size-16 text-[#8FA985]" />
          </div>

          <div className="flex items-start gap-4">
            <div className="flex size-11 items-center justify-center rounded-xl border border-[#3C5068] bg-[#1D2A3E]">
              <Users className="size-5 text-[#8FA985]" />
            </div>

            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#71829B]">
                Waiting
              </p>

              <p className="mt-1 text-3xl font-black tracking-tight text-white">
                {waiting}
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-[#78B65B]" />

                <span className="text-xs font-semibold text-[#8FA985]">
                  Customers in queue
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="group overflow-hidden rounded-2xl border border-[#304156] bg-[#172132] shadow-lg shadow-black/5 transition hover:border-[#485F4D]">
        <div className="relative p-5">
          <div className="absolute right-5 top-5 opacity-10 transition group-hover:opacity-20">
            <Activity className="size-16 text-[#8FA985]" />
          </div>

          <div className="flex items-start gap-4">
            <div className="flex size-11 items-center justify-center rounded-xl border border-[#485F4D] bg-[#223328]">
              <UserRoundCheck className="size-5 text-[#8FA985]" />
            </div>

            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#71829B]">
                In Progress
              </p>

              <p className="mt-1 text-3xl font-black tracking-tight text-white">
                {inProgress}
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                <span className="size-1.5 animate-pulse rounded-full bg-[#78B65B]" />

                <span className="text-xs font-semibold text-[#8FA985]">
                  Currently being served
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QueueStats;