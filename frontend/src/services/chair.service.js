import api from "./api";

const chairService = {
  // Get all chairs of a branch
  getChairsByBranch: async (branchId, params = {}) => {
    const response = await api.get(`/chairs/branch/${branchId}`, {
      params,
    });

    return response.data;
  },

  // Get single chair
  getChairById: async (id) => {
    const response = await api.get(`/chairs/${id}`);

    return response.data;
  },

  // Get chair availability for a specific date
  getChairAvailability: async (id, date) => {
    const response = await api.get(`/chairs/${id}/availability`, {
      params: { date },
    });

    return response.data;
  },

  // Create chair
  createChair: async (data) => {
    const response = await api.post("/chairs/create-chair", data);

    return response.data;
  },

  // Update chair
  updateChair: async (id, data) => {
    const response = await api.put(`/chairs/${id}`, data);

    return response.data;
  },

  // Delete chair
  deleteChair: async (id) => {
    const response = await api.delete(`/chairs/${id}`);

    return response.data;
  },
};

export default chairService;