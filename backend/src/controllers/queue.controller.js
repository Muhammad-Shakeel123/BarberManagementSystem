import QueueService from "../services/queue/queue.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const addToQueue = asyncHandler(async (req, res) => {
  const customerId =
    req.user.role === "admin"
      ? req.body.customerId
      : req.user.id;

  if (!customerId) {
    throw new ApiError(400, "Customer is required");
  }

  const entry = await QueueService.addToQueue({
    ...req.body,
    customerId,
  });

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        entry,
        "Added to queue successfully"
      )
    );
});
export const getQueueStatus = asyncHandler(async (req, res) => {
  const status = await QueueService.getQueueStatus(req.params.branchId);

  res.json(new ApiResponse(200, status, "Queue status fetched successfully"));
});

export const getMyQueueStatus = asyncHandler(async (req, res) => {
  const { branchId } = req.query;

  if (!branchId) throw new ApiError(400, "branchId is required");

  const status = await QueueService.getCustomerQueueStatus(
    req.user.id,
    branchId
  );

  if (!status) {
    return res.json(new ApiResponse(200, null, "Not in queue"));
  }

  res.json(new ApiResponse(200, status, "Queue status fetched"));
});

export const leaveQueue = asyncHandler(async (req, res) => {
  const entry = await QueueService.leaveQueue(
    req.params.id,
    req.user.id
  );

  res.json(new ApiResponse(200, entry, "Left queue successfully"));
});

export const assignNext = asyncHandler(async (req, res) => {
  const { branchId, barberId } = req.body;

  if (!branchId || !barberId) {
    throw new ApiError(400, "branchId and barberId are required");
  }

  const appointment = await QueueService.assignNextToAvailableBarber(
    branchId,
    barberId
  );

  if (!appointment) {
    return res.json(
      new ApiResponse(
        200,
        null,
        "No customer in queue or no available slot"
      )
    );
  }

  res.json(
    new ApiResponse(200, appointment, "Customer assigned successfully")
  );
});
