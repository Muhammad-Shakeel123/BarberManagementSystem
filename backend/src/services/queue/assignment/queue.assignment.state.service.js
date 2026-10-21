import Queue from "../../../models/queue.model.js";
import QueueQueryService from "../queue.query.service.js";
import { QUEUE_STATUS } from "../../../constant.js";

class QueueAssignmentStateService {
  static async claimNextWaitingCustomer(branchId) {
    return Queue.findOneAndUpdate(
      { branchId, status: QUEUE_STATUS.WAITING },
      { $set: { status: QUEUE_STATUS.IN_PROGRESS, startedAt: new Date() } },
      { sort: { priority: -1, position: 1, joinedAt: 1 }, new: true },
    );
  }

  static async releaseClaimedCustomer(queueCustomerId) {
    await Queue.findOneAndUpdate(
      { _id: queueCustomerId, status: QUEUE_STATUS.IN_PROGRESS },
      { $set: { status: QUEUE_STATUS.WAITING, startedAt: null } },
    );
  }

  static async recalculateQueue(branchId) {
    return QueueQueryService.recalculatePositions(branchId);
  }
}

export default QueueAssignmentStateService;
