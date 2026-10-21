import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {
  if (socket?.connected) {
    return socket;
  }

  const token = localStorage.getItem("accessToken");

  if (!token) {
    return null;
  }

  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: {
      token,
    },
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};