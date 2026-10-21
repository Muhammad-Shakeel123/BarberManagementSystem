import Queue from "../../models/queue.model.js";
import QueueQueryService from "./queue.query.service.js";
import { QUEUE_STATUS, QUEUE_MAX_CAPACITY, SOCKET_EVENTS } from "../../constant.js";
import { ApiError } from "../../utils/ApiError.js";
import { emitEvent } from "../../websockets/socket.js";
import { emitToUser } from "../../websockets/socket.js";
import logger from "../../config/logger.js";

class QueueLifecycleService {
  static async addToQueue({ branchId, customerId, requestedBarberId, serviceIds }) {
    if (!branchId) throw new ApiError(400, "Branch is required");
    if (!customerId) throw new ApiError(400, "Customer is required");
    if (!serviceIds || serviceIds.length === 0) {
      throw new ApiError(400, "At least one service is required");
    }

    const alreadyInQueue = await this.isInQueue(customerId, branchId);
    if (alreadyInQueue) {
      throw new ApiError(409, "Customer is already waiting in this branch queue.");
    }

    const count = await Queue.countDocuments({
      branchId,
      status: QUEUE_STATUS.WAITING,
    });
    if (count >= QUEUE_MAX_CAPACITY) {
      throw new ApiError(409, "Queue is full. Please try again later.");
    }

    const avgDuration = await QueueQueryService.getAverageServiceDuration(branchId);
    const queueEntry = new Queue({
      branchId,
      customerId,
      requestedBarberId: requestedBarberId || null,
      serviceIds,
      status: QUEUE_STATUS.WAITING,
      position: count + 1,
      estimatedWaitTime: avgDuration * (count + 1),
    });

    try {
      await queueEntry.save();
    } catch (error) {
      if (error?.code === 11000) {
        throw new ApiError(409, "Customer is already waiting in this branch queue.");
      }
      throw error;
    }

    await QueueQueryService.recalculatePositions(branchId);
    const updatedEntry = await Queue.findById(queueEntry._id);

    emitEvent(`queue_${branchId}`, SOCKET_EVENTS.QUEUE_UPDATED, {
      queueId: updatedEntry._id,
      position: updatedEntry.position,
      estimatedWaitTime: updatedEntry.estimatedWaitTime,
      status: updatedEntry.status,
    });
    emitToUser(customerId, SOCKET_EVENTS.QUEUE_UPDATED, {
      queueId: updatedEntry._id,
      position: updatedEntry.position,
      estimatedWaitTime: updatedEntry.estimatedWaitTime,
      status: updatedEntry.status,
    });

    logger.info(
      `Customer ${customerId} added to queue ${updatedEntry._id} at position ${updatedEntry.position}`,
    );
    return updatedEntry;
  }

  static async leaveQueue(queueId, customerId) {
    const entry = await Queue.findOne({ _id: queueId, customerId });
    if (!entry) throw new ApiError(404, "Queue entry not found");
    if (entry.status !== QUEUE_STATUS.WAITING) {
      throw new ApiError(400, "Cannot leave queue at this stage");
    }

    entry.status = QUEUE_STATUS.CANCELLED;
    entry.endedAt = new Date();
    await entry.save();

    await QueueQueryService.recalculatePositions(entry.branchId);
    emitEvent(`queue_${entry.branchId}`, SOCKET_EVENTS.QUEUE_UPDATED, {
      queueId: entry._id,
      status: QUEUE_STATUS.CANCELLED,
    });
    emitToUser(customerId, SOCKET_EVENTS.QUEUE_UPDATED, {
      queueId: entry._id,
      status: QUEUE_STATUS.CANCELLED,
    });

    logger.info(`Customer ${customerId} left queue ${queueId}`);
    return entry;
  }

  static async isInQueue(customerId, branchId) {
    const entry = await Queue.findOne({
      customerId,
      branchId,
      status: QUEUE_STATUS.WAITING,
    });
    return !!entry;
  }
}

export default QueueLifecycleService;
