import { useState } from "react";
import { ArrowLeft, Scissors } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";

import ServiceFilters from "@/components/services/ServiceFilters";
import ServiceDetailsModal from "@/components/services/ServiceDetailsModal";
import CreateServiceModal from "@/components/services/CreateServiceModal";
import EditServiceModal from "@/components/services/EditServiceModal";
import ServicesHeader from "@/components/services/ServicesHeader";
import ServicesStats from "@/components/services/ServicesStats";
import ServiceCard from "@/components/services/ServiceCard";

import { useServices } from "@/hooks/services/useServices";

function Services() {
  const navigate = useNavigate();

  const {
    services,
    categories,
    branches,

    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,

    filteredServices,
    activeServices,
    inactiveServices,

    selectedService,
    setSelectedService,

    editingService,
    setEditingService,

    isLoading,
    isDetailsLoading,
    isDeleting,

    error,

    handleServiceClick,
    handleEditService,
    handleDeleteService,
    handleCreateSuccess,
    handleEditSuccess,
  } = useServices();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-[#485F4D] bg-[#1D293D]">
            <Scissors className="size-5 animate-pulse text-[#8FA985]" />
          </div>

          <p className="mt-4 text-sm font-semibold text-[#CAD5E2]">
            Loading services...
          </p>

          <p className="mt-1 text-xs text-[#90A1B9]">
            Preparing service catalog
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-7">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/admin/dashboard")}
          className="inline-flex items-center gap-2 rounded-xl border border-[#485F4D]/70 bg-[#172132] px-3.5 py-2 text-xs font-bold text-[#CAD5E2] shadow-sm transition hover:border-[#8FA985] hover:bg-[#1E2B3B] hover:text-white active:scale-[0.97]"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </button>

        {/* Header */}
        <ServicesHeader
          onCreate={() => setIsCreateOpen(true)}
        />

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 px-4 py-3 text-sm font-medium text-rose-300">
            {error}
          </div>
        )}


        {/* Stats */}
        <ServicesStats
          activeServices={activeServices}
          inactiveServices={inactiveServices}
        />

        {/* Filters */}
        <ServiceFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categories={categories}
        />

        {/* Results */}
        <section>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wide text-white">
                Available Services
              </h2>

              <p className="mt-1 text-sm text-[#90A1B9]">
                Manage your barber shop services and pricing.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-[#90A1B9]">
              <Scissors className="size-3.5" />

              Showing{" "}
              <span className="font-bold text-[#8FA985]">
                {filteredServices.length}
              </span>{" "}
              services
            </div>
          </div>

          {filteredServices.length === 0 ? (
            <Card className="rounded-3xl border-[#485F4D]/50 bg-[#1D293D80] shadow-none">
              <CardContent className="flex min-h-[280px] flex-col items-center justify-center text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl border border-[#485F4D] bg-[#172132]">
                  <Scissors className="size-6 text-[#90A1B9]" />
                </div>

                <h3 className="mt-4 text-sm font-bold text-white">
                  No services found
                </h3>

                <p className="mt-1 max-w-sm text-sm text-[#90A1B9]">
                  Try changing your search or filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service._id}
                  service={service}
                  onClick={() => handleServiceClick(service)}
                  onEdit={(service) => {
                    handleEditService(service);
                    setIsEditOpen(true);
                  }}
                  onDelete={handleDeleteService}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Details Loading */}
      {isDetailsLoading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#0F172B]/70 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-2xl border border-[#485F4D] bg-[#1E2B3B] px-5 py-4 shadow-2xl">
            <div className="size-5 animate-spin rounded-full border-2 border-[#485F4D] border-t-[#8FA985]" />

            <p className="text-sm font-semibold text-[#CAD5E2]">
              Loading service details...
            </p>
          </div>
        </div>
      )}

      {/* Delete Loading */}
      {isDeleting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0F172B]/70 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-2xl border border-[#485F4D] bg-[#1E2B3B] px-5 py-4 shadow-2xl">
            <div className="size-5 animate-spin rounded-full border-2 border-[#485F4D] border-t-[#8FA985]" />

            <p className="text-sm font-semibold text-[#CAD5E2]">
              Deactivating service...
            </p>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <ServiceDetailsModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onEdit={() => {
          if (selectedService) {
            handleEditService(selectedService);
            setIsEditOpen(true);
          }
        }}
        onDelete={() => {
          if (selectedService) {
            handleDeleteService(selectedService);
          }
        }}
      />

      {/* Create */}
      <CreateServiceModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleCreateSuccess}
        branches={branches}
        services={services}
      />

      {/* Edit */}
      <EditServiceModal
        key={`${editingService?._id || "new"}-${isEditOpen}`}
        open={isEditOpen}
        service={editingService}
        onClose={() => {
          setIsEditOpen(false);
          setEditingService(null);
        }}
        onSuccess={handleEditSuccess}
        onDelete={handleDeleteService}
        branches={branches}
        services={services}
      />
    </>
  );
}

export default Services;