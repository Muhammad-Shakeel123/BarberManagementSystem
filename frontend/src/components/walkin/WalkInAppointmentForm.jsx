import {
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Scissors,
  User,
  UserPlus,
} from "lucide-react";

function WalkInAppointmentForm({
  isAdmin,
  customers,
  branches,
  branchBarbers,
  services,
  customerId,
  setCustomerId,
  branchId,
  setBranchId,
  barberId,
  setBarberId,
  serviceId,
  setServiceId,
  date,
  setDate,
  onRegisterCustomer,
  onCheckAvailability,
  loadingSlots,
  minDate,
  maxDate,
}) {
  const selectClass =
    "h-12 w-full appearance-none rounded-xl border border-[#485F4D]/70 bg-[#172132] px-3.5 pr-10 text-sm font-medium text-white outline-none transition hover:border-[#8FA985] focus:border-[#8FA985] focus:ring-4 focus:ring-[#8FA985]/10 disabled:cursor-not-allowed disabled:border-[#485F4D]/40 disabled:bg-[#172132]/60 disabled:text-[#64748B]";

  return (
    <section className="overflow-hidden rounded-3xl border border-[#485F4D] bg-[#1E2B3B] shadow-xl">
      {/* Header */}
      <div className="walkin-form-header border-b border-[#485F4D]/70 px-5 py-5 sm:px-7">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-lg">
            <Scissors className="size-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-extrabold tracking-tight text-[var(--text-main)] sm:text-lg">
                Appointment Details
              </h2>

              <span className="rounded-full border border-[var(--border-color)] bg-[var(--bg-elevated)] px-2 py-0.5 text-[10px] font-bold text-[var(--accent-color)]">
                Required
              </span>
            </div>

            <p className="mt-1 text-xs leading-5 text-[var(--text-muted)] sm:text-sm">
              {isAdmin
                ? "Choose the customer, branch, barber, service and appointment date."
                : "Select your preferred barber, service and appointment date."}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-5 sm:p-7">
        <div className="grid gap-x-5 gap-y-6 md:grid-cols-2">
          {/* Customer */}
          {isAdmin && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="appointment-customer"
                  className="flex items-center gap-2 text-xs font-bold text-[#CAD5E2]"
                >
                  <span className="flex size-6 items-center justify-center rounded-lg bg-[#4A6741]/25 text-[#8FA985]">
                    <User className="size-3.5" />
                  </span>
                  Customer
                </label>

                <button
                  type="button"
                  onClick={onRegisterCustomer}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-bold text-[#8FA985] transition hover:bg-[#4A6741]/20 hover:text-white"
                >
                  <UserPlus className="size-3.5" />
                  New Customer
                </button>
              </div>

              <div className="relative">
                <select
                  id="appointment-customer"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select customer</option>

                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name} — {customer.phone || customer.email}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#90A1B9]" />
              </div>

              <p className="text-[11px] text-[#64748B]">
                Select an existing customer or register a new one.
              </p>
            </div>
          )}

          {/* Branch */}
          {isAdmin && (
            <div className="space-y-2">
              <label
                htmlFor="appointment-branch"
                className="flex items-center gap-2 text-xs font-bold text-[#CAD5E2]"
              >
                <span className="flex size-6 items-center justify-center rounded-lg bg-[#4A6741]/25 text-[#8FA985]">
                  <Building2 className="size-3.5" />
                </span>
                Branch
              </label>

              <div className="relative">
                <select
                  id="appointment-branch"
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select branch</option>

                  {branches
                    .filter((branch) => branch?.isActive !== false)
                    .map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
                      </option>
                    ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#90A1B9]" />
              </div>

              <p className="text-[11px] text-[#64748B]">
                Barbers available at this branch will appear next.
              </p>
            </div>
          )}

          {/* Barber */}
          <div className="space-y-2">
            <label
              htmlFor="appointment-barber"
              className="flex items-center gap-2 text-xs font-bold text-[#CAD5E2]"
            >
              <span className="flex size-6 items-center justify-center rounded-lg bg-[#4A6741]/25 text-[#8FA985]">
                <Scissors className="size-3.5" />
              </span>
              Barber / Stylist
            </label>

            <div className="relative">
              <select
                id="appointment-barber"
                value={barberId}
                onChange={(e) => setBarberId(e.target.value)}
                disabled={!branchId}
                className={selectClass}
              >
                <option value="">
                  {branchId ? "Choose barber" : "Select branch first"}
                </option>

                {branchBarbers.map((barber) => (
                  <option key={barber._id} value={barber._id}>
                    {barber.userId?.name || "Unknown Barber"}
                    {barber.experienceYears
                      ? ` (${barber.experienceYears} yrs exp)`
                      : ""}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#90A1B9]" />
            </div>

            {branchId && branchBarbers.length === 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-950/30 px-3 py-2 text-[11px] font-medium text-amber-300">
                <span className="size-1.5 rounded-full bg-amber-400" />
                No active barber is currently available at this branch.
              </div>
            )}
          </div>

          {/* Service */}
          <div className="space-y-2">
            <label
              htmlFor="appointment-service"
              className="flex items-center gap-2 text-xs font-bold text-[#CAD5E2]"
            >
              <span className="flex size-6 items-center justify-center rounded-lg bg-[#4A6741]/25 text-[#8FA985]">
                <Scissors className="size-3.5" />
              </span>
              Service
            </label>

            <div className="relative">
              <select
                id="appointment-service"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                disabled={!barberId}
                className={selectClass}
              >
                <option value="">
                  {barberId ? "Select service" : "Select barber first"}
                </option>

                {services
                  .filter((service) => service?.isActive !== false)
                  .map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name} — {service.duration} mins (Rs.{" "}
                      {service.price})
                    </option>
                  ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#90A1B9]" />
            </div>

            {barberId && services.length === 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-950/30 px-3 py-2 text-[11px] font-medium text-amber-300">
                <span className="size-1.5 rounded-full bg-amber-400" />
                No active services found for this barber.
              </div>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label
              htmlFor="appointment-date"
              className="flex items-center gap-2 text-xs font-bold text-[#CAD5E2]"
            >
              <span className="flex size-6 items-center justify-center rounded-lg bg-[#4A6741]/25 text-[#8FA985]">
                <CalendarDays className="size-3.5" />
              </span>
              Appointment Date
            </label>

            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#90A1B9]" />

              <input
                id="appointment-date"
                type="date"
                value={date}
                min={minDate}
                max={maxDate}
                onChange={(e) => setDate(e.target.value)}
                disabled={!serviceId}
                className="h-12 w-full rounded-xl border border-[#485F4D]/70 bg-[#172132] py-2.5 pl-10 pr-4 text-sm font-medium text-white outline-none transition hover:border-[#8FA985] focus:border-[#8FA985] focus:ring-4 focus:ring-[#8FA985]/10 disabled:cursor-not-allowed disabled:bg-[#172132]/60 disabled:text-[#64748B]"
              />
            </div>

            <p className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
              <Clock3 className="size-3" />
              Choose a date to find available appointment times.
            </p>
          </div>

          {/* Availability */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={onCheckAvailability}
              disabled={
                loadingSlots ||
                !branchId ||
                !barberId ||
                !serviceId ||
                !date
              }
              className="group h-12 w-full rounded-xl bg-gradient-to-r from-[#4A6741] to-[#6B8C5E] px-5 text-sm font-bold text-white shadow-lg shadow-[#4A6741]/20 transition-all hover:brightness-110 hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {loadingSlots ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Checking available slots...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Check className="size-4" />
                  Check Available Slots
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Flow */}
        <div className="mt-7 hidden border-t border-[#485F4D]/50 pt-5 md:block">
          <div className="flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-wider">
            <span className="text-[#CAD5E2]">Customer</span>
            <ArrowRight className="size-3 text-[#64748B]" />
            <span className="text-[#CAD5E2]">Branch</span>
            <ArrowRight className="size-3 text-[#64748B]" />
            <span className="text-[#CAD5E2]">Barber</span>
            <ArrowRight className="size-3 text-[#64748B]" />
            <span className="text-[#CAD5E2]">Service</span>
            <ArrowRight className="size-3 text-[#64748B]" />
            <span className="text-[#CAD5E2]">Date</span>
            <ArrowRight className="size-3 text-[#64748B]" />
            <span className="text-[#8FA985]">Available Slots</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WalkInAppointmentForm;
