function EditServiceField({
  label,
  name,
  type = "text",
  value,
  onChange,
  min,
  max,
  required,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-300">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        required={required}
        className="h-11 w-full rounded-xl border border-slate-600/80 bg-[#111d30] px-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#769f5b] focus:ring-4 focus:ring-[#769f5b]/10"
      />
    </div>
  );
}

export default EditServiceField;