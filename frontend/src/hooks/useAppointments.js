import { useState, useEffect, useMemo, useCallback } from "react";
import { getAllBranches } from "@/services/branch.service";
import {
  getBranchAppointments,
  getMonthlyBranchAppointments,
  getActiveBranchAppointments,
  updateAppointmentStatus,
} from "@/services/appointment.service";
import { getBarberAppointments } from "@/services/barber.service";

const getToday = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

export function useAppointments(view, barberId) {
  const [branches, setBranches] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [date, setDate] = useState(getToday());
  const [branchId, setBranchId] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

const loadAppointments = useCallback(
  async ({
    refresh = false,
    resetFilters = false,
  } = {}) => {
    try {
      setError("");

      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      // If refresh/reset is requested,
      // use fresh default filter values immediately.
      const currentDate = resetFilters ? getToday() : date;
      const currentBranchId = resetFilters ? "all" : branchId;
      const currentStatus = resetFilters ? "all" : status;

      // Refresh par branches bhi dobara load hongi
      let branchList = branches;

      if (refresh || !branchList.length) {
        const branchResponse = await getAllBranches();

        branchList = branchResponse?.data || [];

        setBranches(branchList);
      }

      // Barber-specific appointments
      if (barberId) {
        const response = await getBarberAppointments(barberId, {
          ...(currentStatus !== "all"
            ? { status: currentStatus }
            : {}),
          ...(currentDate
            ? {
                from: `${currentDate}T00:00:00`,
                to: `${currentDate}T23:59:59`,
              }
            : {}),
        });

        const barberAppointments = response?.data || [];

        const appointmentsWithBranch = barberAppointments.map((app) => ({
          ...app,
          branchName:
            app.branchId?.name ||
            branchList.find(
              (b) =>
                b._id ===
                (app.branchId?._id || app.branchId),
            )?.name ||
            "Unknown branch",
        }));

        setAppointments(appointmentsWithBranch);

        return;
      }

      // Selected branches
      const selectedBranches =
        currentBranchId === "all"
          ? branchList.filter((b) => b.isActive !== false)
          : branchList.filter(
              (b) => b._id === currentBranchId,
            );

      const responses = await Promise.all(
        selectedBranches.map((branch) => {
          if (view === "month") {
            return getMonthlyBranchAppointments(branch._id);
          }

          if (view === "active") {
            return getActiveBranchAppointments(branch._id);
          }

          return getBranchAppointments(branch._id, {
            date: currentDate,
            ...(currentStatus !== "all"
              ? { status: currentStatus }
              : {}),
          });
        }),
      );

      const allAppointments = responses.flatMap(
        (res) => res?.data || [],
      );

      const appointmentsWithBranch = allAppointments.map(
        (app) => ({
          ...app,
          branchName:
            app.branchId?.name ||
            branchList.find(
              (b) =>
                b._id ===
                (app.branchId?._id || app.branchId),
            )?.name ||
            "Unknown branch",
        }),
      );

      setAppointments(appointmentsWithBranch);
    } catch (err) {
      console.error("Appointments loading error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load appointments. Please try again.",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  },
  [date, branchId, status, view, barberId, branches],
);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadAppointments();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [loadAppointments]);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      setUpdatingStatusId(appointmentId);
      setError("");
      await updateAppointmentStatus(appointmentId, newStatus);
      await loadAppointments({ refresh: true });
      setSelectedAppointment(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to update status.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const filteredAppointments = useMemo(() => {
    const searchValue = search.trim().toLowerCase();
    let result = appointments;

    if (barberId && branchId !== "all") {
      result = result.filter(
        (app) => (app.branchId?._id || app.branchId) === branchId,
      );
    }

    if (!searchValue) return result;

    return result.filter((app) => {
      const name = app.customerId?.name?.toLowerCase() || "";
      const phone = app.customerId?.phone?.toLowerCase() || "";
      const email = app.customerId?.email?.toLowerCase() || "";
      const services =
        app.serviceIds
          ?.map((s) => s.name)
          .join(" ")
          .toLowerCase() || "";
      const branch = app.branchName?.toLowerCase() || "";

      return (
        name.includes(searchValue) ||
        phone.includes(searchValue) ||
        email.includes(searchValue) ||
        services.includes(searchValue) ||
        branch.includes(searchValue)
      );
    });
  }, [appointments, search, barberId, branchId]);

  // const stats = useMemo(
  //   () => ({
  //     total: appointments.length,
  //     booked: appointments.filter((app) => app.status === "booked").length,
  //     inProgress: appointments.filter((app) => app.status === "in_progress")
  //       .length,
  //     completed: appointments.filter(
  //       (app) => app.status === "complete" || app.status === "completed",
  //     ).length,
  //   }),
  //   [appointments],
  // );

const handleRefresh = useCallback(async () => {
  // Reset UI filters
  setDate(getToday());
  setBranchId("all");
  setStatus("all");
  setSearch("");
  await loadAppointments({
    refresh: true,
    resetFilters: true,
  });
}, [loadAppointments]);

  return {
    branches,
    appointments,
    filteredAppointments,
    // stats,
    date,
    setDate,
    branchId,
    setBranchId,
    status,
    setStatus,
    search,
    setSearch,
    selectedAppointment,
    setSelectedAppointment,
    isLoading,
    isRefreshing,
    error,
    loadAppointments,
    handleStatusUpdate,
    updatingStatusId,
    handleRefresh
  };
}
