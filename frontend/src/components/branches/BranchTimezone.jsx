import { Globe2 } from "lucide-react";

function BranchTimezone({ value, onChange, loading }) {
  return (
    <section>
      <div className="mb-5">
        <h3 className="text-base font-semibold text-white">
          Timezone
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          Set the timezone used for branch scheduling and appointments.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-500/10">
            <Globe2 className="size-5 text-emerald-300" />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300">
              Branch Timezone
            </label>

            <p className="mt-0.5 text-xs text-slate-500">
              Example: Asia/Karachi
            </p>
          </div>
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
          placeholder="Asia/Karachi"
          className="mt-4 h-12 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </section>
  );
}

export default BranchTimezone;