import api from "./api";

export const getAllBranches = async (params = {}) => {
  const response = await api.get("/branches/get-all-branches", {
    params,
  });

  return response.data;
};

export const getNearbyBranches = async ({ lat, lng, radius = 10000 }) => {
  const response = await api.get("/branches/nearby", {
    params: {
      lat,
      lng,
      radius,
    },
  });

  return response.data;
};

export const getBranchById = async (id) => {
  const response = await api.get(`/branches/${id}`);

  return response.data;
};

// Create branch
export const createBranch = async (data) => {
  const response = await api.post("/branches/create-branch", data);

  return response.data;
};

// Update branch
export const updateBranch = async (id, data) => {
  const response = await api.put(`/branches/${id}`, data);

  return response.data;
};

// Deactivate branch
export const deleteBranch = async (id) => {
  const response = await api.delete(`/branches/${id}`);

  return response.data;
};

// Get branch capacity
export const getBranchCapacity = async (id, date) => {
  const response = await api.get(`/branches/${id}/capacity`, {
    params: {
      date,
    },
  });

  return response.data;
};
