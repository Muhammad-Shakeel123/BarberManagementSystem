import { useState } from "react";
import {
  X,
  Building2,
  MapPin,
  PencilLine,
} from "lucide-react";

import EditBranchBasicInfo from "./EditBranchBasicInfo";
import EditBranchAddress from "./EditBranchAddress";
import EditBranchCapacity from "./EditBranchCapacity";
import EditBranchWorkingHours from "./EditBranchWorkingHours";
import EditBranchSettings from "./EditBranchSettings";
import EditBranchTimezone from "./EditBranchTimezone";

function EditBranchForm({ branch, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    name: branch.name || "",
    phone: branch.phone || "",
    email: branch.email || "",

    address: {
      street: branch.address?.street || "",
      city: branch.address?.city || "",
      state: branch.address?.state || "",
      zipCode: branch.address?.zipCode || "",
      country: branch.address?.country || "Pakistan",
    },

    capacity: {
      totalChairs: branch.capacity?.totalChairs ?? 1,
      totalBarbers: branch.capacity?.totalBarbers ?? 1,
    },

    workingHours: {
      start: branch.workingHours?.start || "09:00",
      end: branch.workingHours?.end || "21:00",
      breaks: branch.workingHours?.breaks || [],
    },

    timezone: branch.timezone || "Asia/Karachi",

    settings: {
      allowWalkIn: branch.settings?.allowWalkIn ?? true,
      allowOnlineBooking: branch.settings?.allowOnlineBooking ?? true,
      maxDaysAdvance: branch.settings?.maxDaysAdvance ?? 30,
      minMinutesAdvance: branch.settings?.minMinutesAdvance ?? 30,
      noShowGraceMinutes: branch.settings?.noShowGraceMinutes ?? 15,
    },
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleCapacityChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      capacity: {
        ...prev.capacity,
        [field]: Number(value),
      },
    }));
  };

  const handleWorkingHoursChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [field]: value,
      },
    }));
  };

  const handleSettingsChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      email: form.email.trim() || undefined,
    };

    await onSubmit(payload);
  };

  return (
    <div className="branch-editor fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="shrink-0 border-b border-slate-700 bg-slate-900">
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-lime-400 text-slate-950 shadow-lg shadow-lime-400/10">
                <Building2 className="size-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-white">
                    Edit Branch
                  </h2>

                  <span className="rounded-full border border-lime-400/30 bg-lime-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-lime-300">
                    Configuration
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  Update your branch information and operational settings.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Close"
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Branch identity */}
          <div className="border-t border-slate-800 bg-slate-950/30 px-6 py-3">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <Building2 className="size-3.5 text-lime-400" />
                <span className="font-medium text-slate-300">
                  {branch.name || "Branch"}
                </span>
              </div>

              <div className="h-3 w-px bg-slate-700" />

              <div className="text-slate-500">
                Code:
                <span className="ml-1 font-medium text-slate-300">
                  {branch.code || "—"}
                </span>
              </div>

              {branch.address?.city && (
                <>
                  <div className="h-3 w-px bg-slate-700" />

                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MapPin className="size-3.5" />
                    {branch.address.city}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto bg-slate-900"
        >
          <div className="space-y-8 p-6">
            <EditBranchBasicInfo
              form={form}
              branch={branch}
              onChange={handleChange}
              loading={loading}
            />

            <EditBranchAddress
              form={form}
              onChange={handleAddressChange}
              loading={loading}
            />

            <EditBranchCapacity
              form={form}
              onChange={handleCapacityChange}
              loading={loading}
            />

            <EditBranchWorkingHours
              form={form}
              onChange={handleWorkingHoursChange}
              loading={loading}
            />

            <EditBranchSettings
              form={form}
              onChange={handleSettingsChange}
              loading={loading}
            />

            <EditBranchTimezone
              value={form.timezone}
              onChange={(value) => handleChange("timezone", value)}
              loading={loading}
            />
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 border-t border-slate-700 bg-slate-900/95 px-6 py-4 backdrop-blur">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Changes will be applied to this branch configuration.
              </p>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-lime-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <PencilLine className="size-4" />

                  {loading ? "Updating..." : "Update Branch"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBranchForm;
