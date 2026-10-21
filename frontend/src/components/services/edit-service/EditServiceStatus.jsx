function EditServiceStatus({ isActive, onChange }) {
  return (
    <section>
      <div className="mb-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-100">
          Service Status
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          Control whether customers can book this service.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`rounded-2xl border p-4 text-left transition-all ${
            isActive
              ? "border-[#769f5b]/70 bg-[#263a2b] shadow-[0_0_0_1px_rgba(118,159,91,0.15)]"
              : "border-slate-600/70 bg-[#111d30] hover:border-slate-500"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-[#a9c78e]">
              Active
            </p>

            {isActive && (
              <span className="size-2 rounded-full bg-[#79c94a] shadow-[0_0_10px_rgba(121,201,74,0.5)]" />
            )}
          </div>

          <p className="mt-1 text-xs text-slate-400">
            Customers can book this service.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onChange(false)}
          className={`rounded-2xl border p-4 text-left transition-all ${
            !isActive
              ? "border-slate-500 bg-[#202c3c] shadow-[0_0_0_1px_rgba(148,163,184,0.1)]"
              : "border-slate-600/70 bg-[#111d30] hover:border-slate-500"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-200">
              Inactive
            </p>

            {!isActive && (
              <span className="size-2 rounded-full bg-slate-400" />
            )}
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Customers cannot book this service.
          </p>
        </button>
      </div>
    </section>
  );
}

export default EditServiceStatus;