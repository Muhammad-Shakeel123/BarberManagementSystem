import {
  Building2,
  Armchair,
  CheckCircle2,
  Scissors,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

function SystemOverview({ summary }) {
  const items = [
    {
      title: "Branches",
      value: summary.totalBranches,
      icon: Building2,
    },
    {
      title: "Total Chairs",
      value: summary.totalChairs,
      icon: Armchair,
    },
    {
      title: "Operational Chairs",
      value: summary.operationalChairs,
      icon: CheckCircle2,
    },
    {
      title: "Barbers",
      value: summary.totalBarbers,
      icon: Scissors,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.title}
            className="border-[#304255] bg-[#172536] shadow-none"
          >
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#3c5363] bg-[#223447]">
                <Icon className="size-5 text-[#89ae6e]" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8da4b8]">
                  {item.title}
                </p>

                <p className="mt-1 text-2xl font-bold text-white">
                  {item.value}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default SystemOverview;