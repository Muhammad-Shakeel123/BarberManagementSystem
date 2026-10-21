import { useCallback, useEffect, useMemo, useState } from "react";

import chairService from "@/services/chair.service";
import { getAllBranches } from "@/services/branch.service";
import { getAllBarbers } from "@/services/barber.service";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export function useChairs() {
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");

  const [chairs, setChairs] = useState([]);
  const [barbers, setBarbers] = useState([]);

  const [loadingBranches, setLoadingBranches] = useState(true);
  const [loadingChairs, setLoadingChairs] = useState(false);
  const [loadingBarbers, setLoadingBarbers] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [selectedChair, setSelectedChair] = useState(null);

  const loadChairs = useCallback(async (branchId) => {
    if (!branchId) {
      setChairs([]);
      return;
    }

    try {
      setLoadingChairs(true);
      setError("");

      const response = await chairService.getChairsByBranch(branchId);

      setChairs(response?.data || []);
    } catch (error) {
      console.error("Load chairs error:", error);

      setChairs([]);
      setError(getErrorMessage(error, "Failed to load chairs"));
    } finally {
      setLoadingChairs(false);
    }
  }, []);

  const loadBarbers = useCallback(async (branchId) => {
    if (!branchId) {
      setBarbers([]);
      return;
    }

    try {
      setLoadingBarbers(true);

      const response = await getAllBarbers();
      const allBarbers = response?.data || [];

      const branchBarbers = allBarbers.filter((barber) => {
        const primaryBranchId = barber.branchId?._id || barber.branchId;

        const assignedBranches = barber.branches || [];

        const belongsToPrimaryBranch =
          primaryBranchId?.toString() === branchId.toString();

        const belongsToAssignedBranch = assignedBranches.some(
          (branch) =>
            (branch?._id || branch)?.toString() === branchId.toString(),
        );

        return belongsToPrimaryBranch || belongsToAssignedBranch;
      });

      setBarbers(branchBarbers);
    } catch (error) {
      console.error("Load barbers error:", error);

      setBarbers([]);
      setError(getErrorMessage(error, "Failed to load barbers"));
    } finally {
      setLoadingBarbers(false);
    }
  }, []);

  const loadBranches = useCallback(async () => {
    try {
      setLoadingBranches(true);
      setError("");

      const response = await getAllBranches();
      const data = response?.data || [];

      setBranches(data);

      const nextBranchId = selectedBranchId || data[0]?._id || "";

      if (!nextBranchId) {
        setSelectedBranchId("");
        setChairs([]);
        setBarbers([]);
        return;
      }

      setSelectedBranchId(nextBranchId);

      await Promise.all([loadChairs(nextBranchId), loadBarbers(nextBranchId)]);
    } catch (error) {
      console.error("Load branches error:", error);

      setError(getErrorMessage(error, "Failed to load branches"));
    } finally {
      setLoadingBranches(false);
    }
  }, [selectedBranchId, loadChairs, loadBarbers]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadBranches();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadBranches]);

  const handleBranchChange = useCallback(
    async (branchId) => {
      setSelectedBranchId(branchId);
      setSearch("");
      setStatusFilter("all");

      if (!branchId) {
        setChairs([]);
        setBarbers([]);
        return;
      }

      await Promise.all([loadChairs(branchId), loadBarbers(branchId)]);
    },
    [loadChairs, loadBarbers],
  );

  const handleCreateChair = useCallback(
    async (data) => {
      try {
        setActionLoading(true);
        setError("");

        await chairService.createChair(data);

        setShowCreateModal(false);

        await loadChairs(selectedBranchId);
      } catch (error) {
        console.error("Create chair error:", error);

        setError(getErrorMessage(error, "Failed to create chair"));
      } finally {
        setActionLoading(false);
      }
    },
    [selectedBranchId, loadChairs],
  );

  const handleEditChair = useCallback((chair) => {
    setSelectedChair(chair);
    setShowEditModal(true);
  }, []);

  const handleUpdateChair = useCallback(
    async (id, data) => {
      try {
        setActionLoading(true);
        setError("");

        await chairService.updateChair(id, data);

        setShowEditModal(false);
        setSelectedChair(null);

        await loadChairs(selectedBranchId);
      } catch (error) {
        console.error("Update chair error:", error);

        setError(getErrorMessage(error, "Failed to update chair"));
      } finally {
        setActionLoading(false);
      }
    },
    [selectedBranchId, loadChairs],
  );

  const handleDeleteChair = useCallback(
    async (chair) => {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${chair.name}"?`,
      );

      if (!confirmed) return;

      try {
        setActionLoading(true);
        setError("");

        await chairService.deleteChair(chair._id);

        await loadChairs(selectedBranchId);
      } catch (error) {
        console.error("Delete chair error:", error);

        setError(getErrorMessage(error, "Failed to delete chair"));
      } finally {
        setActionLoading(false);
      }
    },
    [selectedBranchId, loadChairs],
  );

  const handleViewChair = useCallback((chair) => {
    setSelectedChair(chair);
    setShowDetailsModal(true);
  }, []);

  const filteredChairs = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return chairs.filter((chair) => {
      const matchesSearch =
        !searchText ||
        chair.name?.toLowerCase().includes(searchText) ||
        String(chair.number).includes(searchText) ||
        chair.type?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "operational" && chair.isOperational) ||
        (statusFilter === "non_operational" && !chair.isOperational);

      return matchesSearch && matchesStatus;
    });
  }, [chairs, search, statusFilter]);

  const stats = useMemo(() => {
    const operational = chairs.filter((chair) => chair.isOperational).length;

    const nonOperational = chairs.filter(
      (chair) => !chair.isOperational,
    ).length;

    const shared = chairs.filter((chair) => chair.isShared).length;

    return {
      total: chairs.length,
      operational,
      nonOperational,
      shared,
    };
  }, [chairs]);

  const selectedBranch = useMemo(
    () => branches.find((branch) => branch._id === selectedBranchId),
    [branches, selectedBranchId],
  );

  const clearError = useCallback(() => {
    setError("");
  }, []);

  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
    setSelectedChair(null);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setShowDetailsModal(false);
    setSelectedChair(null);
  }, []);

  return {
    branches,
    selectedBranchId,
    selectedBranch,
    chairs,
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
    setShowEditModal,

    showDetailsModal,
    setShowDetailsModal,

    selectedChair,

    handleBranchChange,
    handleCreateChair,
    handleEditChair,
    handleUpdateChair,
    handleDeleteChair,
    handleViewChair,

    closeEditModal,
    closeDetailsModal,
  };
}
