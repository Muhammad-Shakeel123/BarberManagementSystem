import { useState } from "react";
import {
  Armchair,
  Check,
  ChevronDown,
  X,
} from "lucide-react";

const initialForm = {
  name: "",
  number: "",
  type: "general",
  assignedBarberId: "",
  isShared: true,
};

const CreateChairModal = ({
  open,
  onClose,
  onSubmit,
  branchId,
  barbers = [],
  loading = false,
}) => {
  const [form, setForm] = useState(() => ({
    ...initialForm,
  }));

  const resetForm = () => {
    setForm({ ...initialForm });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await onSubmit({
      branchId,
      name: form.name.trim(),
      number: Number(form.number),
      type: form.type,
      assignedBarberId:
        form.assignedBarberId || null,
      isShared: form.isShared,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-[#111b2d] shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-[#78a85b]/30 bg-[#78a85b]/10">
              <Armchair className="size-5 text-[#9ac47d]" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Add Chair
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Add a new station to this branch.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-5">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Chair Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. Main Chair 1"
                className="h-11 w-full rounded-xl border border-slate-700 bg-[#0d1728] px-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-[#78a85b]/60 focus:ring-2 focus:ring-[#78a85b]/10"
              />
            </div>

            {/* Number */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Chair Number
              </label>

              <input
                name="number"
                type="number"
                min="1"
                value={form.number}
                onChange={handleChange}
                required
                placeholder="1"
                className="h-11 w-full rounded-xl border border-slate-700 bg-[#0d1728] px-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-[#78a85b]/60 focus:ring-2 focus:ring-[#78a85b]/10"
              />
            </div>

            {/* Type */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Chair Type
              </label>

              <div className="relative">
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-700 bg-[#0d1728] px-3 pr-10 text-sm text-slate-200 outline-none transition focus:border-[#78a85b]/60 focus:ring-2 focus:ring-[#78a85b]/10"
                >
                  <option value="general">General</option>
                  <option value="hair">Hair</option>
                  <option value="nail">Nail</option>
                  <option value="spa">Spa</option>
                  <option value="shave">Shave</option>
                  <option value="other">Other</option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Barber */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Assign Barber
              </label>

              <div className="relative">
                <select
                  name="assignedBarberId"
                  value={form.assignedBarberId}
                  onChange={handleChange}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-700 bg-[#0d1728] px-3 pr-10 text-sm text-slate-200 outline-none transition focus:border-[#78a85b]/60 focus:ring-2 focus:ring-[#78a85b]/10"
                >
                  <option value="">No Barber</option>

                  {barbers.map((barber) => (
                    <option
                      key={barber._id}
                      value={barber._id}
                    >
                      {barber.userId?.name ||
                        `Barber ${barber._id}`}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Shared */}
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-700 bg-[#0d1728] p-4 transition hover:border-slate-600">
              <input
                type="checkbox"
                checked={form.isShared}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isShared: e.target.checked,
                  }))
                }
                className="mt-0.5 size-4 accent-[#78a85b]"
              />

              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Shared Chair
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Allow multiple barbers to use this chair.
                </p>
              </div>

              {form.isShared && (
                <Check className="ml-auto size-4 text-[#9ac47d]" />
              )}
            </label>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-800 p-5">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#78a85b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#86b968] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Chair"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChairModal;