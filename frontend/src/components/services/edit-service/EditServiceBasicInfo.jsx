function EditServiceBasicInfo({ formData, onChange }) {
  return (
    <section>
      <div className="mb-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-100">
          Basic Information
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          Basic details of this service.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-xs font-semibold text-slate-300">
            Service Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            required
            placeholder="Haircut"
            className="h-11 w-full rounded-xl border border-slate-600/80 bg-[#111d30] px-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#769f5b] focus:ring-4 focus:ring-[#769f5b]/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-300">
            Category
          </label>

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={onChange}
            placeholder="Hair"
            className="h-11 w-full rounded-xl border border-slate-600/80 bg-[#111d30] px-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#769f5b] focus:ring-4 focus:ring-[#769f5b]/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-300">
            Required Chair Type
          </label>

          <select
            name="chairTypeRequired"
            value={formData.chairTypeRequired}
            onChange={onChange}
            className="h-11 w-full rounded-xl border border-slate-600/80 bg-[#111d30] px-3.5 text-sm text-white outline-none transition focus:border-[#769f5b] focus:ring-4 focus:ring-[#769f5b]/10"
          >
            <option value="">Not specified</option>
            <option value="hair">Hair</option>
            <option value="nail">Nail</option>
            <option value="spa">Spa</option>
            <option value="shave">Shave</option>
            <option value="general">General</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </section>
  );
}

export default EditServiceBasicInfo;