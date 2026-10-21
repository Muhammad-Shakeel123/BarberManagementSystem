import {
  CalendarDays,
  Footprints,
  Globe2,
  Timer,
  Settings2,
} from "lucide-react";

function BranchSettings({ branch }) {
  const settings = branch.settings || {};

  const items = [
    {
      label: "Online Booking",
      value: settings.allowOnlineBooking ? "Enabled" : "Disabled",
      icon: Globe2,
      active: settings.allowOnlineBooking,
    },
    {
      label: "Walk-in",
      value: settings.allowWalkIn ? "Enabled" : "Disabled",
      icon: Footprints,
      active: settings.allowWalkIn,
    },
    {
      label: "Advance Booking",
      value: `${settings.maxDaysAdvance ?? 0} days`,
      icon: CalendarDays,
      active: true,
    },
    {
      label: "Minimum Advance",
      value: `${settings.minMinutesAdvance ?? 0} minutes`,
      icon: Timer,
      active: true,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="group relative overflow-hidden rounded-[18px] border border-[#485F4D] bg-[#1D293D] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#8FA985] hover:bg-[#1E2B3B] hover:shadow-xl"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-[#4A6741]/10 blur-2xl" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl border border-[#485F4D] bg-[#172132]">
                  <Icon className="size-4.5 text-[#8FA985]" />
                </div>

                <span
                  className={`flex size-2 items-center justify-center rounded-full ${
                    item.active ? "bg-[#4bad46]" : "bg-slate-500"
                  }`}
                />
              </div>

              <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                {item.label}
              </p>

              <p className="mt-1 text-sm font-extrabold text-white">
                {item.value}
              </p>

              <div className="mt-3 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wide">
                <Settings2
                  className={`size-3 ${
                    item.active ? "text-[#8FA985]" : "text-[#64748B]"
                  }`}
                />

                <span
                  className={
                    item.active ? "text-[#8FA985]" : "text-[#64748B]"
                  }
                >
                  {item.active ? "Active setting" : "Disabled"}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BranchSettings;