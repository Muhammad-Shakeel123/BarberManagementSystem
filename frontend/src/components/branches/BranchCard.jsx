import {
  Armchair,
  Building2,
  ChevronRight,
  Clock3,
  Footprints,
  Globe2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Scissors,
  Trash2,
} from "lucide-react";

function BranchCard({ branch, onClick, onEdit, onDelete, deleting = false }) {
  const address = branch.address || {};
  const workingHours = branch.workingHours || {};
  const capacity = branch.capacity || {};
  const settings = branch.settings || {};

  const hasCoordinates =
    address.coordinates?.lat !== undefined &&
    address.coordinates?.lng !== undefined;

  const openLocation = (event) => {
    event.stopPropagation();

    if (!hasCoordinates) return;

    const { lat, lng } = address.coordinates;

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleEdit = (event) => {
    event.stopPropagation();

    if (!onEdit || !branch.isActive || deleting) return;

    onEdit(branch);
  };

  const handleDelete = (event) => {
    event.stopPropagation();

    if (!onDelete || !branch.isActive || deleting) return;

    onDelete(branch);
  };

  return (
    <article
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#485F4D] bg-[#1b2939] shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#6B8C5E] hover:shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
    >
      <div className="p-6">
        {/* =======================================================
            HEADER
        ======================================================= */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3.5">
            {/* Branch Icon */}
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#6f965d]/45 bg-[#263b32] transition-all duration-300 group-hover:border-[#7da36c] group-hover:bg-[#304936]">
              <Building2 className="size-5.5 text-[#9bb88d]" />
            </div>

            {/* Name */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-lg font-semibold tracking-tight text-white">
                  {branch.name || "Unnamed Branch"}
                </h2>
              </div>

              <div className="mt-1.5 flex items-center gap-2">
                <span className="rounded-md border border-slate-600/60 bg-[#172333] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {branch.code || "N/A"}
                </span>

                <span className="size-1 rounded-full bg-slate-600" />

                <span className="text-[11px] text-slate-500">
                  Branch Location
                </span>
              </div>
            </div>
          </div>

          {/* Status */}
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
              branch.isActive
                ? "border-[#5f814f]/50 bg-[#263b32] text-[#9fbc91]"
                : "border-slate-600/60 bg-[#202d3d] text-slate-400"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                branch.isActive
                  ? "bg-[#54b948] shadow-[0_0_7px_rgba(84,185,72,0.5)]"
                  : "bg-slate-500"
              }`}
            />

            {branch.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* =======================================================
            LOCATION
        ======================================================= */}
        <button
          type="button"
          onClick={openLocation}
          disabled={!hasCoordinates}
          className={`-mx-2 mt-5 flex w-[calc(100%+1rem)] items-start gap-3 rounded-xl p-2.5 text-left transition-all ${
            hasCoordinates
              ? "cursor-pointer hover:bg-[#223247]"
              : "cursor-default"
          }`}
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-600/60 bg-[#223247]">
            <MapPin className="size-4 text-[#8ea782]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-200">
                {address.city || "City not available"}
              </p>

              {hasCoordinates && (
                <span className="rounded-full border border-[#5f814f]/40 bg-[#263b32] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#91ad83]">
                  Map
                </span>
              )}
            </div>

            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
              {[address.street, address.state, address.country]
                .filter(Boolean)
                .join(", ") || "Address not available"}
            </p>

            {hasCoordinates && (
              <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#91ad83] transition-colors group-hover:text-[#abc99d]">
                Open in Google Maps
                <ChevronRight className="size-3" />
              </span>
            )}
          </div>
        </button>

        {/* =======================================================
            CONTACT
        ======================================================= */}
        {(branch.phone || branch.email) && (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {branch.phone && (
              <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-slate-700/60 bg-[#172333] px-3 py-2.5">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#223247]">
                  <Phone className="size-3.5 text-slate-400" />
                </div>

                <span className="truncate text-xs font-medium text-slate-300">
                  {branch.phone}
                </span>
              </div>
            )}

            {branch.email && (
              <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-slate-700/60 bg-[#172333] px-3 py-2.5">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#223247]">
                  <Mail className="size-3.5 text-slate-400" />
                </div>

                <span className="truncate text-xs font-medium text-slate-300">
                  {branch.email}
                </span>
              </div>
            )}
          </div>
        )}

        {/* =======================================================
            WORKING HOURS
        ======================================================= */}
        <div className="mt-5 rounded-2xl border border-slate-700/60 bg-[#202f40] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl border border-slate-600/60 bg-[#26374a]">
                <Clock3 className="size-4 text-[#91a783]" />
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Working Hours
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-200">
                  {workingHours.start || "--:--"}{" "}
                  <span className="mx-1 text-slate-600">—</span>{" "}
                  {workingHours.end || "--:--"}
                </p>
              </div>
            </div>

            <span className="hidden rounded-full border border-slate-600/50 bg-[#172333] px-2 py-1 text-[10px] font-medium text-slate-500 sm:block">
              Daily Schedule
            </span>
          </div>

          {workingHours.breaks?.length > 0 && (
            <div className="mt-4 border-t border-slate-700/60 pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Breaks
              </p>

              <p className="mt-1.5 text-xs text-slate-400">
                {workingHours.breaks
                  .map((item) => `${item.start} - ${item.end}`)
                  .join(", ")}
              </p>
            </div>
          )}
        </div>

        {/* =======================================================
            CAPACITY
        ======================================================= */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {/* Chairs */}
          <div className="rounded-xl border border-slate-700/60 bg-[#172333] p-4 transition-colors hover:border-slate-600">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-[#223247]">
                  <Armchair className="size-3.5 text-slate-400" />
                </div>

                <span className="text-xs font-medium text-slate-400">
                  Chairs
                </span>
              </div>

              <span className="text-lg font-semibold text-white">
                {capacity.totalChairs ?? 0}
              </span>
            </div>

            <p className="mt-2 text-[10px] text-slate-500">
              Registered capacity
            </p>
          </div>

          {/* Barbers */}
          <div className="rounded-xl border border-slate-700/60 bg-[#172333] p-4 transition-colors hover:border-slate-600">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-[#223247]">
                  <Scissors className="size-3.5 text-[#91a783]" />
                </div>

                <span className="text-xs font-medium text-slate-400">
                  Barbers
                </span>
              </div>

              <span className="text-lg font-semibold text-white">
                {capacity.totalBarbers ?? 0}
              </span>
            </div>

            <p className="mt-2 text-[10px] text-slate-500">
              Registered capacity
            </p>
          </div>
        </div>

        {/* =======================================================
            FEATURES
        ======================================================= */}
        {(settings.allowOnlineBooking || settings.allowWalkIn) && (
          <div className="mt-5 flex flex-wrap gap-2">
            {settings.allowOnlineBooking && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#536b59]/60 bg-[#263b32] px-2.5 py-1.5 text-[11px] font-semibold text-[#9fbc91]">
                <Globe2 className="size-3.5" />
                Online Booking
              </span>
            )}

            {settings.allowWalkIn && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-700/30 bg-amber-950/20 px-2.5 py-1.5 text-[11px] font-semibold text-amber-400">
                <Footprints className="size-3.5" />
                Walk-in
              </span>
            )}
          </div>
        )}

        {/* =======================================================
            ACTIONS
        ======================================================= */}
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-700/60 pt-4">
          <div className="flex items-center gap-2">
            {/* Edit */}
            <button
              type="button"
              onClick={handleEdit}
              disabled={!branch.isActive || deleting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600/70 bg-[#223247] px-3 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-slate-500 hover:bg-[#293a4f] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Pencil className="size-3.5" />
              Edit
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={handleDelete}
              disabled={!branch.isActive || deleting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-900/50 bg-red-950/15 px-3 py-2 text-xs font-semibold text-red-400 transition-all hover:border-red-800/60 hover:bg-red-950/30 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 className="size-3.5" />

              {deleting ? "Deactivating..." : "Deactivate"}
            </button>
          </div>

          {/* Details */}
          <div className="flex items-center gap-2">
            <span className="hidden text-xs font-medium text-slate-500 sm:block">
              View details
            </span>

            <div className="flex size-8 items-center justify-center rounded-full border border-slate-600/60 bg-[#223247] transition-all duration-300 group-hover:border-[#6f965d]/60 group-hover:bg-[#668d57]">
              <ChevronRight className="size-4 text-slate-400 transition-colors group-hover:text-white" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default BranchCard;
