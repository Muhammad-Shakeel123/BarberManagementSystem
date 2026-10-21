import {
  Scissors,
  Users,
} from "lucide-react";

function BarberPerformance({ barbers }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Scissors className="size-4 text-[#89ae6e]" />

        <h3 className="font-semibold text-white">
          Barber Performance
        </h3>
      </div>

      <div className="space-y-2">
        {barbers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#304255] bg-[#172536]/60 p-4 text-center text-sm text-slate-500">
            No barber data available.
          </div>
        ) : (
          barbers.map((barber) => (
            <div
              key={barber.barberId}
              className="flex items-center justify-between rounded-xl border border-[#304255] bg-[#172536] p-3.5 transition hover:border-[#405669]"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full border border-[#3c5363] bg-[#223447]">
                  <Users className="size-4 text-[#8cad72]" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-100">
                    {barber.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {barber.appointments} appointments
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-white">
                  {barber.bookedSlots}
                </p>

                <p className="text-xs text-slate-500">
                  booked slots
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BarberPerformance;