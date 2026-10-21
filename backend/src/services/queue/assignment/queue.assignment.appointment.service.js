import Queue from "../../../models/queue.model.js";
import AppointmentBookingService from "../../appointment/appointment.booking.service.js";
import SlotService from "../../slot/slot.service.js";
import QueueAssignmentEligibilityService from "./queue.assignment.eligibility.service.js";
import QueueAssignmentStateService from "./queue.assignment.state.service.js";
import { QUEUE_STATUS, SOCKET_EVENTS } from "../../../constant.js";
import { emitEvent } from "../../../websockets/socket.js";
import { emitAppointmentToUsers } from "../../../websockets/appointmentEvents.js";
import logger from "../../../config/logger.js";

class QueueAssignmentAppointmentService {
  static async emitAssignmentEvent({ branchId, queueCustomer, appointment, barberId, chairId }) {
    emitEvent(`queue_${branchId}`, SOCKET_EVENTS.QUEUE_UPDATED, {
      queueId: queueCustomer._id,
      customerId: queueCustomer.customerId,
      status: QUEUE_STATUS.IN_PROGRESS,
      assignedAppointmentId: appointment._id,
      assignedBarberId: barberId,
      assignedChairId: chairId,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
    });
    await emitAppointmentToUsers(appointment, SOCKET_EVENTS.QUEUE_UPDATED, {
      queueId: queueCustomer._id,
      customerId: queueCustomer.customerId,
      status: QUEUE_STATUS.IN_PROGRESS,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
    });
  }

  static async createAppointmentFromQueue({
    queueCustomer,
    branchId,
    barberId,
    startTime,
    endTime,
  }) {
    const chair = await QueueAssignmentEligibilityService.findChair({
      branchId,
      serviceIds: queueCustomer.serviceIds,
      startTime,
      endTime,
    });

    if (!chair) throw new Error("No available chair for queue appointment");

    const barberFree = await SlotService.isBarberFree(barberId, startTime, endTime);
    if (!barberFree) throw new Error("Barber became unavailable before queue assignment");

    const appointment = await AppointmentBookingService.bookAppointment(
      {
        customerId: queueCustomer.customerId,
        branchId,
        barberId,
        chairId: chair._id,
        serviceIds: queueCustomer.serviceIds,
        startTime,
        isWalkIn: true,
        createPayment: false,
      },
      null,
      queueCustomer.customerId,
    );

    appointment.queuePosition = queueCustomer.position;
    await appointment.save();
    return { appointment, chair };
  }

  static async finalizeQueueAssignment({
    queueCustomer,
    appointment,
    branchId,
    barberId,
    chairId,
  }) {
    await Queue.findByIdAndUpdate(queueCustomer._id, {
      $set: { appointmentId: appointment._id },
    });

    await QueueAssignmentStateService.recalculateQueue(branchId);
    await this.emitAssignmentEvent({ branchId, queueCustomer, appointment, barberId, chairId });

    logger.info(`Queue customer ${queueCustomer._id} assigned to appointment ${appointment._id}`);
    return appointment;
  }
}

export default QueueAssignmentAppointmentService;
