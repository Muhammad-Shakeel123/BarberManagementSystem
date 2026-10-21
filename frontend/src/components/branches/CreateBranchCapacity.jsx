import { Armchair, Scissors } from "lucide-react";

function CreateBranchCapacity({ form, onChange, loading }) {
  return (
    <section>
      <div className="mb-5">
        <h3 className="text-base font-semibold text-white">
          Operational Capacity
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          Configure the available chairs and barber capacity.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Chairs */}
        <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-500/10">
              <Armchair className="size-5 text-emerald-300" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Chairs
              </p>

              <p className="text-xs text-slate-500">
                Operational stations
              </p>
            </div>
          </div>

          <input
            type="number"
            min="1"
            value={form.capacity.totalChairs}
            onChange={(e) => onChange("totalChairs", e.target.value)}
            required
            disabled={loading}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 text-sm font-medium text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Barbers */}
        <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-500/10">
              <Scissors className="size-5 text-emerald-300" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Barbers
              </p>

              <p className="text-xs text-slate-500">
                Expected active barbers
              </p>
            </div>
          </div>

          <input
            type="number"
            min="1"
            value={form.capacity.totalBarbers}
            onChange={(e) => onChange("totalBarbers", e.target.value)}
            required
            disabled={loading}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 text-sm font-medium text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
    </section>
  );
}

export default CreateBranchCapacity;