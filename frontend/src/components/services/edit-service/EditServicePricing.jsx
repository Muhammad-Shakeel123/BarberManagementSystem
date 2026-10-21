import EditServiceField from "./EditServiceField";

function EditServicePricing({ formData, onChange }) {
  return (
    <section>
      <div className="mb-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-100">
          Pricing & Timing
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          Configure duration, price and deposit.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <EditServiceField
          label="Duration"
          name="duration"
          type="number"
          value={formData.duration}
          onChange={onChange}
          min="5"
          max="480"
          required
        />

        <EditServiceField
          label="Buffer After"
          name="bufferAfter"
          type="number"
          value={formData.bufferAfter}
          onChange={onChange}
          min="0"
          max="60"
        />

        <EditServiceField
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={onChange}
          min="0"
          required
        />

        <EditServiceField
          label="Deposit"
          name="deposit"
          type="number"
          value={formData.deposit}
          onChange={onChange}
          min="0"
        />
      </div>

      <label className="mt-5 flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-600/70 bg-[#111d30] px-4 py-3.5 transition hover:border-slate-500">
        <input
          type="checkbox"
          name="isDepositRefundable"
          checked={formData.isDepositRefundable}
          onChange={onChange}
          className="size-4 rounded border-slate-500 bg-[#111d30] accent-[#769f5b] focus:ring-[#769f5b]"
        />

        <div>
          <p className="text-sm font-semibold text-slate-200">
            Deposit is refundable
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Allow eligible deposits to be refunded.
          </p>
        </div>
      </label>
    </section>
  );
}

export default EditServicePricing;