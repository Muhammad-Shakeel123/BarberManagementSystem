function ServicePricingFields({ formData, onChange }) {
  return (
    <section>
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
          Service & Pricing
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Configure timing, price and deposit settings.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Duration (Minutes)
          </label>

          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={onChange}
            min="5"
            max="480"
            required
            className="h-11 w-full rounded-lg border border-slate-700 bg-[#182438] px-3.5 text-sm text-white outline-none transition hover:border-slate-600 focus:border-[#71965a] focus:ring-4 focus:ring-[#71965a]/10"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Buffer After (Minutes)
          </label>

          <input
            type="number"
            name="bufferAfter"
            value={formData.bufferAfter}
            onChange={onChange}
            min="0"
            max="60"
            className="h-11 w-full rounded-lg border border-slate-700 bg-[#182438] px-3.5 text-sm text-white outline-none transition hover:border-slate-600 focus:border-[#71965a] focus:ring-4 focus:ring-[#71965a]/10"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Price
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
              PKR
            </span>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={onChange}
              min="0"
              required
              placeholder="1000"
              className="h-11 w-full rounded-lg border border-slate-700 bg-[#182438] pl-12 pr-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-slate-600 focus:border-[#71965a] focus:ring-4 focus:ring-[#71965a]/10"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Deposit
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
              PKR
            </span>

            <input
              type="number"
              name="deposit"
              value={formData.deposit}
              onChange={onChange}
              min="0"
              className="h-11 w-full rounded-lg border border-slate-700 bg-[#182438] pl-12 pr-3.5 text-sm text-white outline-none transition hover:border-slate-600 focus:border-[#71965a] focus:ring-4 focus:ring-[#71965a]/10"
            />
          </div>
        </div>

        <label className="group flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-[#162235] px-4 py-3.5 transition hover:border-[#71965a]/50 hover:bg-[#18283d] md:col-span-2">
          <input
            id="isDepositRefundable"
            type="checkbox"
            name="isDepositRefundable"
            checked={formData.isDepositRefundable}
            onChange={onChange}
            className="size-4 rounded border-slate-600 bg-slate-800 text-[#71965a] accent-[#71965a] focus:ring-[#71965a]/20"
          />

          <div>
            <p className="text-sm font-medium text-slate-200">
              Deposit is refundable
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              Allow eligible deposits to be refunded.
            </p>
          </div>
        </label>
      </div>
    </section>
  );
}

export default ServicePricingFields;