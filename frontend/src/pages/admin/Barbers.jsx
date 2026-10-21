import { useState } from "react";
import { ArrowLeft, Plus, Scissors, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useBarbers } from "@/hooks/useBarbers";

import BarberForm from "@/components/barbers/BarberForm";
import BarberCard from "@/components/barbers/BarberCard";
import BarberAvailability from "@/components/barbers/BarberAvailability";

function Barbers() {
  const navigate = useNavigate();

  const {
    barbers,
    isLoading,
    error,
    loadBarbers,
    handleCreateSuccess,
    handleUpdateSuccess,
    handleDelete,
  } = useBarbers();

  const [showForm, setShowForm] = useState(false);
  const [editingBarber, setEditingBarber] = useState(null);

  const [availabilityBarber, setAvailabilityBarber] = useState(null);

  const handleEdit = (barber) => {
    setEditingBarber(barber);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setEditingBarber(null);
    setShowForm(false);
  };

  const handleCreateButton = () => {
    if (editingBarber) {
      setEditingBarber(null);
    }

    setShowForm((prev) => !prev);
  };

  const handleCreate = (newBarber) => {
    handleCreateSuccess(newBarber);
    setShowForm(false);
  };

  const handleUpdate = (updatedBarber) => {
    handleUpdateSuccess(updatedBarber);
    setEditingBarber(null);
    setShowForm(false);
  };

  const handleAvailability = (barber) => {
    setAvailabilityBarber(barber);
  };

  const handleAppointments = (barber) => {
    navigate(`/admin/appointments?barberId=${barber._id}`);
  };

  const closeAvailability = () => {
    setAvailabilityBarber(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
         <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 rounded-xl border border-[#485F4D]/70 bg-[#172132] px-3.5 py-2 text-xs font-semibold text-[#CAD5E2] shadow-sm transition-all duration-200 hover:border-[#6B8C5E] hover:bg-[#1D293D] hover:text-white active:scale-[0.98]"
        >
          <ArrowLeft className="size-3.5" />
          Back
        </button>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3.5">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-md shadow-[#4A6741]/25">
              <Scissors className="size-6 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Stylists & Barbers
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#485F4D] bg-[#172132] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8FA985]">
                  <Sparkles className="size-3" />
                  Staff Team
                </span>
              </div>

              <p className="mt-0.5 text-xs font-medium text-[#90A1B9] sm:text-sm">
                Manage barber profiles, schedules, working hours and station assignments.
              </p>
            </div>
          </div>

          <button
            onClick={handleCreateButton}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] px-5 text-xs font-bold text-white shadow-md shadow-[#4A6741]/25 transition hover:opacity-90 active:scale-95 sm:text-sm"
          >
            <Plus className="size-4" />
            {showForm && !editingBarber ? "Close Form" : "Add New Stylist"}
          </button>
        </div>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <BarberForm
          barber={editingBarber}
          onSuccess={editingBarber ? handleUpdate : handleCreate}
          onCancel={handleFormCancel}
        />
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex min-h-40 items-center justify-center rounded-3xl border border-[#485F4D]/50 bg-[#1D293D80] p-12">
          <div className="text-center">
            <div className="mx-auto size-8 animate-spin rounded-full border-2 border-[#485F4D] border-t-[#8FA985]" />
            <p className="mt-3 text-xs font-semibold text-[#90A1B9]">Loading barbers team...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-950/30 p-6 text-center">
          <p className="text-sm font-semibold text-rose-300">{error}</p>
          <button
            onClick={loadBarbers}
            className="mt-3 rounded-xl border border-[#485F4D]/70 bg-[#172132] px-4 py-2 text-xs font-bold text-[#CAD5E2] transition hover:border-[#8FA985] hover:bg-[#1D293D] hover:text-white active:scale-95"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && barbers.length === 0 && (
        <div className="rounded-3xl border border-dashed border-[#485F4D] bg-[#1D293D80] p-16 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#485F4D] bg-[#172132]">
            <Scissors className="size-6 text-[#8FA985]" />
          </div>

          <h2 className="mt-4 text-base font-bold text-white">No barbers registered</h2>

          <p className="mt-1 text-xs text-[#90A1B9]">
            Create your first stylist or barber profile to start accepting appointments.
          </p>
        </div>
      )}

      {/* Barber List */}
      {!isLoading && !error && barbers.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {barbers.map((barber) => (
            <BarberCard
              key={barber._id}
              barber={barber}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAvailability={handleAvailability}
              onAppointments={handleAppointments}
            />
          ))}
        </div>
      )}

      {/* Availability Modal */}
      {availabilityBarber && (
        <BarberAvailability
          barber={availabilityBarber}
          onClose={closeAvailability}
        />
      )}
    </div>
  );
}

export default Barbers;

