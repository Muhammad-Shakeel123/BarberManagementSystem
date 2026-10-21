import { useState } from "react";
import { Building2, X, Sparkles } from "lucide-react";

import BranchBasicInfo from "./BranchBasicInfo";
import BranchAddress from "./BranchAddress";
import CreateBranchCapacity from "./CreateBranchCapacity";
import BranchWorkingHours from "./BranchWorkingHours";
import BranchTimezone from "./BranchTimezone";
import BranchModalActions from "./BranchModalActions";

const initialForm = {
  name: "",
  code: "",
  phone: "",
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Pakistan",
    coordinates: {
      lat: null,
      lng: null,
    },
  },
  capacity: {
    totalChairs: 1,
    totalBarbers: 1,
  },
  workingHours: {
    start: "09:00",
    end: "21:00",
    breaks: [],
  },
  timezone: "Asia/Karachi",
};

function CreateBranchModal({ open, onClose, onSubmit, loading }) {
  const [form, setForm] = useState(initialForm);

  if (!open) {
    return null;
  }

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

  const handleCoordinatesChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        coordinates: {
          ...prev.address.coordinates,
          [field]: value,
        },
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

  const handleTimezoneChange = (value) => {
    setForm((prev) => ({
      ...prev,
      timezone: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSubmit(form);
  };

  return (
    <div className="branch-creator fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-emerald-900/60 bg-slate-900 shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="shrink-0 border-b border-slate-700/80 bg-slate-950/80">
          <div className="flex items-center justify-between px-6 py-5 sm:px-7">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/15 shadow-lg shadow-emerald-950/20">
                <Building2 className="size-6 text-emerald-300" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    Create Branch
                  </h2>

                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                    <Sparkles className="size-3" />
                    New
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-400">
                  Configure your new barber shop branch.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex size-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700">
          <form onSubmit={handleSubmit} className="space-y-8 p-6 sm:p-7">
            <BranchBasicInfo
              form={form}
              onChange={handleChange}
              loading={loading}
            />

            <BranchAddress
              form={form}
              onAddressChange={handleAddressChange}
              onCoordinatesChange={handleCoordinatesChange}
              loading={loading}
            />

            <CreateBranchCapacity
              form={form}
              onChange={handleCapacityChange}
              loading={loading}
            />

            <BranchWorkingHours
              form={form}
              onChange={handleWorkingHoursChange}
              loading={loading}
            />

            <BranchTimezone
              value={form.timezone}
              onChange={handleTimezoneChange}
              loading={loading}
            />

            <BranchModalActions
              onClose={onClose}
              loading={loading}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateBranchModal;
