import moment from "moment-timezone";
import Appointment from "../../models/appointment.model.js";
import StateMachine from "../stateMachine.service.js";
import SlotService from "../slot/slot.service.js";
import LockService from "../lock.service.js";
import { emitEvent } from "../../websockets/socket.js";
import { emitAppointmentToUsers } from "../../websockets/appointmentEvents.js";
import { SOCKET_EVENTS, APPOINTMENT_STATUS } from "../../constant.js";
import { ApiError } from "../../utils/ApiError.js";
import logger from "../../config/logger.js";

class AppointmentRescheduleService {
  static async reschedule(appointmentId, newStartTime, reason, userId) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new ApiError(404, "Appointment not found");

    if (userId && appointment.customerId?.toString() !== userId.toString()) {
      throw new ApiError(403, "You are not allowed to reschedule this appointment");
    }

    if (StateMachine.isTerminal(appointment.status)) {
      throw new ApiError(400, "Cannot reschedule completed or cancelled appointment");
    }

    if (appointment.status === APPOINTMENT_STATUS.IN_PROGRESS) {
      throw new ApiError(400, "Cannot reschedule an in-progress appointment");
    }

    const newStart = new Date(newStartTime);
    if (Number.isNaN(newStart.getTime())) {
      throw new ApiError(400, "Invalid newStartTime");
    }

    const totalDuration = await SlotService.calculateTotalDuration(
      appointment.serviceIds,
      appointment.branchId,
    );

    const newEndTime = moment(newStart).add(totalDuration, "minutes").toDate();

    const lockKey = `lock:appt:${appointment.branchId}:${appointment.barberId || "any"}:${appointment.chairId || "any"}:${newStart.getTime()}`;
    const token = await LockService.acquire(lockKey, 5000);

    if (!token) {
      throw new ApiError(409, "New slot is being booked by another user");
    }

    try {
      const barberFree = await SlotService.isBarberFree(
        appointment.barberId,
        newStart,
        newEndTime,
        appointment._id,
      );

      if (!barberFree) {
        throw new ApiError(409, "Barber is not available at the new time");
      }

      const chairFree = await SlotService.isChairFree(
        appointment.chairId,
        newStart,
        newEndTime,
        appointment._id,
      );

      if (!chairFree) {
        throw new ApiError(409, "Chair is not available at the new time");
      }

      appointment.rescheduleHistory.push({
        from: appointment.startTime,
        to: newStart,
        reason: reason || "Rescheduled by customer/barber",
        updatedAt: new Date(),
      });

      if (!appointment.originalStartTime) {
        appointment.originalStartTime = appointment.startTime;
      }

      appointment.startTime = newStart;
      appointment.endTime = newEndTime;
      appointment.status = APPOINTMENT_STATUS.BOOKED;

      await appointment.save();

      emitEvent(`branch_${appointment.branchId}`, SOCKET_EVENTS.APPOINTMENT_UPDATED, {
        appointmentId: appointment._id,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
      });
      await emitAppointmentToUsers(appointment, SOCKET_EVENTS.APPOINTMENT_UPDATED, {
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
      });

      logger.info(`Appointment ${appointmentId} rescheduled to ${newStart}`);

      return appointment;
    } finally {
      await LockService.release(lockKey, token);
    }
  }
}

export default AppointmentRescheduleService;
