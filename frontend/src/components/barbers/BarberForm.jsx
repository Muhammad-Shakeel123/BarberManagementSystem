import {
  UserRoundPlus,
  X,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import { useBarberForm } from "@/hooks/useBarberForm";

import BarberFormFields from "./BarberFormFields";
import BarberFormActions from "./BarberFormActions";

function BarberForm({ barber, onSuccess, onCancel }) {
  const {
    isEditMode,
    users,
    branches,
    services,
    formData,
    loadingData,
    loading,
    error,
    handleChange,
    handleWorkingHoursChange,
    handleSpecialtiesChange,
    handleStatusChange,
    handleSubmit,
  } = useBarberForm(barber, onSuccess);

  if (loadingData) {
    return (
      <div className="relative overflow-hidden rounded-[24px] border border-[#485F4D] bg-[#1E2B3B] p-6 shadow-xl sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-[#4A6741]/15 blur-3xl" />

        <div className="relative flex items-center gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#4A6741] to-[#6B8C5E]">
            <UserRoundPlus className="size-5 text-white" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-44 animate-pulse rounded-lg bg-[#29384C]" />
            <div className="h-3 w-72 animate-pulse rounded-lg bg-[#243348]" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-12 animate-pulse rounded-xl bg-[#172132]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-[24px] border border-[#485F4D] bg-[#1E2B3B] shadow-xl"
    >
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[#4A6741]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-[#6B8C5E]/10 blur-3xl" />

      {/* Header */}
      <div className="relative border-b border-[#485F4D]/70 bg-gradient-to-r from-[#1E2B3B] via-[#1E2B3B] to-[#21332F] px-6 py-6 sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-lg shadow-[#4A6741]/20">
              <UserRoundPlus className="size-5" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                  {isEditMode
                    ? "Edit Barber Profile"
                    : "Create Barber Profile"}
                </h2>

                <span className="inline-flex items-center gap-1 rounded-full border border-[#485F4D] bg-[#172132] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8FA985]">
                  <Sparkles className="size-3" />
                  {isEditMode ? "Update" : "New Profile"}
                </span>
              </div>

              <p className="mt-1.5 max-w-2xl text-xs font-medium leading-relaxed text-[#90A1B9] sm:text-sm">
                {isEditMode
                  ? "Update professional details, branch assignment, services and working preferences."
                  : "Assign an existing customer to a branch and create a professional barber profile."}
              </p>
            </div>
          </div>

          {isEditMode && (
            <button
              type="button"
              onClick={onCancel}
              className="group inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[#485F4D] bg-[#172132] px-3 py-2 text-xs font-bold text-[#90A1B9] transition hover:border-[#6B8C5E] hover:bg-[#1D293D] hover:text-white active:scale-95"
            >
              <X className="size-3.5 transition-transform group-hover:rotate-90" />
              <span className="hidden sm:inline">Cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="relative mx-6 mt-5 overflow-hidden rounded-2xl border border-rose-500/40 bg-rose-950/30 px-4 py-3.5 sm:mx-7">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-rose-500/10">
              <AlertCircle className="size-4 text-rose-400" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-rose-300">
                Unable to save barber profile
              </p>

              <p className="mt-0.5 text-xs leading-relaxed text-rose-400">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form content */}
      <div className="relative px-6 py-6 sm:px-7 sm:py-7">
        <BarberFormFields
          isEditMode={isEditMode}
          barber={barber}
          users={users}
          branches={branches}
          services={services}
          formData={formData}
          handleChange={handleChange}
          handleWorkingHoursChange={handleWorkingHoursChange}
          handleSpecialtiesChange={handleSpecialtiesChange}
          handleStatusChange={handleStatusChange}
        />

        <div className="mt-7 border-t border-[#485F4D]/60 pt-5">
          <BarberFormActions
            isEditMode={isEditMode}
            loading={loading}
          />
        </div>
      </div>
    </form>
  );
}

export default BarberForm;