import { Clock3 } from "lucide-react";

function EditBranchWorkingHours({ form, onChange, loading }) {
  return (
    <section>
      <div className="mb-4 flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-lime-400/30 bg-lime-400/10">
          <Clock3 className="size-4 text-lime-300" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">
            Working Hours
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Set the daily operating hours for this branch.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Opening */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">
              Opening Time
            </label>

            <input
              type="time"
              value={form.workingHours.start}
              onChange={(e) => onChange("start", e.target.value)}
              required
              disabled={loading}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-3 text-sm font-medium text-white outline-none transition focus:border-lime-400/60 focus:ring-1 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Closing */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">
              Closing Time
            </label>

            <input
              type="time"
              value={form.workingHours.end}
              onChange={(e) => onChange("end", e.target.value)}
              required
              disabled={loading}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-3 text-sm font-medium text-white outline-none transition focus:border-lime-400/60 focus:ring-1 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2.5">
          <Clock3 className="size-3.5 text-slate-500" />

          <span className="text-xs text-slate-500">
            Branch operating window:
          </span>

          <span className="text-xs font-semibold text-slate-300">
            {form.workingHours.start} — {form.workingHours.end}
          </span>
        </div>
      </div>
    </section>
  );
}

export default EditBranchWorkingHours;