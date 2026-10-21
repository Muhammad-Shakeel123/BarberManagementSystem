import api from "./api";

export const getBranchAppointments = async (branchId, params = {}) => {
  const response = await api.get(`/appointments/branch/${branchId}`, {
    params,
  });

  return response.data;
};

export const getMonthlyBranchAppointments = async (branchId) => {
  const response = await api.get(`/appointments/branch/${branchId}/month`);

  return response.data;
};

export const getActiveBranchAppointments = async (branchId) => {
  const response = await api.get(`/appointments/branch/${branchId}/active`);

  return response.data;
};

export const cancelAppointment = async (appointmentId) => {
  const response = await api.delete(`/appointments/${appointmentId}`);
  return response.data;
};

export const rescheduleAppointment = async (
  appointmentId,
  newStartTime,
  reason,
) => {
  const response = await api.put(`/appointments/${appointmentId}/reschedule`, {
    newStartTime,
    reason,
  });

  return response.data;
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  const response = await api.patch(`/appointments/${appointmentId}/status`, {
    status,
  });

  return response.data;
};

export const bookWalkInAppointment = async (data) => {
  const idempotencyKey = crypto.randomUUID();

  const response = await api.post("/appointments/book-oppt", data, {
    headers: {
      "Idempotency-Key": idempotencyKey,
    },
  });

  return response.data;
};

// Get available appointment slots
export const getAvailableSlots = async ({
  branchId,
  barberId,
  serviceIds,
  date,
  timezone,
}) => {
  const response = await api.get("/appointments/slots", {
    params: {
      branchId,
      barberId: barberId || undefined,
      serviceIds: serviceIds.join(","),
      date,
      timezone,
    },
  });

  return response.data;
};

export const bookAppointment = async (data) => {
  const idempotencyKey = crypto.randomUUID();

  const response = await api.post("/appointments/book-oppt", data, {
    headers: {
      "Idempotency-Key": idempotencyKey,
    },
  });

  return response.data;
};

export const getAppointmentById = async (appointmentId) => {
  const response = await api.get(`/appointments/${appointmentId}`);

  return response.data;
};

export const addExtraService = async (appointmentId, serviceId) => {
  const response = await api.post(
    `/appointments/${appointmentId}/add-service`,
    {
      serviceId,
    },
  );

  return response.data;
};

export const getMyAppointments = async (params = {}) => {
  const response = await api.get("/appointments/me", {
    params,
  });

  return response.data;
};

export const searchAppointments = async (query) => {
  const response = await api.get("/appointments/search", {
    params: { q: query },
  });

  return response.data;
};
