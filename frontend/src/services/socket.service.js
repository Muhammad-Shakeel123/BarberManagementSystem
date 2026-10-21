import { connectSocket, getSocket, disconnectSocket } from "./socket";

export const initializeSocket = () => {
  return connectSocket();
};

export const closeSocket = () => {
  disconnectSocket();
};

export const joinBranchRoom = (branchId) => {
  const socket = getSocket();

  if (!socket || !branchId) return;

  socket.emit("joinBranch", branchId);
};

export const leaveBranchRoom = (branchId) => {
  const socket = getSocket();

  if (!socket || !branchId) return;

  socket.emit("leaveBranch", branchId);
};

export const joinBarberRoom = (barberId) => {
  const socket = getSocket();

  if (!socket || !barberId) return;

  socket.emit("joinBarber", barberId);
};

export const leaveBarberRoom = (barberId) => {
  const socket = getSocket();

  if (!socket || !barberId) return;

  socket.emit("leaveBarber", barberId);
};

export const joinQueueRoom = (branchId) => {
  const socket = getSocket();

  if (!socket || !branchId) return;

  socket.emit("joinQueue", branchId);
};

export const leaveQueueRoom = (branchId) => {
  const socket = getSocket();

  if (!socket || !branchId) return;

  socket.emit("leaveQueue", branchId);
};

const createEventListener = (event, callback) => {
  const socket = getSocket() || connectSocket();

  if (!socket || typeof callback !== "function") {
    return () => {};
  }

  socket.on(event, callback);

  return () => {
    socket.off(event, callback);
  };
};

export const onQueueUpdated = (callback) => {
  return createEventListener("queue:updated", callback);
};

export const onAppointmentCreated = (callback) => {
  return createEventListener("appointment:created", callback);
};

export const onAppointmentUpdated = (callback) => {
  return createEventListener("appointment:updated", callback);
};

export const onAppointmentCancelled = (callback) => {
  return createEventListener("appointment:cancelled", callback);
};
