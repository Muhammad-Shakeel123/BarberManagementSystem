function BranchBasicInfo({ form, onChange, loading }) {
  return (
    <section>
      <div className="mb-5">
        <h3 className="text-base font-semibold text-white">
          Basic Information
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          Enter the basic details of your branch.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Branch Name
          </label>

          <input
            type="text"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Main Branch"
            required
            disabled={loading}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-emerald-400/60 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Branch Code
          </label>

          <input
            type="text"
            value={form.code}
            onChange={(e) => onChange("code", e.target.value.toUpperCase())}
            placeholder="BR001"
            required
            disabled={loading}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 text-sm uppercase text-white outline-none placeholder:text-slate-500 transition focus:border-emerald-400/60 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Phone{" "}
            <span className="font-normal text-slate-500">(Optional)</span>
          </label>

          <input
            type="text"
            value={form.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="+923001234567"
            disabled={loading}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-emerald-400/60 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
    </section>
  );
}

export default BranchBasicInfo;