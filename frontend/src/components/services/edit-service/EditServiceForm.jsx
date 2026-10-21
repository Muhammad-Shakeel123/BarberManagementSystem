import { useState } from "react";
import { Scissors, X } from "lucide-react";

import { updateService } from "@/services/service.service";

import EditServiceBasicInfo from "./EditServiceBasicInfo";
import EditServicePricing from "./EditServicePricing";
import EditServiceBranches from "./EditServiceBranches";
import EditServiceStatus from "./EditServiceStatus";
import EditServiceCombo from "./EditServiceCombo";
import EditServiceDescription from "./EditServiceDescription";
import EditServiceFooter from "./EditServiceFooter";

const getFormData = (service) => ({
  name: service?.name || "",
  description: service?.description || "",
  duration: service?.duration ?? 30,
  bufferAfter: service?.bufferAfter ?? 5,
  price: service?.price ?? "",
  deposit: service?.deposit ?? 0,
  isDepositRefundable: service?.isDepositRefundable ?? true,

  chairTypeRequired: service?.chairTypeRequired || "",

  branchIds:
    service?.branchIds?.map((branch) =>
      branch?._id ? branch._id : branch,
    ) || [],

  category: service?.category || "",

  isCombo: service?.isCombo ?? false,

  comboServiceIds:
    service?.comboServiceIds?.map((item) =>
      item?._id ? item._id : item,
    ) || [],

  isActive: service?.isActive ?? true,
});

function EditServiceForm({
  service,
  onClose,
  onSuccess,
  onDelete,
  branches = [],
  services = [],
}) {
  const [formData, setFormData] = useState(() => getFormData(service));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleBranch = (branchId) => {
    setFormData((prev) => {
      const exists = prev.branchIds.includes(branchId);

      return {
        ...prev,
        branchIds: exists
          ? prev.branchIds.filter((id) => id !== branchId)
          : [...prev.branchIds, branchId],
      };
    });
  };

  const toggleComboService = (serviceId) => {
    setFormData((prev) => {
      const exists = prev.comboServiceIds.includes(serviceId);

      return {
        ...prev,
        comboServiceIds: exists
          ? prev.comboServiceIds.filter((id) => id !== serviceId)
          : [...prev.comboServiceIds, serviceId],
      };
    });
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
        isActive: formData.isActive,
        isCombo: formData.isCombo,
        comboServiceIds: formData.isCombo
          ? formData.comboServiceIds
          : [],
      };

      const response = await updateService(service._id, payload);

      onSuccess?.(response?.data);
      onClose?.();
    } catch (err) {
      console.error("Update service error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update service.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = () => {
    if (!service?.isActive) {
      return;
    }

    onDelete?.(service);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050b16]/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-700/80 bg-[#0e192b] shadow-[0_25px_80px_rgba(0,0,0,0.45)]"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-700/80 bg-[#111d30] px-6 py-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[#769f5b]/40 bg-[#263a2b]">
              <Scissors className="size-5 text-[#a9c78e]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Edit Service
                </h2>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                    formData.isActive
                      ? "border-[#769f5b]/40 bg-[#263a2b] text-[#a9c78e]"
                      : "border-slate-600 bg-slate-800 text-slate-400"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      formData.isActive
                        ? "bg-[#79c94a]"
                        : "bg-slate-500"
                    }`}
                  />

                  {formData.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="mt-1 truncate text-sm text-slate-400">
                Update service details and booking configuration.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-300">
                <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-500/20">
                  !
                </div>

                <span>{error}</span>
              </div>
            )}

            <div className="space-y-7">
              <EditServiceBasicInfo
                formData={formData}
                onChange={handleChange}
              />

              <div className="h-px bg-slate-700/70" />

              <EditServicePricing
                formData={formData}
                onChange={handleChange}
              />

              <div className="h-px bg-slate-700/70" />

              <EditServiceBranches
                branches={branches}
                branchIds={formData.branchIds}
                onToggle={toggleBranch}
              />

              <div className="h-px bg-slate-700/70" />

              <EditServiceStatus
                isActive={formData.isActive}
                onChange={(isActive) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive,
                  }))
                }
              />

              <div className="h-px bg-slate-700/70" />

              <EditServiceCombo
                service={service}
                services={services}
                formData={formData}
                onChange={handleChange}
                onToggle={toggleComboService}
              />

              <div className="h-px bg-slate-700/70" />

              <EditServiceDescription
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <EditServiceFooter
            service={service}
            loading={loading}
            onClose={onClose}
            onDeactivate={handleDeactivate}
          />
        </form>
      </div>
    </div>
  );
}

export default EditServiceForm;