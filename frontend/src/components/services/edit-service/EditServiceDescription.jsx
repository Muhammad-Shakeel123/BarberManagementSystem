function EditServiceDescription({ value, onChange }) {
  return (
    <section>
      <div className="mb-2">
        <label className="block text-xs font-semibold text-slate-300">
          Description
        </label>

        <p className="mt-1 text-xs text-slate-500">
          Give customers a short description of this service.
        </p>
      </div>

      <textarea
        name="description"
        value={value}
        onChange={onChange}
        maxLength={500}
        rows={4}
        placeholder="Describe this service..."
        className="w-full resize-none rounded-xl border border-slate-600/80 bg-[#111d30] px-3.5 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-[#769f5b] focus:ring-4 focus:ring-[#769f5b]/10"
      />

      <p className="mt-1 text-right text-[11px] text-slate-500">
        {value.length}/500
      </p>
    </section>
  );
}

export default EditServiceDescription;