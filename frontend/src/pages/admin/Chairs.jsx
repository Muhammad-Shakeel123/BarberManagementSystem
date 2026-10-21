import { Armchair, ArrowLeft, CircleAlert, Plus, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useChairs } from "@/hooks/useChairs";

import ChairCard from "@/components/chairs/ChairCard";
import ChairStats from "@/components/chairs/ChairStats";
import ChairFilters from "@/components/chairs/ChairFilters";

import CreateChairModal from "@/components/chairs/CreateChairModal";
import EditChairModal from "@/components/chairs/EditChairModal";
import ChairDetailsModal from "@/components/chairs/ChairDetailsModal";

function Chairs() {
  const navigate = useNavigate();

  const {
    branches,
    selectedBranchId,
    selectedBranch,
    barbers,

    loadingBranches,
    loadingChairs,
    loadingBarbers,
    actionLoading,

    error,
    clearError,

    search,
    setSearch,
    statusFilter,
    setStatusFilter,

    filteredChairs,
    stats,

    showCreateModal,
    setShowCreateModal,

    showEditModal,
    showDetailsModal,

    selectedChair,

    handleBranchChange,
    handleCreateChair,
    handleEditChair,
    handleUpdateChair,
    handleDeleteChair,
    handleViewChair,

    closeEditModal,
    closeDetailsModal,
  } = useChairs();

  return (
    <div className="space-y-7">
      {/* Header */}
      <section>
        <button
          type="button"
          onClick={() => navigate("/admin/dashboard")}
          className="
              mb-6 inline-flex items-center gap-2
              rounded-xl
              border border-[#485F4D]/70
              bg-[#172132]
              px-3.5 py-2
              text-xs font-bold
              text-[#CAD5E2]
              shadow-sm
              transition-all duration-200
              hover:border-[#8FA985]
              hover:bg-[#202F43]
              hover:text-white
              active:scale-[0.97]
            "
        >
          <ArrowLeft className="size-3.5" />
          Back to Dashboard
        </button>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[#78a85b]/40 bg-[#78a85b]/20 shadow-sm">
              <Armchair className="size-6 text-[#9ac47d]" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-white">
                  Chairs
                </h1>

                <span className="rounded-full border border-[#78a85b]/30 bg-[#78a85b]/10 px-2.5 py-1 text-xs font-semibold text-[#9ac47d]">
                  {stats.total} STATIONS
                </span>
              </div>

              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-400">
                Manage your branch chairs, station assignments, operational
                status, and barber availability.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            disabled={!selectedBranchId || actionLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#485F4D] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="size-4" />
            Add Chair
          </button>
        </div>
      </section>

      {/* Stats */}
      <ChairStats stats={stats} />

      {/* Filters */}
      <ChairFilters
        branches={branches}
        selectedBranchId={selectedBranchId}
        onBranchChange={handleBranchChange}
        loadingBranches={loadingBranches}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        selectedBranch={selectedBranch}
      />

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-900/60 bg-rose-950/20 p-4 text-sm">
          <CircleAlert className="mt-0.5 size-5 shrink-0 text-rose-400" />

          <div className="flex-1">
            <p className="font-semibold text-rose-300">Something went wrong</p>

            <p className="mt-1 text-rose-300/70">{error}</p>
          </div>

          <button
            type="button"
            onClick={clearError}
            className="rounded-lg p-1 text-[#90A1B9] transition hover:bg-[#1D293D] hover:text-white"
          >
            <XCircle className="size-5" />
          </button>
        </div>
      )}

      {/* Loading */}
      {loadingChairs && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-[280px] animate-pulse rounded-3xl border border-[#485F4D]/40 bg-[#1D293D80]"
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loadingChairs && filteredChairs.length === 0 && (
        <div className="rounded-3xl border border-[#485F4D]/50 bg-[#1D293D80] p-12 text-center shadow-sm">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#485F4D] bg-[#172132]">
            <Armchair className="size-6 text-[#90A1B9]" />
          </div>

          <h3 className="mt-5 text-base font-semibold text-white">
            No chairs found
          </h3>

          <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-[#90A1B9]">
            {stats.total === 0
              ? "This branch does not have any chairs yet."
              : "No chairs match your current search or filter."}
          </p>

          {stats.total === 0 && selectedBranchId && (
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#485F4D] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Plus className="size-4" />
              Add Chair
            </button>
          )}
        </div>
      )}

      {/* Chair Section */}
      {!loadingChairs && filteredChairs.length > 0 && (
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold uppercase tracking-[0.08em] text-slate-200">
                Chair Stations
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Operational stations for the selected branch
              </p>
            </div>

            <div className="hidden items-center gap-2 text-xs font-medium text-slate-500 sm:flex">
              <span className="size-2 rounded-full bg-[#78a85b]" />
              {filteredChairs.length} stations
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredChairs.map((chair) => (
              <ChairCard
                key={chair._id}
                chair={chair}
                onView={handleViewChair}
                onEdit={handleEditChair}
                onDelete={handleDeleteChair}
              />
            ))}
          </div>
        </section>
      )}

      {/* Create Modal */}
      <CreateChairModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateChair}
        branchId={selectedBranchId}
        barbers={barbers}
        loading={actionLoading || loadingBarbers}
      />

      {/* Edit Modal */}
      <EditChairModal
        open={showEditModal}
        onClose={closeEditModal}
        chair={selectedChair}
        onSubmit={handleUpdateChair}
        barbers={barbers}
        loading={actionLoading || loadingBarbers}
      />

      {/* Details Modal */}
      <ChairDetailsModal
        open={showDetailsModal}
        onClose={closeDetailsModal}
        chair={selectedChair}
      />
    </div>
  );
}

export default Chairs;
