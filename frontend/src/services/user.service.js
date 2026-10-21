import api from "./api";

export const getAllUsers = async (params = {}) => {
  const response = await api.get("/users/get-all-users", {
    params,
  });

  return response.data;
};


export const createCustomer = async (data) => {
  const response = await api.post("/users/create-customer", data);

  return response.data;
};

export const updateUser = async (userId, data) => {
  const response = await api.put(`/users/${userId}`, data);

  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);

  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

export const updateMe = async (data) => {
  const response = await api.patch("/users/me", data);
  return response.data;
};

export const changeMyPassword = async (currentPassword, newPassword) => {
  const response = await api.patch("/users/me/password", {
    currentPassword,
    newPassword,
  });
  return response.data;
};

export const uploadMyAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await api.post("/users/me/avatar", formData, {
    headers: {
      "Content-Type": undefined,
    },
  });
  return response.data;
};

export const removeMyAvatar = async () => {
  const response = await api.delete("/users/me/avatar");
  return response.data;
};
