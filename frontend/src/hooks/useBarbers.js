import { useCallback, useEffect, useState } from "react";

import {
  getAllBarbers,
  deleteBarberProfile,
} from "@/services/barber.service";

export function useBarbers() {
  const [barbers, setBarbers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBarbers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getAllBarbers();

      setBarbers(response?.data || []);
    } catch (err) {
      console.error("Barbers error:", err);

      setError(
        err?.response?.data?.message || "Unable to load barbers.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBarbers();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadBarbers]);

  const handleCreateSuccess = (newBarber) => {
    if (newBarber) {
      setBarbers((prev) => [newBarber, ...prev]);
    }
  };

  const handleUpdateSuccess = (updatedBarber) => {
    if (updatedBarber) {
      setBarbers((prev) =>
        prev.map((barber) =>
          barber._id === updatedBarber._id
            ? updatedBarber
            : barber,
        ),
      );
    }
  };

  const handleDelete = async (barber) => {
    const barberName =
      barber?.userId?.name || "this barber";

    const confirmed = window.confirm(
      `Are you sure you want to deactivate ${barberName}?`,
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteBarberProfile(barber._id);

      setBarbers((prev) =>
        prev.filter((item) => item._id !== barber._id),
      );
    } catch (err) {
      console.error("Delete barber error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to deactivate barber.",
      );
    }
  };

  return {
    barbers,
    isLoading,
    error,
    loadBarbers,
    handleCreateSuccess,
    handleUpdateSuccess,
    handleDelete,
  };
}