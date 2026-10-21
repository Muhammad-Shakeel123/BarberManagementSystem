import { ExternalLink, MapPin, Navigation, Globe2 } from "lucide-react";

function BranchLocation({ branch }) {
  const coordinates = branch.address?.coordinates || {};
  const { lat, lng } = coordinates;

  const hasLocation = lat !== undefined && lng !== undefined;

  const openLocation = () => {
    if (!hasLocation) return;

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="relative overflow-hidden rounded-[20px] border border-[#485F4D] bg-[#1E2B3B] p-5 shadow-xl sm:p-6">
      <div className="pointer-events-none absolute -right-14 -top-14 size-48 rounded-full bg-[#4A6741]/15 blur-3xl" />

      <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3.5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-md">
            <MapPin className="size-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-white">
                Branch Location
              </h2>

              <span className="inline-flex items-center gap-1 rounded-full border border-[#485F4D] bg-[#172132] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#8FA985]">
                <Globe2 className="size-3" />
                Location
              </span>
            </div>

            <p className="mt-1.5 text-xs font-medium text-[#90A1B9]">
              {branch.address?.street || "Address not available"}
            </p>

            {hasLocation && (
              <p className="mt-1 text-[10px] font-medium text-[#64748B]">
                Coordinates: {lat}, {lng}
              </p>
            )}
          </div>
        </div>

        {hasLocation ? (
          <button
            type="button"
            onClick={openLocation}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#485F4D] bg-[#172132] px-4 py-2.5 text-xs font-bold text-[#CAD5E2] transition hover:border-[#8FA985] hover:bg-[#4A6741]/20 hover:text-white active:scale-95"
          >
            <Navigation className="size-3.5 text-[#8FA985]" />
            Open in Google Maps
            <ExternalLink className="size-3" />
          </button>
        ) : (
          <span className="inline-flex items-center rounded-xl border border-[#485F4D] bg-[#172132] px-3 py-2 text-[10px] font-semibold text-[#64748B]">
            Coordinates unavailable
          </span>
        )}
      </div>
    </div>
  );
}

export default BranchLocation;
