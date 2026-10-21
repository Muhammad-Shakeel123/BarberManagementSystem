import Appointment from "../../models/appointment.model.js";
import BarberProfile from "../../models/barberProfile.model.js";
import StateMachine from "../stateMachine.service.js";
import QueueService from "../queue/queue.service.js";
import Queue from "../../models/queue.model.js";
import { emitEvent } from "../../websockets/socket.js";
import { emitAppointmentToUsers } from "../../websockets/appointmentEvents.js";
import { APPOINTMENT_STATUS, QUEUE_STATUS, SOCKET_EVENTS } from "../../constant.js";
import { ApiError } from "../../utils/ApiError.js";
import logger from "../../config/logger.js";

class AppointmentStatusService {
  static async markNoShow(appointmentId) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return null;

    if (
      appointment.status !== APPOINTMENT_STATUS.BOOKED &&
      appointment.status !== APPOINTMENT_STATUS.CONFIRMED
    ) {
      return null;
    }

    await StateMachine.transition(
      appointment,
      APPOINTMENT_STATUS.NO_SHOW,
      "system",
      "Automatically marked as no-show",
    );

    await emitAppointmentToUsers(appointment, SOCKET_EVENTS.APPOINTMENT_UPDATED, {
      status: appointment.status,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
    });

    await QueueService.assignSlotToNextWaiting(appointment.branchId, appointment.startTime);

    logger.info(`Appointment ${appointmentId} marked as no-show`);

    return appointment;
  }

  static async updateStatus(appointmentId, newStatus, userId) {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      throw new ApiError(404, "Appointment not found");
    }

    const barberProfile = await BarberProfile.findOne({ userId });
    const isAdmin = await this.isAdmin(userId);

    if (!isAdmin) {
      if (!barberProfile || barberProfile._id.toString() !== appointment.barberId?.toString()) {
        throw new ApiError(403, "Not authorized to update this appointment");
      }
    }

    const updatedAppointment = await StateMachine.transition(appointment, newStatus, userId);

    await emitAppointmentToUsers(updatedAppointment, SOCKET_EVENTS.APPOINTMENT_UPDATED, {
      status: updatedAppointment.status,
      startTime: updatedAppointment.startTime,
      endTime: updatedAppointment.endTime,
    });

    /*
     * If appointment is completed,
     * complete the linked queue entry as well.
     */
    if (newStatus === APPOINTMENT_STATUS.COMPLETED) {
      const queueEntry = await Queue.findOneAndUpdate(
        {
          appointmentId: updatedAppointment._id,
          status: QUEUE_STATUS.IN_PROGRESS,
        },
        {
          $set: {
            status: QUEUE_STATUS.COMPLETED,
            endedAt: new Date(),
          },
        },
        {
          new: true,
        },
      );

      /*
       * Notify Queue Management frontend
       */
      if (queueEntry) {
        emitEvent(`queue_${updatedAppointment.branchId}`, SOCKET_EVENTS.QUEUE_UPDATED, {
          queueId: queueEntry._id,
          appointmentId: updatedAppointment._id,
          customerId: queueEntry.customerId,
          status: QUEUE_STATUS.COMPLETED,
        });

        logger.info(`Queue ${queueEntry._id} completed with appointment ${updatedAppointment._id}`);
      }
    }

    return updatedAppointment;
  }

  static async isAdmin(userId) {
    const User = (await import("../../models/user.model.js")).default;
    const user = await User.findById(userId);
    return !!user && user.role === "admin";
  }
}

export default AppointmentStatusService;
