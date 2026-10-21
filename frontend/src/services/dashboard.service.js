import api from "./api";

export const getDashboardStats = async () => {
  const response = await api.get("/dashboard/admin");

  return response.data;
};

export const getSlotAnalytics = async (date) => {
  const response = await api.get("/dashboard/admin/slot-analytics", {
    params: {
      date,
    },
  });

  return response.data;
};