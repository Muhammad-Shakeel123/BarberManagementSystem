import Queue from "../../models/queue.model.js";
import Service from "../../models/service.model.js";
import { QUEUE_STATUS } from "../../constant.js";

class QueueQueryService {
  static async getAverageServiceDuration(branchId) {
    const services = await Service.find({
      branchIds: branchId,
      isActive: true,
    });

    if (services.length === 0) {
      return 30;
    }

    const totalDuration = services.reduce((sum, service) => sum + service.duration, 0);

    return Math.ceil(totalDuration / services.length);
  }

  static getWaitingSort() {
    return {
      priority: -1,
      joinedAt: 1,
      _id: 1,
    };
  }

  static async recalculatePositions(branchId) {
    const entries = await Queue.find({
      branchId,
      status: QUEUE_STATUS.WAITING,
    }).sort({
      priority: -1,
      position: 1,
      joinedAt: 1,
    });

    const avgDuration = await this.getAverageServiceDuration(branchId);

    for (let i = 0; i < entries.length; i++) {
      entries[i].position = i + 1;
      entries[i].estimatedWaitTime = avgDuration * (i + 1);

      await entries[i].save();
    }

    return entries;
  }

  static async getQueueStatus(branchId) {
    const waiting = await Queue.find({
      branchId,
      status: QUEUE_STATUS.WAITING,
    })
      .sort(this.getWaitingSort())
      .populate("customerId", "name phone")
      .populate("requestedBarberId", "userId")
      .populate("serviceIds", "name duration");

    const inProgress = await Queue.find({
      branchId,
      status: QUEUE_STATUS.IN_PROGRESS,
    })
      .sort({ startedAt: 1 })
      .populate("customerId", "name phone")
      .populate("requestedBarberId", "userId")
      .populate("serviceIds", "name duration");

    return {
      waiting: waiting.map((entry) => ({
        id: entry._id,
        position: entry.position,
        customer: entry.customerId,
        requestedBarber: entry.requestedBarberId,
        services: entry.serviceIds,
        estimatedWaitTime: entry.estimatedWaitTime,
        joinedAt: entry.joinedAt,
        priority: entry.priority,
      })),

      inProgress: inProgress.map((entry) => ({
        id: entry._id,
        customer: entry.customerId,
        requestedBarber: entry.requestedBarberId,
        services: entry.serviceIds,
        startedAt: entry.startedAt,
      })),

      totalWaiting: waiting.length,
      totalInProgress: inProgress.length,
    };
  }

  static async getCustomerQueueStatus(customerId, branchId) {
    const entry = await Queue.findOne({
      customerId,
      branchId,
      status: {
        $in: [QUEUE_STATUS.WAITING, QUEUE_STATUS.IN_PROGRESS],
      },
    }).populate("serviceIds", "name duration");

    if (!entry) {
      return null;
    }

    return {
      queueId: entry._id,
      position: entry.position,
      status: entry.status,
      estimatedWaitTime: entry.estimatedWaitTime,
      services: entry.serviceIds,
      joinedAt: entry.joinedAt,
      startedAt: entry.startedAt,
      requestedBarber: entry.requestedBarberId,
      priority: entry.priority,
    };
  }

  static async isInQueue(customerId, branchId) {
    const entry = await Queue.findOne({
      customerId,
      branchId,
      status: QUEUE_STATUS.WAITING,
    });

    return !!entry;
  }

  static async getNextWaitingCustomer(branchId) {
    return Queue.findOne({
      branchId,
      status: QUEUE_STATUS.WAITING,
    }).sort(this.getWaitingSort());
  }
}

export default QueueQueryService;
