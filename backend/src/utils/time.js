import moment from 'moment-timezone';
import { TIMEZONE } from '../constant.js';

/**
 * Get current time in a specific timezone
 */
export const getCurrentTime = (timezone = TIMEZONE) => {
  return moment().tz(timezone);
};

/**
 * Format date to ISO string
 */
export const formatDate = (date, timezone = TIMEZONE) => {
  return moment(date).tz(timezone).format();
};

/**
 * Format date to readable string
 */
export const formatDateReadable = (date, timezone = TIMEZONE) => {
  return moment(date).tz(timezone).format('MMMM Do YYYY, h:mm A');
};

/**
 * Parse date string
 */
export const parseDate = (dateStr, timezone = TIMEZONE) => {
  return moment.tz(dateStr, timezone).toDate();
};

/**
 * Check if a time is within working hours
 */
export const isWithinWorkingHours = (time, workingHours) => {
  const m = moment(time);
  const start = moment(time).set({
    hour: parseInt(workingHours.start.split(':')[0]),
    minute: parseInt(workingHours.start.split(':')[1]),
  });
  const end = moment(time).set({
    hour: parseInt(workingHours.end.split(':')[0]),
    minute: parseInt(workingHours.end.split(':')[1]),
  });
  return m.isBetween(start, end, null, '[)');
};

/**
 * Check if a time is during a break
 */
export const isDuringBreak = (time, breaks) => {
  const m = moment(time);
  for (const br of breaks) {
    const start = moment(time).set({
      hour: parseInt(br.start.split(':')[0]),
      minute: parseInt(br.start.split(':')[1]),
    });
    const end = moment(time).set({
      hour: parseInt(br.end.split(':')[0]),
      minute: parseInt(br.end.split(':')[1]),
    });
    if (m.isBetween(start, end, null, '[)')) {
      return true;
    }
  }
  return false;
};

/**
 * Get day boundaries
 */
export const getDayRange = (date, timezone = TIMEZONE) => {
  const m = moment.tz(date, timezone);
  return {
    start: m.clone().startOf('day').toDate(),
    end: m.clone().endOf('day').toDate(),
  };
};

/**
 * Add minutes to a date
 */
export const addMinutes = (date, minutes) => {
  return moment(date).add(minutes, 'minutes').toDate();
};

/**
 * Difference in minutes
 */
export const minutesDifference = (date1, date2) => {
  return moment(date1).diff(moment(date2), 'minutes');
};

export default {
  getCurrentTime,
  formatDate,
  formatDateReadable,
  parseDate,
  isWithinWorkingHours,
  isDuringBreak,
  getDayRange,
  addMinutes,
  minutesDifference,
};