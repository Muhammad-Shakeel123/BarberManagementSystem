import { Globe2 } from "lucide-react";

function EditBranchTimezone({ value, onChange, loading }) {
  return (
    <section>
      <div className="mb-4 flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-lime-400/30 bg-lime-400/10">
          <Globe2 className="size-4 text-lime-300" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">
            Timezone
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Set the timezone used for appointments and branch schedules.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
        <label className="mb-1.5 block text-xs font-medium text-slate-300">
          Branch Timezone
        </label>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
          placeholder="Asia/Karachi"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-3 text-sm font-medium text-white outline-none placeholder:text-slate-600 transition focus:border-lime-400/60 focus:ring-1 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <div className="mt-3 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-lime-400" />

          <span className="text-[11px] text-slate-500">
            Current timezone:{" "}
            <span className="font-medium text-slate-300">{value}</span>
          </span>
        </div>
      </div>
    </section>
  );
}

export default EditBranchTimezone;