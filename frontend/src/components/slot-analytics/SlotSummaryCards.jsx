import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

function SlotSummaryCards({ summary }) {
  const cards = [
    {
      title: "Total Slots",
      value: summary.totalSlots,
      icon: CalendarDays,
      description: "Generated slots",
    },
    {
      title: "Available Slots",
      value: summary.availableSlots,
      icon: CheckCircle2,
      description: "Ready for booking",
    },
    {
      title: "Booked Slots",
      value: summary.bookedSlots,
      icon: Clock3,
      description: "Currently occupied",
    },
    {
      title: "Utilization",
      value: `${summary.utilization}%`,
      icon: TrendingUp,
      description: "Slot usage",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.title}
            className="border-[#304255] bg-[#1a2a3b] shadow-none"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8ea5b9]">
                    {card.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-white">
                    {card.value}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {card.description}
                  </p>
                </div>

                <div className="flex size-11 items-center justify-center rounded-xl border border-[#3a5061] bg-[#223447]">
                  <Icon className="size-5 text-[#8bad72]" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default SlotSummaryCards;