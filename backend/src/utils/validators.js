import mongoose from 'mongoose';

/**
 * Validate MongoDB ObjectId
 */
export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

/**
 * Validate phone number
 */
export const isValidPhone = (phone) => {
  const regex = /^\+?[0-9]{10,15}$/;
  return regex.test(phone);
};

/**
 * Validate time format (HH:MM)
 */
export const isValidTimeFormat = (time) => {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(time);
};

/**
 * Validate date is in the future
 */
export const isFutureDate = (date, minMinutes = 0) => {
  const now = new Date();
  const minTime = new Date(now.getTime() + minMinutes * 60000);
  return new Date(date) >= minTime;
};

/**
 * Validate date is within max days
 */
export const isWithinMaxDays = (date, maxDays = 30) => {
  const now = new Date();
  const maxDate = new Date(now.getTime() + maxDays * 86400000);
  return new Date(date) <= maxDate;
};

export default {
  isValidObjectId,
  isValidEmail,
  isValidPhone,
  isValidTimeFormat,
  isFutureDate,
  isWithinMaxDays,
};