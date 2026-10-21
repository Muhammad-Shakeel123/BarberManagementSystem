import {
  CheckCircle2,
  Layers3,
  XCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

function ServicesStats({
  activeServices,
  inactiveServices,
}) {
  const totalServices =
    activeServices + inactiveServices;

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <StatCard
        label="TOTAL SERVICES"
        value={totalServices}
        description="All registered services"
        icon={Layers3}
      />

      <StatCard
        label="ACTIVE SERVICES"
        value={activeServices}
        description="Currently operational"
        icon={CheckCircle2}
        active
      />

      <StatCard
        label="INACTIVE SERVICES"
        value={inactiveServices}
        description="Temporarily unavailable"
        icon={XCircle}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  active = false,
}) {
  return (
    <Card
      className={`rounded-3xl border bg-[#1D293D80] shadow-none ${
        active
          ? "border-[#485F4D]"
          : "border-[#485F4D]/50"
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-wide text-[#90A1B9]">
              {label}
            </p>

            <p className="mt-3 text-4xl font-extrabold tracking-tight text-white">
              {value}
            </p>

            <div className="mt-2 flex items-center gap-2">
              {active && (
                <span className="size-2 rounded-full bg-[#4bad46]" />
              )}

              <p
                className={`text-sm ${
                  active
                    ? "text-[#8FA985]"
                    : "text-[#90A1B9]"
                }`}
              >
                {description}
              </p>
            </div>
          </div>

          <div
            className={`flex size-14 items-center justify-center rounded-2xl border ${
              active
                ? "border-[#485F4D] bg-[#1D293D]"
                : "border-[#485F4D]/50 bg-[#172132]"
            }`}
          >
            <Icon
              className={`size-6 ${
                active
                  ? "text-[#8FA985]"
                  : "text-[#90A1B9]"
              }`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ServicesStats;