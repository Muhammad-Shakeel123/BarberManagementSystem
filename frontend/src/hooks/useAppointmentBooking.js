import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

import { createCustomer } from "@/services/user.service";

import useBookingData from "@/hooks/useBookingData";
import useBookingSelection from "@/hooks/useBookingSelection";
import useBookingQueue from "@/hooks/useBookingQueue";
import useBookingAppointment from "@/hooks/useBookingAppointment";

function useAppointmentBooking({ isAdmin }) {
  const { user } = useAuth();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [creatingCustomer, setCreatingCustomer] = useState(false);

  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  /*
   * Data
   */
  const {
    customers,
    setCustomers,

    branches,
    showAllBranches,

    barbers,
    services,

    loadingData,
    error: dataError,

    handleShowAllBranches,
    handleShowNearbyBranches,
  } = useBookingData({
    isAdmin,
    user,
  });

  /*
   * Selection
   */
  const {
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

    resetAppointmentSelection: resetSelection,
  } = useBookingSelection({
    customers,
    branches,
    barbers,
    services,
    isAdmin,
    user,
  });

  /*
   * Reset appointment selection
   */
  const resetAppointmentSelection = () => {
    resetSelection();
  };

  /*
   * Customer creation
   */
  const handleCreateCustomer = async (event) => {
    event.preventDefault();

    if (
      !customerForm.name.trim() ||
      !customerForm.email.trim() ||
      !customerForm.phone.trim()
    ) {
      setError("All customer fields are required.");
      return;
    }

    try {
      setCreatingCustomer(true);
      setError("");
      setSuccess("");

      const response = await createCustomer({
        name: customerForm.name.trim(),
        email: customerForm.email.trim(),
        phone: customerForm.phone.trim(),
      });

      const newCustomer = response?.data;

      if (!newCustomer?._id) {
        throw new Error(
          "Customer was created but no customer ID was returned.",
        );
      }

      setCustomers((prev) => [newCustomer, ...prev]);

      setCustomerId(newCustomer._id);

      setCustomerForm({
        name: "",
        email: "",
        phone: "",
      });

      setShowCustomerModal(false);

      setSuccess(
        `Customer "${newCustomer.name}" created and selected successfully.`,
      );
    } catch (err) {
      console.error("Create customer error:", err);

      setError(err?.response?.data?.message || "Unable to create customer.");
    } finally {
      setCreatingCustomer(false);
    }
  };

  /*
   * Queue
   */
  const queue = useBookingQueue({
    isAdmin,
    user,

    customerId,
    branchId,
    barberId,
    serviceId,

    resetAppointmentSelection,

    setError,
    setSuccess,
  });

  /*
   * Appointment
   */
  const appointment = useBookingAppointment({
    isAdmin,
    user,

    customerId,
    branchId,
    barberId,
    serviceId,
    date,

    resetAppointmentSelection,

    setError,
    setSuccess,

    setQueueEntry: queue.setQueueEntry,
  });

  /*
   * Date helpers
   */
  const getTodayDate = () => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Karachi",
    }).format(new Date());
  };

  const getMaxBookingDate = () => {
    const today = new Date(`${getTodayDate()}T00:00:00`);

    today.setDate(today.getDate() + 30);

    return today.toISOString().split("T")[0];
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-PK", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  /*
   * Branch change
   */
  const handleBranchChange = (value) => {
    setBranchId(value);

    setBarberId("");
    setServiceId("");

    appointment.setSlots([]);
    appointment.setSelectedSlot(null);

    setError("");
    setSuccess("");
  };

  /*
   * Customer branch selection
   */
  const handleBranchSelect = (branch) => {
    setBranchId(branch._id);

    setBarberId("");
    setServiceId("");

    appointment.setSlots([]);
    appointment.setSelectedSlot(null);

    setError("");
    setSuccess("");
  };

  /*
   * Combined state
   */
  const loadingSlots = appointment.loadingSlots;

  const booking = appointment.booking || queue.booking;

  /*
   * Final public API
   *
   * IMPORTANT:
   * Names remain compatible with the old hook.
   */
  return {
    /*
     * Data
     */
    customers,
    branches,
    showAllBranches,
    barbers,
    services,

    /*
     * Selection
     */
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

    /*
     * Slots
     */
    slots: appointment.slots,

    selectedSlot: appointment.selectedSlot,

    setSelectedSlot: appointment.setSelectedSlot,

    /*
     * Loading
     */
    loadingData,
    loadingSlots,

    booking,

    creatingCustomer,
    joiningQueue: queue.joiningQueue,

    /*
     * Customer modal
     */
    showCustomerModal,
    setShowCustomerModal,

    /*
     * Queue
     */
    queueEntry: queue.queueEntry,

    /*
     * Payment
     */
    paymentOpen: appointment.paymentOpen,

    paymentClientSecret: appointment.paymentClientSecret,

    paymentAmount: appointment.paymentAmount,

    pendingPayment: appointment.pendingPayment,

    creatingPaymentIntent: appointment.creatingPaymentIntent,

    /*
     * Customer form
     */
    customerForm,
    setCustomerForm,

    /*
     * Messages
     */
    error: error || dataError,
    success,

    /*
     * Derived data
     */
    branchBarbers,
    barberServices,

    selectedCustomer,
    selectedBranch,
    selectedBarber,
    selectedService,

    /*
     * Actions
     */
    handleCreateCustomer,

    handleCheckAvailability: appointment.handleCheckAvailability,

    handleShowAllBranches,

    handleShowNearbyBranches,

    handleAddToQueue: queue.handleAddToQueue,

    handleJoinQueue: queue.handleJoinQueue,

    handleAssignNext: queue.handleAssignNext,

    handleBookAppointment: appointment.handleBookAppointment,

    handlePaymentSuccess: appointment.handlePaymentSuccess,

    handlePaymentClose: appointment.handlePaymentClose,
    handlePayNow: appointment.handlePayNow,

    handleBranchChange,
    handleBranchSelect,

    /*
     * Helpers
     */
    getTodayDate,
    getMaxBookingDate,
    formatTime,

    /*
     * Messages
     */
    clearError: () => setError(""),

    clearSuccess: () => setSuccess(""),
  };
}

export default useAppointmentBooking;
