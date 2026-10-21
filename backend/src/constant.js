export const DB_NAME = 'barber_management_system';

export const ROLES = {
  CUSTOMER: 'customer',
  BARBER: 'barber',
  ADMIN: 'admin',
};

export const APPOINTMENT_STATUS = {
  BOOKED: 'booked',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

export const QUEUE_STATUS = {
  WAITING: 'waiting',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const ALLOWED_STATUS_TRANSITIONS = {
booked: ['confirmed', 'cancelled', 'no_show'],
confirmed: ['in_progress', 'cancelled', 'no_show'],
  in_progress: ['completed'],
  completed: [],
  cancelled: [],
  no_show: [],
};

// Time rules
export const MAX_FUTURE_DAYS = parseInt(process.env.MAX_FUTURE_DAYS, 10) || 30;
export const MIN_ADVANCE_MINUTES = parseInt(process.env.MIN_ADVANCE_MINUTES, 10) || 15;
export const NO_SHOW_GRACE_MINUTES = parseInt(process.env.NO_SHOW_GRACE_MINUTES, 10) || 15;
export const QUEUE_MAX_CAPACITY = parseInt(process.env.QUEUE_MAX_CAPACITY, 10) || 50;
export const SLOT_INTERVAL_MINUTES = parseInt(process.env.SLOT_INTERVAL_MINUTES, 10) || 15;
export const TIMEZONE = process.env.TIMEZONE || 'Asia/Karachi';

// Cache keys
export const CACHE_KEYS = {
  SLOTS: 'slots:',
  AVAILABILITY: 'availability:',
  QUEUE: 'queue:',
};

// Socket events
export const SOCKET_EVENTS = {
  APPOINTMENT_CREATED: 'appointment:created',
  APPOINTMENT_UPDATED: 'appointment:updated',
  APPOINTMENT_CANCELLED: 'appointment:cancelled',
  QUEUE_UPDATED: 'queue:updated',
  WAITING_TIME_UPDATED: 'waitingTime:updated',
  SLOT_UPDATED: 'slot:updated',
};

export default {
  DB_NAME,
  ROLES,
  APPOINTMENT_STATUS,
  PAYMENT_STATUS,
  QUEUE_STATUS,
  ALLOWED_STATUS_TRANSITIONS,
  MAX_FUTURE_DAYS,
  MIN_ADVANCE_MINUTES,
  NO_SHOW_GRACE_MINUTES,
  QUEUE_MAX_CAPACITY,
  SLOT_INTERVAL_MINUTES,
  TIMEZONE,
  CACHE_KEYS,
  SOCKET_EVENTS,
};