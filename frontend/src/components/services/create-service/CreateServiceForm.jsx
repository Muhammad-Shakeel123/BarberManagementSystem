import { useState } from "react";
import { Scissors, X } from "lucide-react";

import { createService } from "@/services/service.service";

import ServiceBasicFields from "./ServiceBasicFields";
import ServicePricingFields from "./ServicePricingFields";
import ServiceBranchFields from "./ServiceBranchFields";
import ServiceComboFields from "./ServiceComboFields";

const initialForm = {
  name: "",
  description: "",
  duration: 30,
  bufferAfter: 5,
  price: "",
  deposit: 0,
  isDepositRefundable: true,
  chairTypeRequired: "",
  branchIds: [],
  category: "",
  isCombo: false,
  comboServiceIds: [],
};

function CreateServiceForm({
  onClose,
  onSuccess,
  branches,
  services,
}) {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBranchesChange = (event) => {
    const values = Array.from(
      event.target.selectedOptions,
      (option) => option.value,
    );

    setFormData((prev) => ({
      ...prev,
      branchIds: values,
    }));
  };

  const handleComboServicesChange = (event) => {
    const values = Array.from(
      event.target.selectedOptions,
      (option) => option.value,
    );

    setFormData((prev) => ({
      ...prev,
      comboServiceIds: values,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        duration: Number(formData.duration),
        bufferAfter: Number(formData.bufferAfter),
        price: Number(formData.price),
        deposit: Number(formData.deposit),
        isDepositRefundable: formData.isDepositRefundable,
        chairTypeRequired: formData.chairTypeRequired || null,
        branchIds: formData.branchIds,
        category: formData.category.trim() || undefined,
        isCombo: formData.isCombo,
        comboServiceIds: formData.isCombo
          ? formData.comboServiceIds
          : [],
      };

      const response = await createService(payload);

      onSuccess?.(response?.data);

      setFormData(initialForm);
      onClose?.();
    } catch (err) {
      console.error("Create service error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to create service.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-[#111b2b] shadow-2xl shadow-black/40"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-700/80 bg-[#101a2a] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#71965a] shadow-lg shadow-[#71965a]/20">
              <Scissors className="size-5 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold tracking-tight text-white">
                  Create Service
                </h2>

                <span className="rounded-full border border-[#71965a]/40 bg-[#71965a]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#9fc47f]">
                  New
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-400">
                Add a new service to your barber system.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex size-9 items-center justify-center rounded-lg border border-transparent text-slate-400 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700">
            {error && (
              <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
                {error}
              </div>
            )}

            <div className="space-y-7">
              <ServiceBasicFields
                formData={formData}
                onChange={handleChange}
              />

              <div className="h-px bg-slate-700/70" />

              <ServicePricingFields
                formData={formData}
                onChange={handleChange}
              />

              <div className="h-px bg-slate-700/70" />

              <ServiceBranchFields
                formData={formData}
                branches={branches}
                onChange={handleBranchesChange}
              />

              <div className="h-px bg-slate-700/70" />

              <ServiceComboFields
                formData={formData}
                services={services}
                onChange={handleChange}
                onServicesChange={handleComboServicesChange}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-700/80 bg-[#0e1828] px-6 py-4">
            <p className="hidden text-xs text-slate-500 sm:block">
              Configure the service details before creating it.
            </p>

            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-lg border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:bg-slate-700 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-[#71965a] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#71965a]/10 transition hover:bg-[#7fa765] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Service"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateServiceForm;