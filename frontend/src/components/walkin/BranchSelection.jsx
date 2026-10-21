import {
  MapPin,
  Phone,
  Clock3,
  Search,
  CheckCircle2,
  Navigation,
  Sparkles,
  Building2,
  ArrowUpRight,
  Users,
  Armchair,
} from "lucide-react";
import { useMemo, useState } from "react";

function BranchSelection({
  branches,
  selectedBranchId,
  onSelectBranch,
  showAllBranches,
  onShowAllBranches,
  onShowNearbyBranches,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  /*
   * Search branches
   */
  const filteredBranches = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return branches;
    }

    return branches.filter((branch) => {
      const name = branch?.name?.toLowerCase() || "";
      const code = branch?.code?.toLowerCase() || "";
      const city = branch?.address?.city?.toLowerCase() || "";
      const state = branch?.address?.state?.toLowerCase() || "";
      const street = branch?.address?.street?.toLowerCase() || "";

      return (
        name.includes(search) ||
        code.includes(search) ||
        city.includes(search) ||
        state.includes(search) ||
        street.includes(search)
      );
    });
  }, [branches, searchTerm]);

  /*
   * Show only 4 nearest branches initially.
   *
   * Backend already returns branches in nearest -> farthest order
   * because it uses MongoDB $geoNear.
   *
   * When searching, show all matching results.
   */
  const visibleBranches = useMemo(() => {
    if (showAllBranches || searchTerm.trim()) {
      return filteredBranches;
    }

    return filteredBranches.slice(0, 4);
  }, [filteredBranches, showAllBranches, searchTerm]);

  /*
   * Check whether branch has valid coordinates
   */
  const hasLocation = (branch) => {
    const coordinates = branch?.location?.coordinates;

    return (
      Array.isArray(coordinates) &&
      coordinates.length >= 2 &&
      coordinates[0] != null &&
      coordinates[1] != null
    );
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-[#485F4D] bg-[#1E2B3B] shadow-xl">
      {/* =========================================================
          HEADER
      ========================================================== */}
      <div className="walkin-form-header border-b border-[#485F4D]/70 bg-gradient-to-r from-[#172132] via-[#1E2B3B] to-[#24332F] px-5 py-6 sm:px-7 sm:py-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-md shadow-[#4A6741]/25">
              <Building2 className="size-5" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                  {showAllBranches
                    ? "Choose Your Salon"
                    : "Find a Salon Near You"}
                </h2>

                {!showAllBranches && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#485F4D] bg-[#4A6741]/20 px-2.5 py-1 text-[10px] font-bold text-[#8FA985]">
                    <Navigation className="size-3" />
                    Nearby
                  </span>
                )}
              </div>

              <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-[#90A1B9] sm:text-sm">
                {showAllBranches
                  ? "Browse all available salon branches and choose the one that works best for you."
                  : "We've listed the closest salon locations first to make your visit more convenient."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={showAllBranches ? onShowNearbyBranches : onShowAllBranches}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#485F4D] bg-[#172132] px-4 text-xs font-bold text-[#CAD5E2] shadow-sm transition-all hover:border-[#8FA985] hover:bg-[#1D293D] hover:text-white active:scale-[0.98]"
          >
            {showAllBranches ? (
              <>
                <Navigation className="size-3.5 text-[#8FA985]" />
                Show Nearby
              </>
            ) : (
              <>
                <Building2 className="size-3.5 text-[#8FA985]" />
                Browse All Branches
              </>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#90A1B9]" />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by branch, city, street or branch code..."
            className="h-12 w-full rounded-2xl border border-[#485F4D]/70 bg-[#172132] pl-11 pr-11 text-sm font-medium text-white outline-none transition-all placeholder:text-[#90A1B9] hover:border-[#8FA985] focus:border-[#8FA985] focus:ring-2 focus:ring-[#8FA985]/20"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-[#90A1B9] transition hover:bg-[#1D293D] hover:text-white"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* =========================================================
          CONTENT
      ========================================================== */}
      <div className="p-5 sm:p-7">
        {visibleBranches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#485F4D] bg-[#172132]/60 px-6 py-14 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#485F4D] bg-[#172132] text-[#90A1B9]">
              <Search className="size-6" />
            </div>

            <h3 className="mt-4 text-sm font-bold text-white">
              No salons found
            </h3>

            <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-[#90A1B9]">
              We couldn't find a branch matching your search. Try another city,
              branch name, street or code.
            </p>

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="mt-4 rounded-xl bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] border border-[#8FA985]/40 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:brightness-110 active:scale-95"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results indicator */}
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8FA985]">
                  Available Locations
                </p>

                <p className="mt-1 text-sm font-bold text-white">
                  {visibleBranches.length}{" "}
                  {visibleBranches.length === 1 ? "branch" : "branches"}{" "}
                  available
                </p>
              </div>

              {!showAllBranches && !searchTerm.trim() && (
                <span className="hidden text-xs font-medium text-[#90A1B9] sm:block">
                  Closest locations shown first
                </span>
              )}
            </div>

            {/* Branch Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {visibleBranches.map((branch, index) => {
                const isSelected = selectedBranchId === branch._id;

                const isNearest =
                  !showAllBranches &&
                  !searchTerm.trim() &&
                  index === 0 &&
                  typeof branch.distanceInKm === "number";

                const locationAvailable = hasLocation(branch);

                return (
                  <article
                    key={branch._id}
                    onClick={() => onSelectBranch(branch)}
                    className={`group relative cursor-pointer overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
                      isSelected
                        ? "border-[#8FA985] bg-gradient-to-br from-[#1E2B3B] via-[#172132] to-[#24332F] shadow-lg shadow-[#4A6741]/20 ring-1 ring-[#8FA985]/30"
                        : isNearest
                          ? "border-[#485F4D] bg-[#1D293D80] shadow-md hover:-translate-y-0.5 hover:border-[#8FA985] hover:bg-[#1D293D] hover:shadow-lg"
                          : "border-[#485F4D]/70 bg-[#172132] shadow-md hover:-translate-y-0.5 hover:border-[#8FA985] hover:bg-[#1D293D] hover:shadow-lg"
                    }`}
                  >
                    {isNearest && (
                      <div className="absolute right-4 top-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#485F4D] bg-[#4A6741]/20 px-2.5 py-1 text-[10px] font-extrabold text-[#8FA985]">
                          <Sparkles className="size-3 text-[#4bad46]" />
                          Closest to You
                        </span>
                      </div>
                    )}

                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 pr-2">
                        <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-xs">
                          <Building2 className="size-[18px]" />
                        </div>

                        <h3 className="truncate text-base font-extrabold tracking-tight text-white transition-colors group-hover:text-[#8FA985]">
                          {branch.name}
                        </h3>

                        {branch.code && (
                          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                            Branch #{branch.code}
                          </p>
                        )}
                      </div>

                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-all ${
                          isSelected
                            ? "bg-[#4bad46] text-white shadow-md shadow-[#4bad46]/20"
                            : "border border-[#485F4D] bg-[#172132] text-transparent group-hover:border-[#8FA985]"
                        }`}
                      >
                        <CheckCircle2
                          className={`size-5 ${
                            isSelected ? "opacity-100" : "opacity-0"
                          }`}
                        />

                        {!isSelected && (
                          <span className="absolute size-3 rounded-full border-2 border-[#485F4D]" />
                        )}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="mt-5 rounded-xl border border-[#485F4D]/50 bg-[#172132]/90 p-3.5">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#4A6741]/20 text-[#8FA985]">
                          <MapPin className="size-3.5" />
                        </div>

                        <div className="min-w-0 text-xs">
                          {branch.address?.street && (
                            <p className="leading-relaxed text-[#CAD5E2]">
                              {branch.address.street}
                            </p>
                          )}

                          <p className="mt-0.5 font-semibold leading-relaxed text-[#90A1B9]">
                            {[
                              branch.address?.city,
                              branch.address?.state,
                              branch.address?.country,
                            ]
                              .filter(Boolean)
                              .join(", ") || "Location details unavailable"}
                          </p>
                        </div>
                      </div>

                      {locationAvailable && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${branch.location.coordinates[1]},${branch.location.coordinates[0]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="mt-3 inline-flex items-center gap-1.5 pl-9 text-[11px] font-bold text-[#8FA985] transition hover:text-white hover:underline"
                        >
                          Open in Google Maps
                          <ArrowUpRight className="size-3" />
                        </a>
                      )}
                    </div>

                    {/* Info Pills */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {typeof branch.distanceInKm === "number" && (
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                            isNearest
                              ? "border-[#485F4D] bg-[#4A6741]/20 text-[#8FA985]"
                              : "border-[#485F4D]/60 bg-[#172132] text-[#90A1B9]"
                          }`}
                        >
                          <Navigation className="size-3" />

                          {branch.distanceInKm < 1
                            ? `${Math.round(branch.distanceInKm * 1000)} m away`
                            : `${branch.distanceInKm.toFixed(1)} km away`}
                        </span>
                      )}

                      {branch.workingHours?.start &&
                        branch.workingHours?.end && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#485F4D]/60 bg-[#172132] px-2.5 py-1 text-[10px] font-semibold text-[#90A1B9]">
                            <Clock3 className="size-3 text-[#8FA985]" />
                            {branch.workingHours.start} -{" "}
                            {branch.workingHours.end}
                          </span>
                        )}

                      {branch.phone && (
                        <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#485F4D]/60 bg-[#172132] px-2.5 py-1 text-[10px] font-semibold text-[#90A1B9]">
                          <Phone className="size-3 shrink-0 text-[#8FA985]" />
                          <span className="truncate">{branch.phone}</span>
                        </span>
                      )}
                    </div>

                    {/* Capacity */}
                    {branch.capacity && (
                      <div className="mt-4 flex items-center gap-4 border-t border-[#485F4D]/50 pt-3.5">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#90A1B9]">
                          <Users className="size-3.5 text-[#8FA985]" />
                          {branch.capacity.totalBarbers ?? 0} Barbers
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#90A1B9]">
                          <Armchair className="size-3.5 text-[#8FA985]" />
                          {branch.capacity.totalChairs ?? 0} Chairs
                        </span>
                      </div>
                    )}

                    {/* Action */}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onSelectBranch(branch);
                      }}
                      className={`mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-extrabold transition-all active:scale-[0.98] ${
                        isSelected
                          ? "bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-md shadow-[#4A6741]/20 hover:brightness-110"
                          : "border border-[#485F4D] bg-[#172132] text-[#CAD5E2] hover:border-[#8FA985] hover:bg-[#1D293D] hover:text-white"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="size-3.5" />
                          Branch Selected
                        </>
                      ) : (
                        <>
                          Select This Branch
                          <ArrowUpRight className="size-3.5" />
                        </>
                      )}
                    </button>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {/* Bottom View All */}
        {!showAllBranches && !searchTerm.trim() && branches.length > 4 && (
          <div className="mt-6 flex justify-center border-t border-[#485F4D]/60 pt-5">
            <button
              type="button"
              onClick={onShowAllBranches}
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-[#8FA985] transition hover:bg-[#1D293D] hover:text-white"
            >
              View all {branches.length} available branches
              <ArrowUpRight className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default BranchSelection;
