import {
  Building2,
  Scissors,
  Sparkles,
  User,
  UserCheck,
} from "lucide-react";

function SelectedAppointment({ customer, branch, barber, service }) {
  if (!customer && !branch && !barber && !service) {
    return null;
  }

  const items = [
    {
      show: !!customer,
      icon: User,
      label: "Customer",
      value: customer?.name || "-",
    },
    {
      show: true,
      icon: Building2,
      label: "Branch",
      value: branch?.name || "Not selected",
    },
    {
      show: true,
      icon: UserCheck,
      label: "Stylist",
      value: barber?.userId?.name || "Any Available Barber",
    },
    {
      show: true,
      icon: Scissors,
      label: "Service",
      value: service?.name || "Not selected",
    },
  ];

  return (
    <section className="rounded-3xl border border-[#485F4D] bg-[#1E2B3B] p-5 shadow-xl sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-xl bg-[#4A6741]/25 text-[#8FA985]">
            <Sparkles className="size-3.5" />
          </span>

          <p className="text-xs font-bold uppercase tracking-wider text-[#90A1B9]">
            Current Selection
          </p>
        </div>

        <span className="rounded-full border border-[#485F4D] bg-[#172132] px-2.5 py-1 text-[10px] font-bold text-[#8FA985]">
          Ready to book
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items
          .filter((item) => item.show)
          .map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-[#485F4D]/60 bg-[#172132] p-3.5 transition hover:border-[#8FA985]/60 hover:bg-[#1D293D]"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#90A1B9]">
                  <Icon className="size-3.5 text-[#8FA985]" />
                  {item.label}
                </div>

                <p className="mt-1 truncate text-xs font-bold text-white sm:text-sm">
                  {item.value}
                </p>
              </div>
            );
          })}
      </div>
    </section>
  );
}

export default SelectedAppointment;