import { useState } from "react";

import { getBarberAvailability } from "@/services/barber.service";

import {
  bookAppointment,
  bookWalkInAppointment,
} from "@/services/appointment.service";

import { createPaymentIntent } from "@/services/payment.service";

function useBookingAppointment({
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

  setQueueEntry,
}) {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(0);

  // Payment pending after appointment creation
  const [pendingPayment, setPendingPayment] = useState(null);
  const [creatingPaymentIntent, setCreatingPaymentIntent] =
    useState(false);

  const handleCheckAvailability = async () => {
    const targetCustomerId = isAdmin
      ? customerId
      : user?._id || user?.id;

    if (isAdmin && !targetCustomerId) {
      setError("Please select a customer.");
      return;
    }

    if (!branchId || !barberId || !serviceId || !date) {
      setError(
        "Please fill out all required fields (Branch, Barber, Service, Date).",
      );
      return;
    }

    try {
      setLoadingSlots(true);
      setError("");
      setSuccess("");

      setSlots([]);
      setSelectedSlot(null);
      setQueueEntry(null);

      const response = await getBarberAvailability(
        barberId,
        date,
        [serviceId],
      );

      const availableSlots = response?.data || [];

      setSlots(availableSlots);
      setSelectedSlot(null);
      setQueueEntry(null);

      const hasAvailableSlot = availableSlots.some(
        (slot) => slot.available,
      );

      if (!hasAvailableSlot) {
        setQueueEntry({
          branchId,
          barberId,
          serviceId,
          date,
        });
      }
    } catch (err) {
      console.error("Availability error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load available slots.",
      );
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBookAppointment = async () => {
    const targetCustomerId = isAdmin
      ? customerId
      : user?._id || user?.id;

    if (!targetCustomerId) {
      setError("Customer identification is missing.");
      return;
    }

    if (!selectedSlot) {
      setError("Please select an available slot.");
      return;
    }

    try {
      setBooking(true);
      setError("");
      setSuccess("");

      /*
       * ADMIN
       * Keep existing walk-in flow unchanged.
       */
      if (isAdmin) {
        await bookWalkInAppointment({
          customerId: targetCustomerId,
          branchId,
          barberId,
          serviceIds: [serviceId],
          startTime: selectedSlot.start,
          isWalkIn: true,
        });

        setSuccess(
          "Walk-in appointment booked successfully.",
        );

        resetAppointmentSelection();

        setSlots([]);
        setSelectedSlot(null);
        setQueueEntry(null);

        return;
      }

      /*
       * CUSTOMER
       *
       * Create appointment only.
       * Payment record is created by backend,
       * but Stripe PaymentIntent is NOT created here.
       */
      const response = await bookAppointment({
        customerId: targetCustomerId,
        branchId,
        barberId,
        serviceIds: [serviceId],
        startTime: selectedSlot.start,
        isWalkIn: false,
      });

      const appointment = response?.data;

      if (!appointment?._id) {
        throw new Error(
          "Appointment was created but appointment ID was not returned.",
        );
      }

      /*
       * Keep appointment/payment information temporarily.
       * Stripe intent will only be created when
       * customer clicks Pay Now.
       */
      setPendingPayment({
        appointmentId: appointment._id,
        amount: appointment.totalAmount || 0,
      });

      setSuccess(
        "Appointment booked successfully. You can pay now or pay later.",
      );

      setSlots([]);
      setSelectedSlot(null);
      setQueueEntry(null);
    } catch (err) {
      console.error("Booking error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to book appointment.",
      );
    } finally {
      setBooking(false);
    }
  };

  /*
   * Pay Now
   *
   * Stripe PaymentIntent is created ONLY here.
   */
  const handlePayNow = async () => {
    if (!pendingPayment?.appointmentId) {
      setError("Payment information is missing.");
      return;
    }

    try {
      setCreatingPaymentIntent(true);
      setError("");

      const paymentResponse = await createPaymentIntent(
        pendingPayment.appointmentId,
        "card",
      );

      const paymentData = paymentResponse?.data;

      if (!paymentData?.clientSecret) {
        throw new Error(
          "Payment intent was created but Stripe client secret was not returned.",
        );
      }

      setPaymentClientSecret(paymentData.clientSecret);

      setPaymentAmount(
        paymentData.amount ||
          pendingPayment.amount ||
          0,
      );

      setPaymentOpen(true);
    } catch (err) {
      console.error("Create payment intent error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to start payment.",
      );
    } finally {
      setCreatingPaymentIntent(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentOpen(false);

    setPaymentClientSecret("");
    setPaymentAmount(0);
    setPendingPayment(null);

    setSuccess(
      "Appointment booked and payment completed successfully.",
    );

    resetAppointmentSelection();

    setSlots([]);
    setSelectedSlot(null);
    setQueueEntry(null);
  };

  const handlePaymentClose = () => {
    setPaymentOpen(false);

    setPaymentClientSecret("");
    setPaymentAmount(0);

    /*
     * Do NOT clear pendingPayment.
     *
     * Customer can still click Pay Now later.
     */
    setSuccess(
      "Appointment created. Payment is still pending.",
    );
  };

  return {
    slots,
    setSlots,

    selectedSlot,
    setSelectedSlot,

    loadingSlots,
    booking,

    paymentOpen,
    paymentClientSecret,
    paymentAmount,

    // Pending payment
    pendingPayment,
    creatingPaymentIntent,

    handleCheckAvailability,
    handleBookAppointment,

    // New Pay Now action
    handlePayNow,

    handlePaymentSuccess,
    handlePaymentClose,
  };
}

export default useBookingAppointment;