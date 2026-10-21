import { CheckCircle2, MapPin } from "lucide-react";

function BranchAddress({
  form,
  onAddressChange,
  onCoordinatesChange,
  loading,
}) {
  const coordinates = form.address.coordinates;

  const hasCoordinates =
    coordinates.lat !== null &&
    coordinates.lat !== undefined &&
    coordinates.lng !== null &&
    coordinates.lng !== undefined;

  return (
    <section>
      <div className="mb-5">
        <h3 className="text-base font-semibold text-white">
          Branch Address
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          Add the branch address and exact map coordinates.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Street */}
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Street
          </label>

          <input
            type="text"
            value={form.address.street}
            onChange={(e) => onAddressChange("street", e.target.value)}
            placeholder="Main Road"
            required
            disabled={loading}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-emerald-400/60 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* City */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            City
          </label>

          <input
            type="text"
            value={form.address.city}
            onChange={(e) => onAddressChange("city", e.target.value)}
            placeholder="Mardan"
            required
            disabled={loading}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-emerald-400/60 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* State */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            State / Province{" "}
            <span className="font-normal text-slate-500">(Optional)</span>
          </label>

          <input
            type="text"
            value={form.address.state}
            onChange={(e) => onAddressChange("state", e.target.value)}
            placeholder="KPK"
            disabled={loading}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-emerald-400/60 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Zip */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Zip Code{" "}
            <span className="font-normal text-slate-500">(Optional)</span>
          </label>

          <input
            type="text"
            value={form.address.zipCode}
            onChange={(e) => onAddressChange("zipCode", e.target.value)}
            placeholder="23200"
            disabled={loading}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-emerald-400/60 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Country */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Country
          </label>

          <input
            type="text"
            value={form.address.country}
            onChange={(e) => onAddressChange("country", e.target.value)}
            disabled={loading}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 text-sm text-white outline-none transition focus:border-emerald-400/60 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Coordinates */}
        <div className="rounded-2xl border border-emerald-900/70 bg-slate-800/70 p-5 sm:col-span-2">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-500/10">
              <MapPin className="size-5 text-emerald-300" />
            </div>

            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-white">
                Branch Location
              </h4>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Enter the exact latitude and longitude of this branch.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-400">
                Latitude
              </label>

              <input
                type="number"
                step="any"
                value={coordinates.lat ?? ""}
                onChange={(e) =>
                  onCoordinatesChange(
                    "lat",
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
                placeholder="e.g. 34.0151"
                required
                disabled={loading}
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-slate-400">
                Longitude
              </label>

              <input
                type="number"
                step="any"
                value={coordinates.lng ?? ""}
                onChange={(e) =>
                  onCoordinatesChange(
                    "lng",
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
                placeholder="e.g. 71.5249"
                required
                disabled={loading}
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          {hasCoordinates && (
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-300">
              <CheckCircle2 className="size-4" />
              Branch location coordinates added
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default BranchAddress;