import { MapPin } from "lucide-react";

function EditBranchAddress({ form, onChange, loading }) {
  return (
    <section>
      <div className="mb-4 flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-lime-400/30 bg-lime-400/10">
          <MapPin className="size-4 text-lime-300" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">
            Branch Address
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Update the physical location and address details.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Street */}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            Street
          </label>

          <input
            type="text"
            value={form.address.street}
            onChange={(e) => onChange("street", e.target.value)}
            disabled={loading}
            placeholder="Main Road"
            className="w-full rounded-lg border border-slate-700 bg-slate-800/70 px-3.5 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-lime-400/60 focus:ring-1 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* City */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            City
          </label>

          <input
            type="text"
            value={form.address.city}
            onChange={(e) => onChange("city", e.target.value)}
            disabled={loading}
            placeholder="Mardan"
            className="w-full rounded-lg border border-slate-700 bg-slate-800/70 px-3.5 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-lime-400/60 focus:ring-1 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* State */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            State / Province
            <span className="ml-1 font-normal text-slate-600">
              (Optional)
            </span>
          </label>

          <input
            type="text"
            value={form.address.state}
            onChange={(e) => onChange("state", e.target.value)}
            disabled={loading}
            placeholder="KPK"
            className="w-full rounded-lg border border-slate-700 bg-slate-800/70 px-3.5 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-lime-400/60 focus:ring-1 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Zip */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            Zip Code
            <span className="ml-1 font-normal text-slate-600">
              (Optional)
            </span>
          </label>

          <input
            type="text"
            value={form.address.zipCode}
            onChange={(e) => onChange("zipCode", e.target.value)}
            disabled={loading}
            placeholder="23200"
            className="w-full rounded-lg border border-slate-700 bg-slate-800/70 px-3.5 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-lime-400/60 focus:ring-1 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Country */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            Country
          </label>

          <input
            type="text"
            value={form.address.country}
            onChange={(e) => onChange("country", e.target.value)}
            disabled={loading}
            placeholder="Pakistan"
            className="w-full rounded-lg border border-slate-700 bg-slate-800/70 px-3.5 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-lime-400/60 focus:ring-1 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
    </section>
  );
}

export default EditBranchAddress;