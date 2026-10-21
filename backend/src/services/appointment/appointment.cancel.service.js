import Appointment from "../../models/appointment.model.js";
import Payment from "../../models/payment.model.js";
import Service from "../../models/service.model.js";
import BarberProfile from "../../models/barberProfile.model.js";
import StateMachine from "../stateMachine.service.js";
import QueueService from "../queue/queue.service.js";
import { emitEvent } from "../../websockets/socket.js";
import { emitAppointmentToUsers } from "../../websockets/appointmentEvents.js";
import { SOCKET_EVENTS, APPOINTMENT_STATUS, PAYMENT_STATUS } from "../../constant.js";
import { ApiError } from "../../utils/ApiError.js";
import logger from "../../config/logger.js";

class AppointmentCancelService {
  static async cancel(appointmentId, userId, isAdmin = false) {
    const appointment = await Appointment.findById(appointmentId).populate("paymentId");

    if (!appointment) throw new ApiError(404, "Appointment not found");

    if (!isAdmin && appointment.customerId.toString() !== userId) {
      const barberProfile = await BarberProfile.findOne({ userId });

      if (!barberProfile || barberProfile._id.toString() !== appointment.barberId?.toString()) {
        throw new ApiError(403, "Not authorized to cancel this appointment");
      }
    }

    if (StateMachine.isTerminal(appointment.status)) {
      throw new ApiError(400, "Cannot cancel a completed or already cancelled appointment");
    }

    if (appointment.status === APPOINTMENT_STATUS.IN_PROGRESS) {
      throw new ApiError(400, "Cannot cancel an in-progress appointment");
    }

    const payment = appointment.paymentId;

    if (payment && payment.status === PAYMENT_STATUS.PAID) {
      const services = await Service.find({
        _id: { $in: appointment.serviceIds },
      });

      const isRefundable = services.every((service) => service.isDepositRefundable !== false);

      if (isRefundable) {
        logger.info(`Appointment ${appointmentId} refund eligible.`);
      } else {
        logger.info(
          `Appointment ${appointmentId} has non-refundable deposit: ${payment.depositAmount}`,
        );
      }
    }

    await StateMachine.transition(
      appointment,
      APPOINTMENT_STATUS.CANCELLED,
      userId,
      `Cancelled by ${isAdmin ? "admin" : "user"}`,
    );

    await QueueService.assignSlotToNextWaiting(appointment.branchId, appointment.startTime);

    emitEvent(`branch_${appointment.branchId}`, SOCKET_EVENTS.APPOINTMENT_CANCELLED, {
      appointmentId: appointment._id,
      startTime: appointment.startTime,
    });
    await emitAppointmentToUsers(appointment, SOCKET_EVENTS.APPOINTMENT_CANCELLED, {
      startTime: appointment.startTime,
      status: appointment.status,
    });

    logger.info(`Appointment ${appointmentId} cancelled by ${userId}`);

    return appointment;
  }
}

export default AppointmentCancelService;
