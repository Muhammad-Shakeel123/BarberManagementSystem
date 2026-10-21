import { UserPlus, X } from "lucide-react";

function RegisterCustomerModal({
  open,
  onClose,
  form,
  setForm,
  onSubmit,
  loading,
}) {
  if (!open) return null;

  const inputClass =
    "w-full rounded-xl border border-[#485F4D]/70 bg-[#172132] px-3.5 py-3 text-sm font-medium text-white placeholder:text-[#64748B] outline-none transition hover:border-[#8FA985] focus:border-[#8FA985] focus:ring-4 focus:ring-[#8FA985]/10 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-[#485F4D] bg-[#1E2B3B] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#485F4D]/70 bg-[#172132] p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white">
              <UserPlus className="size-5" />
            </div>

            <div>
              <h2 className="text-base font-bold text-white">
                Register New Customer
              </h2>

              <p className="mt-1 text-xs text-[#90A1B9]">
                Create a customer account for this walk-in.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex size-9 items-center justify-center rounded-xl text-[#90A1B9] transition hover:bg-[#1D293D] hover:text-white disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-5 p-5">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#90A1B9]">
              Name
            </label>

            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="Customer name"
              disabled={loading}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#90A1B9]">
              Email
            </label>

            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              placeholder="customer@example.com"
              disabled={loading}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#90A1B9]">
              Phone
            </label>

            <input
              type="tel"
              value={form.phone}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
              placeholder="+923001234567"
              disabled={loading}
              className={inputClass}
            />

            <p className="mt-1.5 text-[11px] text-[#64748B]">
              Use international format, for example +923001234567.
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-[#485F4D]/50 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-[#485F4D] bg-[#172132] px-4 py-2.5 text-sm font-bold text-[#CAD5E2] transition hover:bg-[#1D293D] hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4A6741] to-[#6B8C5E] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#4A6741]/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UserPlus className="size-4" />
              {loading ? "Creating..." : "Create Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterCustomerModal;