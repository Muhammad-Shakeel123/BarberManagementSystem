import { Card, CardContent } from "@/components/ui/card";

function SlotUtilization({ summary }) {
  const utilization = Math.min(summary.utilization ?? 0, 100);

  return (
    <Card className="border-[#304255] bg-[#1a2a3b] shadow-none">
      <CardContent className="p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-white">
              Slot Utilization
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              How much of today's capacity has been booked.
            </p>
          </div>

          <span className="text-xl font-bold text-[#9bc47e]">
            {summary.utilization}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-[#26394a]">
          <div
            className="h-full rounded-full bg-[#6f9959] transition-all"
            style={{
              width: `${utilization}%`,
            }}
          />
        </div>

        <div className="mt-3 flex justify-between text-xs font-medium">
          <span className="text-[#91b47a]">
            {summary.bookedSlots} booked
          </span>

          <span className="text-slate-500">
            {summary.availableSlots} available
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default SlotUtilization;