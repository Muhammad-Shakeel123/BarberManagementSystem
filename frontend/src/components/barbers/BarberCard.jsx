import {
  ArrowRight,
  Pencil,
  Trash2,
  Clock,
  Sparkles,
  Phone,
  Award,
} from "lucide-react";

function BarberCard({
  barber,
  onEdit,
  onDelete,
  onAvailability,
  onAppointments,
}) {
  const user = barber?.userId;

  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "B";

  return (
    <div className="group relative overflow-visible rounded-[20px] border border-[#485F4D] bg-[#1D293D] p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#6B8C5E] hover:bg-[#1E2B3B] hover:shadow-2xl">
      {/* Glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-[#4A6741]/10 blur-3xl transition-opacity group-hover:opacity-100" />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-xs font-extrabold text-white shadow-lg shadow-[#4A6741]/20">
            {initials}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-extrabold text-white">
              {user?.name || "Stylist"}
            </h3>

            <p className="truncate text-xs font-medium text-[#708198]">
              {user?.email || "No email"}
            </p>
          </div>
        </div>

        {/* Status */}
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
            barber?.isActive
              ? "border-[#485F4D] bg-[#24372E] text-[#8FA985]"
              : "border-[#3B4656] bg-[#172132] text-[#708198]"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              barber?.isActive ? "bg-[#4bad46]" : "bg-[#62738A]"
            }`}
          />
          {barber?.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Branch / Experience */}
      <div className="relative mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#485F4D]/60 bg-[#172132] px-2.5 py-1.5 text-[11px] font-semibold text-[#CAD5E2]">
          <span className="size-1.5 rounded-full bg-[#6B8C5E]" />
          {barber?.branchId?.name || "Unassigned Branch"}
        </span>

        {typeof barber?.experienceYears === "number" && (
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#485F4D]/60 bg-[#24372E] px-2.5 py-1.5 text-[11px] font-semibold text-[#8FA985]">
            <Sparkles className="size-3" />
            {barber.experienceYears} yrs exp
          </span>
        )}
      </div>

      {/* Specialties */}
      {barber?.specialties?.length > 0 && (
        <div className="relative mt-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#708198]">
            Specialties
          </p>

          <div className="flex flex-wrap gap-1.5">
            {barber.specialties.slice(0, 3).map((service) => (
              <span
                key={service._id}
                className="rounded-lg border border-[#485F4D]/50 bg-[#172132] px-2 py-1 text-[10px] font-semibold text-[#90A1B9]"
              >
                {service.name}
              </span>
            ))}

            {barber.specialties.length > 3 && (
              <span className="rounded-lg border border-[#485F4D]/50 bg-[#172132] px-2 py-1 text-[10px] font-semibold text-[#708198]">
                +{barber.specialties.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="relative mt-5 flex gap-2 border-t border-[#485F4D]/60 pt-4">
        <button
          type="button"
          onClick={() => onEdit?.(barber)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#485F4D] bg-[#172132] py-2.5 text-xs font-bold text-[#CAD5E2] transition hover:border-[#6B8C5E] hover:bg-[#24372E] hover:text-white active:scale-95"
        >
          <Pencil className="size-3.5" />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onAvailability?.(barber)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#485F4D] bg-[#172132] py-2.5 text-xs font-bold text-[#CAD5E2] transition hover:border-[#6B8C5E] hover:bg-[#1E2B3B] hover:text-white active:scale-95"
        >
          <Clock className="size-3.5 text-[#8FA985]" />
          Slots
        </button>

        {barber?.isActive && (
          <button
            type="button"
            onClick={() => onDelete?.(barber)}
            className="flex items-center justify-center rounded-xl border border-rose-500/30 bg-rose-950/20 px-3 text-xs font-bold text-rose-400 transition hover:border-rose-400/50 hover:bg-rose-950/40 hover:text-rose-300 active:scale-95"
            title="Deactivate Barber"
          >
            <Trash2 className="size-3.5" />
          </button>
        )}
      </div>

      {/* Schedule */}
      <button
        type="button"
        onClick={() => onAppointments?.(barber)}
        className="relative mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold text-[#8FA985] transition hover:bg-[#24372E] hover:text-white active:scale-[0.98]"
      >
        <span>View Barber Schedule</span>
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* Hover Profile */}
      <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-80 -translate-x-1/2 translate-y-2 rounded-[20px] border border-[#485F4D] bg-[#172132] p-5 opacity-0 shadow-2xl transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
        <div className="mb-4 border-b border-[#485F4D]/60 pb-3">
          <h4 className="text-sm font-bold text-white">Stylist Profile</h4>

          <p className="mt-0.5 text-xs font-medium text-[#708198]">
            {user?.name || "Unknown Barber"}
          </p>
        </div>

        <div className="space-y-3 text-xs">
          {/* Phone */}
          <div className="flex gap-3">
            <Phone className="mt-0.5 size-3.5 shrink-0 text-[#8FA985]" />

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#708198]">
                Phone
              </p>
              <p className="mt-0.5 font-semibold text-[#CAD5E2]">
                {user?.phone || "Not provided"}
              </p>
            </div>
          </div>

          {/* Working Hours */}
          <div className="flex gap-3">
            <Clock className="mt-0.5 size-3.5 shrink-0 text-[#8FA985]" />

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#708198]">
                Working Hours
              </p>

              <p className="mt-0.5 font-semibold text-[#CAD5E2]">
                {barber?.workingHours?.start || "--"} -{" "}
                {barber?.workingHours?.end || "--"}
              </p>
            </div>
          </div>

          {/* Qualification */}
          {barber?.qualification && (
            <div className="flex gap-3">
              <Award className="mt-0.5 size-3.5 shrink-0 text-[#8FA985]" />

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#708198]">
                  Qualification
                </p>

                <p className="mt-0.5 font-semibold text-[#CAD5E2]">
                  {barber.qualification}
                </p>
              </div>
            </div>
          )}

          {/* Bio */}
          {barber?.bio && (
            <div className="border-t border-[#485F4D]/50 pt-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#708198]">
                Bio
              </p>

              <p className="mt-1 leading-relaxed text-[#90A1B9]">
                {barber.bio}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BarberCard;
