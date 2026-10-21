import {
  Armchair,
  CheckCircle2,
  Users,
  XCircle,
} from "lucide-react";

function ChairStats({ stats }) {
  const cards = [
    {
      label: "Total Chairs",
      value: stats.total,
      description: "Registered stations",
      icon: Armchair,
      iconClass:
        "border-slate-700 bg-slate-800 text-slate-300",
      valueClass: "text-white",
    },
    {
      label: "Operational",
      value: stats.operational,
      description: "Currently available",
      icon: CheckCircle2,
      iconClass:
        "border-[#78a85b]/30 bg-[#78a85b]/10 text-[#9ac47d]",
      valueClass: "text-white",
    },
    {
      label: "Non-Operational",
      value: stats.nonOperational,
      description: "Temporarily unavailable",
      icon: XCircle,
      iconClass:
        "border-slate-700 bg-slate-800 text-slate-400",
      valueClass: "text-white",
    },
    {
      label: "Shared",
      value: stats.shared,
      description: "Shared stations",
      icon: Users,
      iconClass:
        "border-slate-700 bg-slate-800 text-slate-300",
      valueClass: "text-white",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className={`rounded-3xl border bg-[#172437] p-5 shadow-sm ${
              card.label === "Operational"
                ? "border-[#78a85b]/40"
                : "border-slate-800"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                  {card.label}
                </p>

                <p
                  className={`mt-2 text-3xl font-semibold tracking-tight ${card.valueClass}`}
                >
                  {card.value}
                </p>

                <p className="mt-1.5 text-xs text-slate-500">
                  {card.description}
                </p>
              </div>

              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border ${card.iconClass}`}
              >
                <Icon className="size-5" />
              </div>
            </div>

            {card.label === "Operational" && (
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-[#9ac47d]">
                <span className="size-2 rounded-full bg-[#78a85b]" />
                Currently operational
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

export default ChairStats;