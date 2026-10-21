import mongoose from "mongoose";
import Appointment from "../../../models/appointment.model.js";
import Payment from "../../../models/payment.model.js";
import SlotService from "../../slot/slot.service.js";
import LockService from "../../lock.service.js";
import { emitEvent } from "../../../websockets/socket.js";
import { emitAppointmentToUsers } from "../../../websockets/appointmentEvents.js";
import { SOCKET_EVENTS, APPOINTMENT_STATUS, PAYMENT_STATUS } from "../../../constant.js";
import { ApiError } from "../../../utils/ApiError.js";
import logger from "../../../config/logger.js";

class AppointmentBookingPersistenceService {
  static async create({ context, idempotencyKey, createPayment = true, customerId }) {
    const {
      branchId,
      barberId,
      serviceIds,
      startTimeDate,
      endTime,
      chairId,
      totalAmount,
      depositAmount,
      chairTypeRequired,
      isWalkIn,
    } = context;

    const lockKey = `lock:appt:${branchId}:${barberId || "any"}:${chairId || "any"}:${startTimeDate.getTime()}`;
    const token = await LockService.acquire(lockKey, 5000);

    if (!token) {
      throw new ApiError(409, "Slot is being booked by another user. Please try again.");
    }

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      if (barberId) {
        const free = await SlotService.isBarberFree(barberId, startTimeDate, endTime);
        if (!free) throw new ApiError(409, "Barber is not available at this time");
      }

      let assignedChairId = chairId;

      if (assignedChairId) {
        const chairFree = await SlotService.isChairFree(assignedChairId, startTimeDate, endTime);
        if (!chairFree) throw new ApiError(409, "Chair is not available at this time");
      } else {
        const chair = await SlotService.findAvailableChair(
          branchId,
          startTimeDate,
          endTime,
          chairTypeRequired,
        );
        if (!chair) throw new ApiError(409, "No available chair for this service type");
        assignedChairId = chair._id;
      }

      const capacityOk = await SlotService.checkBranchCapacity(branchId, startTimeDate, endTime);
      if (!capacityOk) throw new ApiError(409, "Branch is at full capacity at this time");

      const customerOverlap = await SlotService.hasCustomerOverlap(
        customerId,
        startTimeDate,
        endTime,
      );
      if (customerOverlap) {
        throw new ApiError(409, "You already have an appointment at this time");
      }

      const appointment = new Appointment({
        customerId,
        branchId,
        barberId: barberId || null,
        chairId: assignedChairId,
        serviceIds,
        startTime: startTimeDate,
        endTime,
        totalAmount,
        depositPaid: 0,
        status: APPOINTMENT_STATUS.BOOKED,
        notes: context.notes,
        isWalkIn: !!isWalkIn,
      });

      await appointment.save({ session });

      if (createPayment) {
        const payment = new Payment({
          appointmentId: appointment._id,
          customerId,
          amount: totalAmount,
          depositAmount,
          status: PAYMENT_STATUS.PENDING,
          paymentMethod: "other",
          ...(idempotencyKey ? { idempotencyKey } : {}),
        });

        await payment.save({ session });

        appointment.paymentId = payment._id;

        await appointment.save({ session });
      }

      await session.commitTransaction();

      emitEvent(`branch_${branchId}`, SOCKET_EVENTS.APPOINTMENT_CREATED, {
        appointmentId: appointment._id,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        barberId: appointment.barberId,
      });
      await emitAppointmentToUsers(appointment, SOCKET_EVENTS.APPOINTMENT_CREATED, {
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        barberId: appointment.barberId,
      });

      logger.info(`Appointment created: ${appointment._id} for customer ${customerId}`);
      return appointment;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
      await LockService.release(lockKey, token);
    }
  }
}

export default AppointmentBookingPersistenceService;
