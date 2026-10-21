import api from "./api";

// Get queue status for a branch
export const getQueueStatus = async (branchId) => {
  const response = await api.get(`/queue/branch/${branchId}`);

  return response.data;
};

// Get current customer's queue status
export const getMyQueueStatus = async (branchId) => {
  const response = await api.get("/queue/my-status", {
    params: {
      branchId,
    },
  });

  return response.data;
};

// Add customer to queue
export const addToQueue = async (data) => {
  const response = await api.post("/queue", data);

  return response.data;
};

// Leave queue
export const leaveQueue = async (queueId) => {
  const response = await api.delete(`/queue/${queueId}`);

  return response.data;
};

// Assign next customer to barber
export const assignNext = async (data) => {
  const response = await api.post("/queue/assign", data);

  return response.data;
};