import { useEffect, useState } from "react";
import {
  Armchair,
  Scissors,
  CalendarDays,
  Gauge,
} from "lucide-react";

import { getBranchCapacity } from "@/services/branch.service";

function BranchCapacity({ branch }) {
  const [capacityData, setCapacityData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCapacity = async () => {
      if (!branch?._id) {
        return;
      }

      try {
        setIsLoading(true);

        const response = await getBranchCapacity(branch._id);

        console.log("BRANCH CAPACITY:", response);

        setCapacityData(response?.data || null);
      } catch (error) {
        console.error("Branch capacity error:", error);
        setCapacityData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadCapacity();
  }, [branch?._id]);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-[18px] border border-[#485F4D]/60 bg-[#1D293D]"
          />
        ))}
      </div>
    );
  }

  if (!capacityData) {
    return (
      <div className="flex min-h-56 items-center justify-center rounded-[20px] border border-rose-500/30 bg-[#1E2B3B] p-6">
        <div className="text-center">
          <Gauge className="mx-auto size-6 text-rose-400" />

          <p className="mt-3 text-sm font-semibold text-white">
            Unable to load capacity
          </p>

          <p className="mt-1 text-xs text-[#90A1B9]">
            Branch capacity information is currently unavailable.
          </p>
        </div>
      </div>
    );
  }

  const totalChairs = capacityData.totalChairs ?? 0;
  const totalBarbers = capacityData.totalBarbers ?? 0;
  const todayAppointments = capacityData.todayAppointments ?? 0;

  const maxConcurrentAppointments =
    capacityData.capacity?.maxConcurrentAppointments ?? 0;

  const items = [
    {
      label: "Chairs",
      description: "Operational chairs",
      value: totalChairs,
      icon: Armchair,
    },
    {
      label: "Barbers",
      description: "Active barbers",
      value: totalBarbers,
      icon: Scissors,
    },
    {
      label: "Today",
      description: "Appointments",
      value: todayAppointments,
      icon: CalendarDays,
    },
    {
      label: "Capacity",
      description: "Max concurrent appointments",
      value: maxConcurrentAppointments,
      icon: Gauge,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="group relative overflow-hidden rounded-[18px] border border-[#485F4D] bg-[#1D293D] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#8FA985] hover:bg-[#1E2B3B] hover:shadow-xl"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-[#4A6741]/10 blur-2xl" />

            <div className="relative flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#485F4D] bg-[#172132]">
                  <Icon className="size-4.5 text-[#8FA985]" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">
                    {item.label}
                  </p>

                  <p className="mt-0.5 text-[10px] font-medium leading-relaxed text-[#90A1B9]">
                    {item.description}
                  </p>
                </div>
              </div>

              <p className="shrink-0 text-2xl font-extrabold tracking-tight text-white">
                {item.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BranchCapacity;