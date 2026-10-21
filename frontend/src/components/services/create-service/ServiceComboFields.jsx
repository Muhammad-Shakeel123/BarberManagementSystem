import { Check, Scissors } from "lucide-react";

function ServiceComboFields({
  formData,
  services,
  onChange,
  onServicesChange,
}) {
  return (
    <section>
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
          Combo Service
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Combine multiple existing services into one package.
        </p>
      </div>

      <label
        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
          formData.isCombo
            ? "border-[#71965a]/60 bg-[#71965a]/10 ring-1 ring-[#71965a]/20"
            : "border-slate-700 bg-[#162235] hover:border-slate-600 hover:bg-[#18283d]"
        }`}
      >
        <input
          id="isCombo"
          type="checkbox"
          name="isCombo"
          checked={formData.isCombo}
          onChange={onChange}
          className="size-4 rounded border-slate-600 bg-slate-800 text-[#71965a] accent-[#71965a] focus:ring-[#71965a]/20"
        />

        <div className="flex-1">
          <p
            className={`text-sm font-semibold ${
              formData.isCombo
                ? "text-[#a5c985]"
                : "text-slate-200"
            }`}
          >
            This is a combo service
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            Combine multiple existing services.
          </p>
        </div>

        {formData.isCombo && (
          <div className="flex size-7 items-center justify-center rounded-full bg-[#71965a] text-white">
            <Check className="size-3.5" />
          </div>
        )}
      </label>

      {formData.isCombo && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">
              Included Services
            </label>

            <span className="text-[11px] font-medium uppercase tracking-wide text-[#88ae69]">
              Select services
            </span>
          </div>

          <select
            multiple
            value={formData.comboServiceIds}
            onChange={onServicesChange}
            className="min-h-36 w-full rounded-xl border border-slate-700 bg-[#182438] px-3.5 py-3 text-sm text-white outline-none transition hover:border-slate-600 focus:border-[#71965a] focus:ring-4 focus:ring-[#71965a]/10"
          >
            {services.map((service) => (
              <option
                key={service._id}
                value={service._id}
                className="bg-[#182438] py-2"
              >
                {service.name}
              </option>
            ))}
          </select>

          <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-700/70 bg-[#121e30] px-3.5 py-2.5">
            <Scissors className="size-3.5 text-[#88ae69]" />

            <p className="text-xs text-slate-500">
              Select the services included in this combo.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default ServiceComboFields;