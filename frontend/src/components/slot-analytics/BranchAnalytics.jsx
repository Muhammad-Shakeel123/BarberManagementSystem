import { Building2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import SlotTimeline from "./SlotTimeline";
import BarberPerformance from "./BarberPerformance";
import ChairStatus from "./ChairStatus";

function BranchAnalytics({ branch }) {
  return (
    <Card className="overflow-hidden border-[#304255] bg-[#1a2a3b] shadow-none">
      <CardContent className="p-5 sm:p-6">
        {/* Branch Header */}
        <div className="flex flex-col gap-4 border-b border-[#304255] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#4b6745] bg-[#273c2b]">
              <Building2 className="size-5 text-[#94b978]" />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                {branch.branchName}
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                {branch.branchCode}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-[#304255] bg-[#172536] px-3 py-1.5 text-xs font-medium text-slate-400">
            {branch.date}
          </div>
        </div>

        {/* Branch Slot Summary */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoBox
            label="Total Slots"
            value={branch.slots.total}
          />

          <InfoBox
            label="Available"
            value={branch.slots.available}
            green
          />

          <InfoBox
            label="Booked"
            value={branch.slots.booked}
          />

          <InfoBox
            label="Utilization"
            value={`${branch.slots.utilization}%`}
            green
          />
        </div>

        {/* Appointments */}
        <div className="mt-6">
          <h3 className="mb-3 font-semibold text-white">
            Appointments
          </h3>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoBox
              label="Total"
              value={branch.appointments.total}
            />

            <InfoBox
              label="Completed"
              value={branch.appointments.completed}
              green
            />

            <InfoBox
              label="In Progress"
              value={branch.appointments.inProgress}
            />

            <InfoBox
              label="Cancelled"
              value={branch.appointments.cancelled}
              danger
            />
          </div>
        </div>

        {/* Timeline */}
        <SlotTimeline slots={branch.slotDetails} />

        {/* Barber + Chair */}
        <div className="mt-7 grid gap-6 border-t border-[#304255] pt-6 lg:grid-cols-2">
          <BarberPerformance
            barbers={branch.barberStats}
          />

          <ChairStatus chairs={branch.chairStats} />
        </div>
      </CardContent>
    </Card>
  );
}

function InfoBox({
  label,
  value,
  green = false,
  danger = false,
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        danger
          ? "border-[#543d43] bg-[#28232b]"
          : green
            ? "border-[#3d5743] bg-[#203328]"
            : "border-[#304255] bg-[#172536]"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p
        className={`mt-1 text-xl font-bold ${
          danger
            ? "text-[#d17b82]"
            : green
              ? "text-[#9bc47e]"
              : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default BranchAnalytics;