import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    const method = response.config?.method?.toLowerCase();

    const isActionRequest = ["post", "put", "patch", "delete"].includes(method);

    if (isActionRequest && response.data?.message) {
      window.dispatchEvent(
        new CustomEvent("api-success-popup", {
          detail: {
            title: "Success",
            message: response.data.message,
          },
        }),
      );
    }

    return response;
  },

  (error) => {
    if (error.response?.status !== 401) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong. Please try again.";

      window.dispatchEvent(
        new CustomEvent("api-error-popup", {
          detail: {
            title: "Action Failed",
            message,
          },
        }),
      );
    }

    return Promise.reject(error);
  },
);

export default api;
