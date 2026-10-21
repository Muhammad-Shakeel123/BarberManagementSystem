import QueueAssignmentService from "./queue.assignment.service.js";
import QueueQueryService from "./queue.query.service.js";
import QueueLifecycleService from "./queue.lifecycle.service.js";

class QueueService {
  static addToQueue(...args) { return QueueLifecycleService.addToQueue(...args); }
  static leaveQueue(...args) { return QueueLifecycleService.leaveQueue(...args); }
  static assignSlotToNextWaiting(...args) { return QueueAssignmentService.assignSlotToNextWaiting(...args); }
  static assignNextToAvailableBarber(...args) { return QueueAssignmentService.assignNextToAvailableBarber(...args); }
  static getAverageServiceDuration(...args) { return QueueQueryService.getAverageServiceDuration(...args); }
  static recalculatePositions(...args) { return QueueQueryService.recalculatePositions(...args); }
  static getQueueStatus(...args) { return QueueQueryService.getQueueStatus(...args); }
  static isInQueue(...args) { return QueueQueryService.isInQueue(...args); }
  static getCustomerQueueStatus(...args) { return QueueQueryService.getCustomerQueueStatus(...args); }
  static getNextWaitingCustomer(...args) { return QueueQueryService.getNextWaitingCustomer(...args); }
}

export default QueueService;
