import Appointment from "../../models/appointment.model.js";
import Branch from "../../models/branch.model.js";
import { APPOINTMENT_STATUS } from "../../constant.js";

class SlotConflictService {
  static buildOverlapQuery(branchId, start, end, excludeAppointmentId = null) {
    const query = {
      branchId,
      status: {
        $nin: [APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.NO_SHOW],
      },
      $or: [
        {
          status: {
            $nin: [
              APPOINTMENT_STATUS.CANCELLED,
              APPOINTMENT_STATUS.NO_SHOW,
              APPOINTMENT_STATUS.COMPLETED,
            ],
          },
          startTime: { $lt: end },
          endTime: { $gt: start },
        },

        {
          status: APPOINTMENT_STATUS.COMPLETED,
          startTime: { $lt: end },
          actualEndTime: { $gt: start },
        },
        {
          status: APPOINTMENT_STATUS.COMPLETED,
          actualEndTime: null,
          startTime: { $lt: end },
          endTime: { $gt: start },
        },
      ],
    };

    if (excludeAppointmentId) {
      query._id = { $ne: excludeAppointmentId };
    }

    return query;
  }

  /**
   * --------------------------------------------------
   * Barber availability
   * --------------------------------------------------
   */
  static async isBarberFree(barberId, start, end, excludeAppointmentId = null) {
    if (!barberId) return true;

    const query = {
      barberId,
      $or: [
        // Active appointments
        {
          status: {
            $nin: [
              APPOINTMENT_STATUS.CANCELLED,
              APPOINTMENT_STATUS.NO_SHOW,
              APPOINTMENT_STATUS.COMPLETED,
            ],
          },
          startTime: { $lt: end },
          endTime: { $gt: start },
        },

        // Completed appointment with actual finish time
        {
          status: APPOINTMENT_STATUS.COMPLETED,
          actualEndTime: { $gt: start, $lte: end },
          startTime: { $lt: end },
        },

        // Older completed appointment without actualEndTime
        {
          status: APPOINTMENT_STATUS.COMPLETED,
          actualEndTime: null,
          startTime: { $lt: end },
          endTime: { $gt: start },
        },
      ],
    };

    if (excludeAppointmentId) {
      query._id = { $ne: excludeAppointmentId };
    }

    const conflict = await Appointment.findOne(query).select("_id");

    return !conflict;
  }

  /**
   * --------------------------------------------------
   * Chair availability
   * --------------------------------------------------
   */
  static async isChairFree(chairId, start, end, excludeAppointmentId = null) {
    if (!chairId) return true;

    const query = {
      chairId,
      $or: [
        // Active appointments
        {
          status: {
            $nin: [
              APPOINTMENT_STATUS.CANCELLED,
              APPOINTMENT_STATUS.NO_SHOW,
              APPOINTMENT_STATUS.COMPLETED,
            ],
          },
          startTime: { $lt: end },
          endTime: { $gt: start },
        },

        // Completed appointment with actual finish time
        {
          status: APPOINTMENT_STATUS.COMPLETED,
          actualEndTime: { $gt: start, $lte: end },
          startTime: { $lt: end },
        },

        // Older completed appointment without actualEndTime
        {
          status: APPOINTMENT_STATUS.COMPLETED,
          actualEndTime: null,
          startTime: { $lt: end },
          endTime: { $gt: start },
        },
      ],
    };

    if (excludeAppointmentId) {
      query._id = { $ne: excludeAppointmentId };
    }

    const conflict = await Appointment.findOne(query).select("_id");

    return !conflict;
  }

  /**
   * --------------------------------------------------
   * Customer overlap
   * --------------------------------------------------
   */
  static async hasCustomerOverlap(customerId, start, end, excludeAppointmentId = null) {
    if (!customerId) return false;

    const query = {
      customerId,
      $or: [
        // Active appointments
        {
          status: {
            $nin: [
              APPOINTMENT_STATUS.CANCELLED,
              APPOINTMENT_STATUS.NO_SHOW,
              APPOINTMENT_STATUS.COMPLETED,
            ],
          },
          startTime: { $lt: end },
          endTime: { $gt: start },
        },

        // Completed appointment with actual finish time
        {
          status: APPOINTMENT_STATUS.COMPLETED,
          actualEndTime: { $gt: start, $lte: end },
          startTime: { $lt: end },
        },

        // Older completed appointment without actualEndTime
        {
          status: APPOINTMENT_STATUS.COMPLETED,
          actualEndTime: null,
          startTime: { $lt: end },
          endTime: { $gt: start },
        },
      ],
    };

    if (excludeAppointmentId) {
      query._id = { $ne: excludeAppointmentId };
    }

    const count = await Appointment.countDocuments(query);

    return count > 0;
  }

  /**
   * --------------------------------------------------
   * Branch capacity
   * --------------------------------------------------
   */
  static async checkBranchCapacity(branchId, start, end, excludeAppointmentId = null) {
    const branch = await Branch.findById(branchId);

    if (!branch) return false;

    const query = this.buildOverlapQuery(branchId, start, end, excludeAppointmentId);

    const count = await Appointment.countDocuments(query);

    return count < branch.capacity.totalChairs;
  }
}

export default SlotConflictService;
