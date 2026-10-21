import QueueAssignmentEligibilityService from "./assignment/queue.assignment.eligibility.service.js";
import QueueAssignmentStateService from "./assignment/queue.assignment.state.service.js";
import QueueAssignmentAppointmentService from "./assignment/queue.assignment.appointment.service.js";
import QueueAssignmentOrchestratorService from "./assignment/queue.assignment.orchestrator.service.js";

class QueueAssignmentService {
  static getRequiredChairType(...args) { return QueueAssignmentEligibilityService.getRequiredChairType(...args); }
  static barberWorksAtBranch(...args) { return QueueAssignmentEligibilityService.barberWorksAtBranch(...args); }
  static canBarberPerformServices(...args) { return QueueAssignmentEligibilityService.canBarberPerformServices(...args); }
  static getEligibleBarber(...args) { return QueueAssignmentEligibilityService.getEligibleBarber(...args); }
  static findNextSlotForBarber(...args) { return QueueAssignmentEligibilityService.findNextSlotForBarber(...args); }
  static findBarberAndSlot(...args) { return QueueAssignmentEligibilityService.findBarberAndSlot(...args); }
  static findChair(...args) { return QueueAssignmentEligibilityService.findChair(...args); }
  static claimNextWaitingCustomer(...args) { return QueueAssignmentStateService.claimNextWaitingCustomer(...args); }
  static releaseClaimedCustomer(...args) { return QueueAssignmentStateService.releaseClaimedCustomer(...args); }
  static recalculateQueue(...args) { return QueueAssignmentStateService.recalculateQueue(...args); }
  static emitAssignmentEvent(...args) { return QueueAssignmentAppointmentService.emitAssignmentEvent(...args); }
  static createAppointmentFromQueue(...args) { return QueueAssignmentAppointmentService.createAppointmentFromQueue(...args); }
  static finalizeQueueAssignment(...args) { return QueueAssignmentAppointmentService.finalizeQueueAssignment(...args); }
  static assignSlotToNextWaiting(...args) { return QueueAssignmentOrchestratorService.assignSlotToNextWaiting(...args); }
  static assignNextToAvailableBarber(...args) { return QueueAssignmentOrchestratorService.assignNextToAvailableBarber(...args); }
}

export default QueueAssignmentService;
