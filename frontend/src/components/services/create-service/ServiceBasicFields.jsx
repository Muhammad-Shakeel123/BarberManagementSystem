function ServiceBasicFields({ formData, onChange }) {
  return (
    <section>
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
          Basic Information
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Enter the main details of this service.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Service Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            required
            placeholder="Haircut"
            className="h-11 w-full rounded-lg border border-slate-700 bg-[#182438] px-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-slate-600 focus:border-[#71965a] focus:ring-4 focus:ring-[#71965a]/10"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Category
          </label>

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={onChange}
            placeholder="Hair"
            className="h-11 w-full rounded-lg border border-slate-700 bg-[#182438] px-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-slate-600 focus:border-[#71965a] focus:ring-4 focus:ring-[#71965a]/10"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Required Chair Type
          </label>

          <select
            name="chairTypeRequired"
            value={formData.chairTypeRequired}
            onChange={onChange}
            className="h-11 w-full rounded-lg border border-slate-700 bg-[#182438] px-3.5 text-sm text-white outline-none transition hover:border-slate-600 focus:border-[#71965a] focus:ring-4 focus:ring-[#71965a]/10"
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

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            maxLength={500}
            rows={4}
            placeholder="Describe this service..."
            className="w-full resize-none rounded-xl border border-slate-700 bg-[#182438] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-slate-600 focus:border-[#71965a] focus:ring-4 focus:ring-[#71965a]/10"
          />

          <p className="mt-1 text-right text-xs text-slate-500">
            {formData.description.length}/500
          </p>
        </div>
      </div>
    </section>
  );
}

export default ServiceBasicFields;