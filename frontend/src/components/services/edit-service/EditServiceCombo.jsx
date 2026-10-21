import { Check, Scissors } from "lucide-react";

function EditServiceCombo({
  service,
  services = [],
  formData,
  onChange,
  onToggle,
}) {
  return (
    <section>
      <div className="mb-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-100">
          Combo Service
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          Combine multiple existing services into one booking.
        </p>
      </div>

      <label
        className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${
          formData.isCombo
            ? "border-[#769f5b]/60 bg-[#263a2b]"
            : "border-slate-600/70 bg-[#111d30] hover:border-slate-500"
        }`}
      >
        <input
          type="checkbox"
          name="isCombo"
          checked={formData.isCombo}
          onChange={onChange}
          className="size-4 rounded border-slate-500 bg-[#111d30] text-[#769f5b] accent-[#769f5b] focus:ring-[#769f5b]"
        />

        <div>
          <p className="text-sm font-semibold text-slate-100">
            This is a combo service
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Combine multiple existing services.
          </p>
        </div>
      </label>

      {formData.isCombo && (
        <div className="mt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Included Services
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            {services
              .filter((item) => item._id !== service._id)
              .map((item) => {
                const selected = formData.comboServiceIds.includes(item._id);

                return (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => onToggle(item._id)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                      selected
                        ? "border-[#769f5b]/60 bg-[#263a2b]"
                        : "border-slate-600/70 bg-[#111d30] hover:border-slate-500 hover:bg-[#172438]"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Scissors
                        className={`size-4 ${
                          selected
                            ? "text-[#9abd7b]"
                            : "text-slate-500"
                        }`}
                      />

                      <span className="truncate text-sm font-medium text-slate-200">
                        {item.name}
                      </span>
                    </div>

                    {selected && (
                      <div className="ml-3 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#769f5b] text-white">
                        <Check className="size-3" />
                      </div>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </section>
  );
}

export default EditServiceCombo;