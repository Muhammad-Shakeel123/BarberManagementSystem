import api from "./api";

// Get all services
export const getAllServices = async (params = {}) => {
  const response = await api.get("/services/get-all-services", {
    params,
  });

  return response.data;
};

// Get service categories
export const getServiceCategories = async () => {
  const response = await api.get("/services/categories");

  return response.data;
};

// Get single service
export const getServiceById = async (id) => {
  const response = await api.get(`/services/${id}`);

  return response.data;
};

// Create service
export const createService = async (data) => {
  const response = await api.post("/services/create-services", data);

  return response.data;
};

// Update service
export const updateService = async (id, data) => {
  const response = await api.put(`/services/${id}`, data);

  return response.data;
};

// Delete / deactivate service
export const deleteService = async (id) => {
  const response = await api.delete(`/services/${id}`);

  return response.data;
};