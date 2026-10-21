import { useMemo, useState } from "react";

function useBookingSelection({
  customers,
  branches,
  barbers,
  services,
  isAdmin,
  user,
}) {
  const [customerId, setCustomerId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [barberId, setBarberId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");

  const selectedCustomer = isAdmin
    ? customers.find(
        (customer) => customer._id === customerId,
      )
    : user;

  const selectedBranch = branches.find(
    (branch) => branch._id === branchId,
  );

  const selectedBarber = barbers.find(
    (barber) => barber._id === barberId,
  );

  const selectedService = services.find(
    (service) => service._id === serviceId,
  );

  const branchBarbers = useMemo(() => {
    if (!branchId) {
      return [];
    }

    return barbers.filter((barber) => {
      if (!barber?.isActive) {
        return false;
      }

      const primaryBranch =
        barber?.branchId?._id || barber?.branchId;

      const additionalBranches = barber?.branches || [];

      return (
        primaryBranch?.toString() === branchId?.toString() ||
        additionalBranches.some(
          (branch) =>
            (branch?._id || branch)?.toString() ===
            branchId?.toString(),
        )
      );
    });
  }, [barbers, branchId]);

  const barberServices = useMemo(() => {
    if (!barberId) {
      return services;
    }

    const selectedBarber = barbers.find(
      (barber) =>
        barber?._id?.toString() === barberId?.toString(),
    );

    if (!selectedBarber) {
      return services;
    }

    const specialties = selectedBarber?.specialties || [];

    if (specialties.length === 0) {
      return services;
    }

    return services.filter((service) =>
      specialties.some(
        (specialty) =>
          (specialty?._id || specialty)?.toString() ===
          service?._id?.toString(),
      ),
    );
  }, [barberId, barbers, services]);

  const handleBranchChange = (value, resetExtra) => {
    setBranchId(value);
    setBarberId("");
    setServiceId("");

    resetExtra?.();

  };

  const handleBranchSelect = (branch, resetExtra) => {
    setBranchId(branch._id);
    setBarberId("");
    setServiceId("");

    resetExtra?.();
  };

  const resetSelection = () => {
    setCustomerId("");
    setBranchId("");
    setBarberId("");
    setServiceId("");
    setDate("");
  };

  const resetAppointmentSelection = () => {
    setBranchId("");
    setBarberId("");
    setServiceId("");
    setDate("");
  };

  return {
    customerId,
    setCustomerId,

    branchId,
    setBranchId,

    barberId,
    setBarberId,

    serviceId,
    setServiceId,

    date,
    setDate,

    branchBarbers,
    barberServices,

    selectedCustomer,
    selectedBranch,
    selectedBarber,
    selectedService,

    handleBranchChange,
    handleBranchSelect,

    resetSelection,
    resetAppointmentSelection,
  };
}

export default useBookingSelection;