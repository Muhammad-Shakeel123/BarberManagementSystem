import { useEffect, useState } from "react";

import {
  addToQueue,
  assignNext,
  getMyQueueStatus,
  leaveQueue,
} from "@/services/queue.service";

function useBookingQueue({
  isAdmin,
  user,
  customerId,
  branchId,
  barberId,
  serviceId,
  resetAppointmentSelection,
  setError,
  setSuccess,
}) {
  const [queueEntry, setQueueEntry] = useState(null);
  const [joiningQueue, setJoiningQueue] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (isAdmin || !branchId) {
      return;
    }

    let isMounted = true;

    const loadQueueStatus = async () => {
      try {
        const response = await getMyQueueStatus(branchId);

        if (isMounted) {
          setQueueEntry(response?.data || null);
        }
      } catch (err) {
        console.error("Load customer queue status error:", err);
      }
    };

    void loadQueueStatus();

    return () => {
      isMounted = false;
    };
  }, [branchId, isAdmin]);

  const handleAddToQueue = async () => {
    const targetCustomerId = isAdmin ? customerId : user?._id || user?.id;

    if (!targetCustomerId) {
      setError("Customer identification is missing.");
      return;
    }

    if (!branchId || !serviceId) {
      setError("Please select Branch and Service first.");
      return;
    }

    try {
      setBooking(true);
      setError("");
      setSuccess("");

      await addToQueue({
        customerId: isAdmin ? targetCustomerId : undefined,
        branchId,
        requestedBarberId: barberId || undefined,
        serviceIds: [serviceId],
      });

      setSuccess("Customer added to queue successfully.");

      setQueueEntry(null);
      resetAppointmentSelection();
    } catch (err) {
      console.error("Add to queue error:", err);

      setError(
        err?.response?.data?.message || "Unable to add customer to queue.",
      );
    } finally {
      setBooking(false);
    }
  };

  const handleJoinQueue = async () => {
    const targetCustomerId = isAdmin ? customerId : user?._id || user?.id;

    if (!targetCustomerId) {
      setError("Customer identification is missing.");
      return;
    }

    if (!branchId || !barberId || !serviceId) {
      setError("Please select Branch, Barber and Service first.");
      return;
    }

    try {
      setJoiningQueue(true);
      setError("");
      setSuccess("");

      const response = await addToQueue({
        customerId: isAdmin ? targetCustomerId : undefined,
        branchId,
        requestedBarberId: barberId,
        serviceIds: [serviceId],
      });

      const queueData = response?.data;

      setQueueEntry(queueData);

      setSuccess(
        `Customer joined the queue successfully. Position: ${
          queueData?.position || "waiting"
        }.`,
      );
    } catch (err) {
      console.error("Join queue error:", err);

      setError(err?.response?.data?.message || "Unable to join the queue.");
    } finally {
      setJoiningQueue(false);
    }
  };

  const handleAssignNext = async () => {
    if (!isAdmin) {
      setError("Only admin can assign the next queue customer.");
      return;
    }

    if (!branchId || !barberId) {
      setError("Please select Branch and Barber first.");
      return;
    }

    try {
      setBooking(true);
      setError("");
      setSuccess("");

      const response = await assignNext({
        branchId,
        barberId,
      });

      const appointment = response?.data;

      if (!appointment) {
        setError(
          response?.data?.message ||
            response?.message ||
            "Queue assignment failed.",
        );
        return;
      }

      setSuccess("Next queue customer assigned successfully.");
    } catch (err) {
      console.error("Assign next queue customer error:", err);

      setError(
        err?.response?.data?.message || "Unable to assign next queue customer.",
      );
    } finally {
      setBooking(false);
    }
  };

  const handleLeaveQueue = async () => {
    if (!queueEntry?._id) {
      return;
    }

    try {
      setJoiningQueue(true);
      setError("");

      await leaveQueue(queueEntry._id);
      setQueueEntry(null);
      setSuccess("You left the waiting queue.");
    } catch (err) {
      console.error("Leave queue error:", err);

      setError(err?.response?.data?.message || "Unable to leave the queue.");
    } finally {
      setJoiningQueue(false);
    }
  };

  return {
    queueEntry,
    setQueueEntry,

    joiningQueue,
    booking,

    handleAddToQueue,
    handleJoinQueue,
    handleLeaveQueue,
    handleAssignNext,
  };
}

export default useBookingQueue;
