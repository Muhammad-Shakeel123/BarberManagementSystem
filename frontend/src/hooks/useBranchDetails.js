import { useCallback, useEffect, useState } from "react";

import { getBranchById } from "@/services/branch.service";

export function useBranchDetails(branchId) {
  const [branch, setBranch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadBranch = useCallback(async () => {
    if (!branchId) {
      setBranch(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(false);

      const response = await getBranchById(branchId);

      console.log("BRANCH DETAILS:", response);

      setBranch(response?.data || null);
    } catch (error) {
      console.error("Branch details error:", error);

      setError(true);
      setBranch(null);
    } finally {
      setIsLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadBranch();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadBranch]);

  return {
    branch,
    isLoading,
    error,
    loadBranch,
  };
}