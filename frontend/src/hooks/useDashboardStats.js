import { useEffect, useState } from "react";
import { getDashboardStats } from "@/services/dashboard.service";

export function useDashboardStats() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getDashboardStats();

        if (isMounted) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Dashboard stats error:", error);

        if (isMounted) {
          setError("Failed to load dashboard statistics.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboardStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    stats,
    isLoading,
    error,
  };
}
