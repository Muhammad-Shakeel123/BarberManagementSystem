import { Scissors } from "lucide-react";

function AppointmentServices({ services = [] }) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-white">Services</h3>

      <div className="divide-y divide-[#485F4D]/50 rounded-xl border border-[#485F4D]/70 bg-[#172132]">
        {services.length === 0 ? (
          <p className="p-4 text-sm text-[#90A1B9]">No services found.</p>
        ) : (
          services.map((service) => (
            <div
              key={service._id}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-[#4A6741]/25 text-[#8FA985]">
                  <Scissors className="size-4" />
                </div>

                <div>
                  <p className="text-sm font-medium text-white">
                    {service.name}
                  </p>

                  <p className="text-xs text-[#90A1B9]">
                    {service.duration} minutes
                  </p>
                </div>
              </div>

              <p className="text-sm font-bold text-[#8FA985]">
                Rs. {service.price ?? 0}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default AppointmentServices;
