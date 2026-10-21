import { useEffect, useMemo, useState } from "react";

import {
  getAllServices,
  getServiceCategories,
  getServiceById,
  deleteService,
} from "@/services/service.service";

import { getAllBranches } from "@/services/branch.service";

export function useServices() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedService, setSelectedService] = useState(null);
  const [editingService, setEditingService] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [servicesResponse, categoriesResponse, branchesResponse] =
        await Promise.all([
          getAllServices(),
          getServiceCategories(),
          getAllBranches(),
        ]);

      setServices(servicesResponse?.data || []);
      setCategories(categoriesResponse?.data || []);
      setBranches(branchesResponse?.data || []);
    } catch (error) {
      console.error("Services loading error:", error);

      setError(error?.response?.data?.message || "Unable to load services.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [servicesResponse, categoriesResponse, branchesResponse] =
          await Promise.all([
            getAllServices(),
            getServiceCategories(),
            getAllBranches(),
          ]);

        if (!isMounted) return;

        setServices(servicesResponse?.data || []);
        setCategories(categoriesResponse?.data || []);
        setBranches(branchesResponse?.data || []);
      } catch (error) {
        if (!isMounted) return;

        console.error("Services loading error:", error);

        setError(error?.response?.data?.message || "Unable to load services.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        service.name?.toLowerCase().includes(search) ||
        service.description?.toLowerCase().includes(search);

      const matchesCategory =
        categoryFilter === "all" || service.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && service.isActive) ||
        (statusFilter === "inactive" && !service.isActive);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [services, searchTerm, categoryFilter, statusFilter]);

  const activeServices = services.filter((service) => service.isActive).length;

  const inactiveServices = services.filter(
    (service) => !service.isActive,
  ).length;

  const handleServiceClick = async (service) => {
    try {
      setIsDetailsLoading(true);

      const response = await getServiceById(service._id);

      setSelectedService(response?.data || null);
    } catch (error) {
      console.error("Service details error:", error);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleEditService = (service) => {
    setSelectedService(null);
    setEditingService(service);
  };

  const handleDeleteService = async (service) => {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate "${service.name}"?`,
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setError("");

      await deleteService(service._id);

      setSelectedService(null);

      await loadData();
    } catch (error) {
      console.error("Delete service error:", error);

      setError(
        error?.response?.data?.message || "Unable to deactivate service.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateSuccess = async () => {
    await loadData();
  };

  const handleEditSuccess = async () => {
    setEditingService(null);

    await loadData();
  };

  return {
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
  };
}
