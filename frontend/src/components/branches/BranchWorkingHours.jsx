function BranchWorkingHours({ form, onChange, loading }) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-slate-900">
        Working Hours
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Opening Time
          </label>

          <input
            type="time"
            value={form.workingHours.start}
            onChange={(e) => onChange("start", e.target.value)}
            required
            disabled={loading}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 disabled:bg-slate-50"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Closing Time
          </label>

          <input
            type="time"
            value={form.workingHours.end}
            onChange={(e) => onChange("end", e.target.value)}
            required
            disabled={loading}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 disabled:bg-slate-50"
          />
        </div>
      </div>
    </section>
  );
}

export default BranchWorkingHours;