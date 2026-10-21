import {
  Clock3,
  Coffee,
  CalendarClock,
} from "lucide-react";

function BranchHours({ branch }) {
  const hours = branch.workingHours || {};

  return (
    <div className="relative overflow-hidden rounded-[20px] border border-[#485F4D] bg-[#1E2B3B] p-5 shadow-xl sm:p-6">
      <div className="pointer-events-none absolute -bottom-12 -right-12 size-40 rounded-full bg-[#4A6741]/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-[14px] bg-[#172132] border border-[#485F4D]">
              <Clock3 className="size-5 text-[#8FA985]" />
            </div>

            <div>
              <h2 className="text-base font-bold text-white">
                Working Hours
              </h2>

              <p className="mt-0.5 text-[10px] font-medium text-[#90A1B9]">
                Branch operating schedule
              </p>
            </div>
          </div>

          <CalendarClock className="size-4 text-[#64748B]" />
        </div>

        <div className="mt-5 rounded-[16px] border border-[#485F4D]/70 bg-[#172132] p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
            Business Hours
          </p>

          <div className="mt-2 flex items-center justify-between gap-4">
            <span className="text-xs font-medium text-[#64748B]">
              Daily Schedule
            </span>

            <span className="text-sm font-extrabold text-white">
              {hours.start || "--:--"} - {hours.end || "--:--"}
            </span>
          </div>
        </div>

        {hours.breaks?.length > 0 && (
          <div className="mt-5">
            <div className="mb-2.5 flex items-center gap-2">
              <Coffee className="size-3.5 text-[#8FA985]" />

              <p className="text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                Scheduled Breaks
              </p>
            </div>

            <div className="space-y-2">
              {hours.breaks.map((item) => (
                <div
                  key={item._id || `${item.start}-${item.end}`}
                  className="flex items-center justify-between rounded-xl border border-[#485F4D]/60 bg-[#172132] px-3.5 py-2.5"
                >
                  <span className="text-xs font-medium text-[#90A1B9]">
                    Break
                  </span>

                  <span className="text-xs font-bold text-white">
                    {item.start} - {item.end}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BranchHours;