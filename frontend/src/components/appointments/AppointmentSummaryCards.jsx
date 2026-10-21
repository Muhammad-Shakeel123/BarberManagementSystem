import {
  Activity,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";

function AppointmentSummaryCards({ dashboardStats }) {
  const navigate = useNavigate();

  const cards = [
    {
      label: "Today's Appointments",
      value: dashboardStats?.todayAppointments ?? 0,
      icon: CalendarDays,
      view: "today",
      description: "Scheduled for today",
    },
    {
      label: "This Month's Appointments",
      value: dashboardStats?.thisMonthAppointments ?? 0,
      icon: CalendarDays,
      view: "month",
      description: "Appointments this month",
    },
    {
      label: "Active Appointments",
      value: dashboardStats?.activeAppointments ?? 0,
      icon: Activity,
      view: "active",
      description: "Currently active",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.label}
            onClick={() =>
              navigate(
                `/admin/appointments?view=${item.view}`,
              )
            }
            className="group cursor-pointer overflow-hidden rounded-[20px] border border-[#485F4D]/70 bg-[#1E2B3B] text-white shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#8FA985] hover:bg-[#213247] hover:shadow-xl hover:shadow-black/20 active:scale-[0.99]"
          >
            <CardContent className="relative p-5 sm:p-6">
              {/* Subtle decorative glow */}
              <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-[#4A6741]/10 blur-2xl transition-all duration-300 group-hover:bg-[#6B8C5E]/20" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#90A1B9]">
                    {item.label}
                  </p>

                  <p className="mt-2 text-3xl font-extrabold tracking-tight text-white">
                    {item.value}
                  </p>

                  <p className="mt-1.5 text-[11px] font-medium text-[#90A1B9]">
                    {item.description}
                  </p>
                </div>

                <div className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#4A6741] to-[#6B8C5E] text-white shadow-md shadow-[#4A6741]/20 transition-transform duration-300 group-hover:scale-105">
                  <Icon className="size-5.5" />
                </div>
              </div>

              {/* Bottom action hint */}
              <div className="relative mt-5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#8FA985]">
                <span>View appointments</span>

                <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default AppointmentSummaryCards;