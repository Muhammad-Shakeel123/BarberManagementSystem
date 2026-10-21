import { Armchair, Scissors } from "lucide-react";

function EditBranchCapacity({ form, onChange, loading }) {
  return (
    <section>
      <div className="mb-4 flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-lime-400/30 bg-lime-400/10">
          <UsersIcon />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">
            Operational Capacity
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Configure the available chairs and barber capacity.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Chairs */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg border border-slate-600 bg-slate-900">
                <Armchair className="size-4 text-lime-300" />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Chairs
                </p>

                <p className="text-[11px] text-slate-500">
                  Operational stations
                </p>
              </div>
            </div>
          </div>

          <input
            type="number"
            min="1"
            value={form.capacity.totalChairs}
            onChange={(e) => onChange("totalChairs", e.target.value)}
            required
            disabled={loading}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-3 text-sm font-medium text-white outline-none transition focus:border-lime-400/60 focus:ring-1 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Barbers */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg border border-slate-600 bg-slate-900">
                <Scissors className="size-4 text-lime-300" />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Barbers
                </p>

                <p className="text-[11px] text-slate-500">
                  Staff capacity
                </p>
              </div>
            </div>
          </div>

          <input
            type="number"
            min="1"
            value={form.capacity.totalBarbers}
            onChange={(e) => onChange("totalBarbers", e.target.value)}
            required
            disabled={loading}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-3 text-sm font-medium text-white outline-none transition focus:border-lime-400/60 focus:ring-1 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
    </section>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-4 text-lime-300"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      />
      <circle cx="9" cy="7" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
      />
    </svg>
  );
}

export default EditBranchCapacity;