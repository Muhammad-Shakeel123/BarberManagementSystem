import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  CircleAlert,
  MapPin,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useBranches } from "@/hooks/useBranches";

import BranchCard from "@/components/branches/BranchCard";
import CreateBranchModal from "@/components/branches/CreateBranchModal";
import EditBranchModal from "@/components/branches/EditBranchModal";

function Branches() {
  const navigate = useNavigate();

  const {
    branches,
    isLoading,
    error,
    loadBranches,
    createNewBranch,
    updateExistingBranch,
    deactivateBranch,
  } = useBranches();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [deletingBranchId, setDeletingBranchId] = useState(null);

  const filteredBranches = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return branches.filter((branch) => {
      const matchesSearch =
        !search ||
        branch.name?.toLowerCase().includes(search) ||
        branch.code?.toLowerCase().includes(search) ||
        branch.address?.city?.toLowerCase().includes(search) ||
        branch.address?.street?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && branch.isActive) ||
        (statusFilter === "inactive" && !branch.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [branches, searchTerm, statusFilter]);

  const activeBranches = branches.filter((branch) => branch.isActive).length;
  const inactiveBranches = branches.length - activeBranches;

  const hasFilters = searchTerm.trim().length > 0 || statusFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const handleCreateBranch = async (formData) => {
    setIsCreating(true);

    const result = await createNewBranch(formData);

    if (result.success) {
      setShowCreateModal(false);
    }

    setIsCreating(false);
  };

  const handleOpenEdit = (branch) => {
    if (!branch?._id || !branch.isActive) return;

    setSelectedBranch(branch);
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    if (isUpdating) return;

    setShowEditModal(false);
    setSelectedBranch(null);
  };

  const handleEditBranch = async (formData) => {
    if (!selectedBranch?._id) return;

    setIsUpdating(true);

    const result = await updateExistingBranch(
      selectedBranch._id,
      formData,
    );

    if (result.success) {
      setShowEditModal(false);
      setSelectedBranch(null);
    }

    setIsUpdating(false);
  };

  const handleDeleteBranch = async (branch) => {
    if (!branch?._id || deletingBranchId) return;

    setDeletingBranchId(branch._id);

    await deactivateBranch(branch);

    setDeletingBranchId(null);
  };

  return (
    <div className="min-h-full space-y-7 text-slate-200">
      {/* =========================================================
          PAGE HEADER
      ========================================================= */}
      <section>
        <button
          type="button"
          onClick={() => navigate("/admin/dashboard")}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#90A1B9] transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </button>

        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#6f965d]/50 bg-[#668d57] shadow-[0_10px_30px_rgba(102,141,87,0.18)]">
              <Building2 className="size-6 text-white" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-semibold tracking-tight text-white">
                  Branches
                </h1>

                <span className="rounded-full border border-[#6f965d]/40 bg-[#6f965d]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#9fbc91]">
                  {branches.length} Locations
                </span>
              </div>

              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-400">
                Manage your barber shop locations, capacity, working hours,
                and booking availability.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#789d68] bg-[#668d57] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(102,141,87,0.16)] transition-all hover:-translate-y-0.5 hover:bg-[#729b61] hover:shadow-[0_12px_30px_rgba(102,141,87,0.22)]"
          >
            <Plus className="size-4" />
            Create Branch
          </button>
        </div>
      </section>

      {/* =========================================================
          QUICK STATS
      ========================================================= */}
      <section className="grid gap-4 md:grid-cols-3">
        {/* Total */}
        <div className="group rounded-2xl border border-[#485F4D]/50 bg-[#1D293D80] p-5 transition-all hover:-translate-y-0.5 hover:border-[#485F4D]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#90A1B9]">
                Total Branches
              </p>

              <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
                {branches.length}
              </p>

              <p className="mt-1 text-xs text-[#90A1B9]/70">
                All registered locations
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-xl border border-[#485F4D]/50 bg-[#172132]">
              <Building2 className="size-5 text-[#90A1B9]" />
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="group rounded-2xl border border-[#485F4D] bg-[#1D293D80] p-5 transition-all hover:-translate-y-0.5 hover:border-[#8FA985]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#90A1B9]">
                Active Branches
              </p>

              <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
                {activeBranches}
              </p>

              <div className="mt-2 flex items-center gap-2 text-xs font-medium text-[#8FA985]">
                <span className="size-2 rounded-full bg-[#4bad46] shadow-[0_0_8px_rgba(75,173,70,0.45)]" />
                Currently operational
              </div>
            </div>

            <div className="flex size-11 items-center justify-center rounded-xl border border-[#485F4D] bg-[#172132]">
              <CheckCircle2 className="size-5 text-[#8FA985]" />
            </div>
          </div>
        </div>

        {/* Inactive */}
        <div className="group rounded-2xl border border-[#485F4D]/50 bg-[#1D293D80] p-5 transition-all hover:-translate-y-0.5 hover:border-[#485F4D]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#90A1B9]">
                Inactive Branches
              </p>

              <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
                {inactiveBranches}
              </p>

              <p className="mt-1 text-xs text-[#90A1B9]/70">
                Temporarily unavailable
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-xl border border-[#485F4D]/50 bg-[#172132]">
              <CircleAlert className="size-5 text-[#90A1B9]" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SEARCH & FILTER
      ========================================================= */}
      <section className="rounded-2xl border border-[#485F4D]/50 bg-[#1D293D80] p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#90A1B9]" />

            <input
              type="text"
              placeholder="Search branch, code, city or address..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="h-11 w-full rounded-xl border border-[#485F4D]/70 bg-[#172132] pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-[#90A1B9]/60 focus:border-[#8FA985] focus:ring-2 focus:ring-[#485F4D]/20"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#90A1B9] transition hover:bg-[#1D293D] hover:text-white"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <div className="flex h-11 items-center gap-2 rounded-xl border border-[#485F4D]/70 bg-[#172132] px-3.5">
              <SlidersHorizontal className="size-4 text-[#90A1B9]" />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="bg-transparent text-sm font-medium text-[#CAD5E2] outline-none"
              >
                <option
                  value="all"
                  className="bg-[#172132] text-white"
                >
                  All Branches
                </option>

                <option
                  value="active"
                  className="bg-[#172132] text-white"
                >
                  Active Only
                </option>

                <option
                  value="inactive"
                  className="bg-[#172132] text-white"
                >
                  Inactive Only
                </option>
              </select>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="h-11 rounded-xl px-3 text-sm font-medium text-[#90A1B9] transition hover:bg-[#1D293D] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-[#485F4D]/30 pt-3">
          <p className="text-xs text-[#90A1B9]/70">
            Showing{" "}
            <span className="font-semibold text-[#CAD5E2]">
              {filteredBranches.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#CAD5E2]">
              {branches.length}
            </span>{" "}
            branches
          </p>

          {hasFilters && (
            <span className="rounded-full border border-[#485F4D] bg-[#172132] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#8FA985]">
              Filters active
            </span>
          )}
        </div>
      </section>

      {/* =========================================================
          LOADING
      ========================================================= */}
      {isLoading && (
        <div className="grid gap-5 xl:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-[430px] animate-pulse rounded-2xl border border-[#485F4D]/40 bg-[#1D293D80]"
            >
              <div className="h-20 border-b border-[#485F4D]/30 bg-[#1D293D]" />

              <div className="space-y-5 p-6">
                <div className="h-4 w-1/3 rounded bg-[#485F4D]/40" />
                <div className="h-10 rounded-xl bg-[#172132]" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 rounded-xl bg-[#172132]" />
                  <div className="h-20 rounded-xl bg-[#172132]" />
                </div>
                <div className="h-20 rounded-xl bg-[#172132]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================
          ERROR
      ========================================================= */}
      {!isLoading && error && (
        <div className="rounded-2xl border border-[#485F4D]/50 bg-[#1D293D80]">
          <div className="flex min-h-64 flex-col items-center justify-center p-10 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-[#485F4D] bg-[#172132]">
              <CircleAlert className="size-6 text-[#90A1B9]" />
            </div>

            <p className="mt-4 font-semibold text-white">
              Unable to load branches
            </p>

            <p className="mt-1 max-w-sm text-sm leading-6 text-[#90A1B9]">
              Something went wrong while loading your branch list.
            </p>

            <button
              type="button"
              onClick={loadBranches}
              className="mt-5 rounded-xl border border-[#485F4D] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          EMPTY
      ========================================================= */}
      {!isLoading && !error && filteredBranches.length === 0 && (
        <div className="rounded-2xl border border-[#485F4D]/50 bg-[#1D293D80]">
          <div className="flex min-h-72 flex-col items-center justify-center p-10 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-[#485F4D] bg-[#172132]">
              <MapPin className="size-6 text-[#90A1B9]" />
            </div>

            <p className="mt-4 font-semibold text-white">
              {hasFilters
                ? "No matching branches"
                : "No branches yet"}
            </p>

            <p className="mt-1 max-w-sm text-sm leading-6 text-[#90A1B9]">
              {hasFilters
                ? "Try changing your search or status filter."
                : "Create your first branch to start managing your locations."}
            </p>

            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl border border-[#485F4D]/70 bg-[#172132] px-4 py-2.5 text-sm font-semibold text-[#CAD5E2] transition hover:border-[#8FA985] hover:bg-[#1D293D] hover:text-white"
              >
                Clear Filters
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#485F4D] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <Plus className="size-4" />
                Create Branch
              </button>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          BRANCH CARDS
      ========================================================= */}
      {!isLoading && !error && filteredBranches.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-300">
                Branch Locations
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Your operational barber shop locations
              </p>
            </div>

            <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
              <MapPin className="size-3.5" />
              {filteredBranches.length} location
              {filteredBranches.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            {filteredBranches.map((branch) => (
              <BranchCard
                key={branch._id}
                branch={branch}
                onClick={() =>
                  navigate(`/admin/branches/${branch._id}`)
                }
                onEdit={handleOpenEdit}
                onDelete={handleDeleteBranch}
                deleting={deletingBranchId === branch._id}
              />
            ))}
          </div>
        </section>
      )}

      {/* =========================================================
          CREATE BRANCH
      ========================================================= */}
      <CreateBranchModal
        open={showCreateModal}
        onClose={() => {
          if (!isCreating) {
            setShowCreateModal(false);
          }
        }}
        onSubmit={handleCreateBranch}
        loading={isCreating}
      />

      {/* =========================================================
          EDIT BRANCH
      ========================================================= */}
      <EditBranchModal
        open={showEditModal}
        branch={selectedBranch}
        onClose={handleCloseEdit}
        onSubmit={handleEditBranch}
        loading={isUpdating}
      />
    </div>
  );
}

export default Branches;