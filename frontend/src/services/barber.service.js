import api from "./api";

export const createBarberProfile = async (data) => {
  const response = await api.post("/barbers/create-barber-profile", data);

  return response.data;
};

export const getAllBarbers = async (params = {}) => {
  const response = await api.get("/barbers", {
    params,
  });

  return response.data;
};

export const getMyBarberProfile = async () => {
  const response = await api.get("/barbers/me");

  return response.data;
};

export const updateBarberProfile = async (id, data) => {
  const response = await api.put(`/barbers/${id}`, data);

  return response.data;
};

export const deleteBarberProfile = async (id) => {
  const response = await api.delete(`/barbers/${id}`);

  return response.data;
};

// Get barber availability
export const getBarberAvailability = async (
  barberId,
  date,
  serviceIds = [],
) => {
  const response = await api.get(`/barbers/${barberId}/availability`, {
    params: {
      date,
      serviceIds: serviceIds.join(","),
    },
  });

  return response.data;
};

export const getBarberAppointments = async (barberId, params = {}) => {
  const response = await api.get(`/appointments/barber/${barberId}`, {
    params,
  });

  return response.data;
};
