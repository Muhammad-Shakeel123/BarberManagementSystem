import { Mail, Phone, User } from "lucide-react";

function AppointmentCustomerInfo({ appointment }) {
  const customer = appointment?.customerId;

  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-white">Customer</h3>

      <div className="rounded-xl border border-[#485F4D]/70 bg-[#172132] p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-sm">
            <User className="size-5" />
          </div>

          <div>
            <p className="font-semibold text-white">{customer?.name || "-"}</p>

            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#90A1B9]">
              {customer?.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="size-3 text-[#8FA985]" />
                  {customer.phone}
                </span>
              )}

              {customer?.email && (
                <span className="flex items-center gap-1">
                  <Mail className="size-3 text-[#8FA985]" />
                  {customer.email}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AppointmentCustomerInfo;
