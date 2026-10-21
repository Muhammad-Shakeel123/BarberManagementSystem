import Queue from "../../../models/queue.model.js";
import SlotService from "../../slot/slot.service.js";
import StateMachine from "../../stateMachine.service.js";
import QueueAssignmentEligibilityService from "./queue.assignment.eligibility.service.js";
import QueueAssignmentStateService from "./queue.assignment.state.service.js";
import QueueAssignmentAppointmentService from "./queue.assignment.appointment.service.js";
import { QUEUE_STATUS, APPOINTMENT_STATUS } from "../../../constant.js";
import logger from "../../../config/logger.js";
import moment from "moment-timezone";

class QueueAssignmentOrchestratorService {
  static async assignSlotToNextWaiting(branchId, startTime) {
    if (!branchId || !startTime) return null;

    const assignmentStart = new Date(startTime);
    if (Number.isNaN(assignmentStart.getTime())) {
      logger.warn(`Invalid queue assignment startTime for branch ${branchId}`);
      return null;
    }

    const queueCustomer = await QueueAssignmentStateService.claimNextWaitingCustomer(branchId);
    if (!queueCustomer) {
      logger.info(`No waiting queue customer found for branch ${branchId}`);
      return null;
    }

    try {
      const barberAndSlot = await QueueAssignmentEligibilityService.findBarberAndSlot({
        branchId,
        requestedBarberId: queueCustomer.requestedBarberId,
        serviceIds: queueCustomer.serviceIds,
        fromTime: assignmentStart,
      });

      if (!barberAndSlot) {
        await QueueAssignmentStateService.releaseClaimedCustomer(queueCustomer._id);
        logger.info(`No available barber/slot for queue customer ${queueCustomer._id}`);
        return null;
      }

      const { barber, slot } = barberAndSlot;
      const start = new Date(slot.start);
      const end = new Date(slot.end);

      const { appointment, chair } =
        await QueueAssignmentAppointmentService.createAppointmentFromQueue({
          queueCustomer,
          branchId,
          barberId: barber._id,
          startTime: start,
          endTime: end,
        });

      return QueueAssignmentAppointmentService.finalizeQueueAssignment({
        queueCustomer,
        appointment,
        branchId,
        barberId: barber._id,
        chairId: chair._id,
      });
    } catch (error) {
      await QueueAssignmentStateService.releaseClaimedCustomer(queueCustomer._id);
      logger.error(`Failed to assign queue customer ${queueCustomer._id}: ${error.message}`);
      return null;
    }
  }

  static async assignNextToAvailableBarber(branchId, barberId) {
    if (!branchId || !barberId) return null;

    const queueCustomerCandidate = await Queue.findOne({
      branchId,
      status: QUEUE_STATUS.WAITING,
    }).sort({ priority: -1, position: 1, joinedAt: 1 });

    if (!queueCustomerCandidate) return null;

    const barber = await QueueAssignmentEligibilityService.getEligibleBarber({
      branchId,
      barberId,
      serviceIds: queueCustomerCandidate.serviceIds,
    });

    if (!barber) {
      logger.warn(`Barber ${barberId} is not eligible for queue assignment at branch ${branchId}`);
      return null;
    }

    const queueCustomer = await QueueAssignmentStateService.claimNextWaitingCustomer(branchId);
    if (!queueCustomer) return null;

    try {
      const startTime = new Date();
      const totalDuration = await SlotService.calculateTotalDuration(
        queueCustomer.serviceIds, branchId,
      );
      const endTime = moment(startTime).add(totalDuration, "minutes").toDate();

      const barberFree = await SlotService.isBarberFree(barber._id, startTime, endTime);
      if (!barberFree) {
        await QueueAssignmentStateService.releaseClaimedCustomer(queueCustomer._id);
        logger.info(
          `Barber ${barber._id} is currently busy. Queue customer ${queueCustomer._id} remains waiting.`,
        );
        return null;
      }

      const { appointment, chair } =
        await QueueAssignmentAppointmentService.createAppointmentFromQueue({
          queueCustomer, branchId, barberId: barber._id, startTime, endTime,
        });

      await StateMachine.transition(
        appointment, APPOINTMENT_STATUS.CONFIRMED, "system",
        "Queue customer assigned to barber",
      );
      await StateMachine.transition(
        appointment, APPOINTMENT_STATUS.IN_PROGRESS, "system",
        "Queue customer service started",
      );

      return QueueAssignmentAppointmentService.finalizeQueueAssignment({
        queueCustomer,
        appointment,
        branchId,
        barberId: barber._id,
        chairId: chair._id,
      });
    } catch (error) {
      await QueueAssignmentStateService.releaseClaimedCustomer(queueCustomer._id);
      logger.error(
        `Failed to manually assign queue customer ${queueCustomer._id}: ${error.message}`,
      );
      return null;
    }
  }
}

export default QueueAssignmentOrchestratorService;
