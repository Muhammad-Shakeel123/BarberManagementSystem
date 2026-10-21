import {
  Mail,
  MapPin,
  Phone,
  Globe2,
} from "lucide-react";

function BranchInfo({ branch }) {
  const address = branch.address || {};

  const items = [
    {
      label: "Address",
      value:
        [address.street, address.city, address.state, address.country]
          .filter(Boolean)
          .join(", ") || "Not available",
      icon: MapPin,
    },
    {
      label: "Phone",
      value: branch.phone || "Not available",
      icon: Phone,
    },
    {
      label: "Email",
      value: branch.email || "Not available",
      icon: Mail,
    },
    {
      label: "Timezone",
      value: branch.timezone || "Not available",
      icon: Globe2,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="group relative overflow-hidden rounded-[18px] border border-[#485F4D] bg-[#1D293D] p-5 transition-all duration-300 hover:border-[#8FA985] hover:bg-[#1E2B3B] hover:shadow-xl"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-[#4A6741]/10 blur-2xl" />

            <div className="relative flex items-start gap-3.5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#485F4D] bg-[#172132]">
                <Icon className="size-4.5 text-[#8FA985]" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                  {item.label}
                </p>

                <p className="mt-1.5 break-words text-sm font-semibold leading-relaxed text-white">
                  {item.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BranchInfo;