import { useCallback, useEffect, useState } from "react";

import {
  getAllBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from "@/services/branch.service";

export function useBranches() {
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadBranches = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(false);

      const response = await getAllBranches();

      console.log("BRANCHES:", response);

      setBranches(response?.data || []);
    } catch (error) {
      console.error("Branches error:", error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadBranches();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadBranches]);

  const createNewBranch = async (formData) => {
    try {
      setError(false);

      const response = await createBranch(formData);

      console.log("BRANCH CREATED:", response);

      const newBranch = response?.data;

      if (newBranch?._id) {
        setBranches((prev) => [newBranch, ...prev]);
      } else {
        await loadBranches();
      }

      return {
        success: true,
        data: newBranch,
      };
    } catch (error) {
      console.error("Create branch error:", error);
      setError(true);

      return {
        success: false,
        error,
      };
    }
  };

  const updateExistingBranch = async (branchId, formData) => {
    if (!branchId) {
      return {
        success: false,
      };
    }

    try {
      setError(false);

      const response = await updateBranch(branchId, formData);

      console.log("BRANCH UPDATED:", response);

      const updatedBranch = response?.data;

      if (updatedBranch?._id) {
        setBranches((prev) =>
          prev.map((branch) =>
            branch._id === updatedBranch._id
              ? updatedBranch
              : branch,
          ),
        );
      } else {
        await loadBranches();
      }

      return {
        success: true,
        data: updatedBranch,
      };
    } catch (error) {
      console.error("Update branch error:", error);
      setError(true);

      return {
        success: false,
        error,
      };
    }
  };

  const deactivateBranch = async (branch) => {
    if (!branch?._id) {
      return {
        success: false,
      };
    }

    const confirmed = window.confirm(
      `Are you sure you want to deactivate "${branch.name}"?`,
    );

    if (!confirmed) {
      return {
        success: false,
        cancelled: true,
      };
    }

    try {
      setError(false);

      await deleteBranch(branch._id);

      setBranches((prev) =>
        prev.map((item) =>
          item._id === branch._id
            ? {
                ...item,
                isActive: false,
              }
            : item,
        ),
      );

      return {
        success: true,
      };
    } catch (error) {
      console.error("Deactivate branch error:", error);
      setError(true);

      return {
        success: false,
        error,
      };
    }
  };

  return {
    branches,
    isLoading,
    error,
    loadBranches,
    createNewBranch,
    updateExistingBranch,
    deactivateBranch,
  };
}