import Appointment from "../../models/appointment.model.js";
import Chair from "../../models/chair.model.js";
import { APPOINTMENT_STATUS } from "../../constant.js";
import SlotConflictService from "./slot.conflict.service.js";

class SlotAvailabilityService {
  static async isSlotAvailable({
    branchId,
    barberId,
    start,
    end,
    chairId = null,
    chairType = null,
    excludeAppointmentId = null,
  }) {
    // Check barber availability
    if (barberId) {
      const barberFree = await SlotConflictService.isBarberFree(
        barberId,
        start,
        end,
        excludeAppointmentId,
      );

      if (!barberFree) return false;
    }

    // Check specifically selected chair
    if (chairId) {
      const chairFree = await SlotConflictService.isChairFree(
        chairId,
        start,
        end,
        excludeAppointmentId,
      );

      if (!chairFree) return false;
    }

    // Check required chair type
    if (chairType) {
      const specificChairs = await Chair.find({
        branchId,
        isOperational: true,
        type: chairType,
      }).sort({ number: 1 });

      // General chairs can be used as fallback
      const generalChairs =
        chairType === "general"
          ? []
          : await Chair.find({
              branchId,
              isOperational: true,
              type: "general",
            }).sort({ number: 1 });

      const chairs = [...specificChairs, ...generalChairs];

      let foundAvailable = false;

      for (const chair of chairs) {
        const conflict = await Appointment.findOne({
          chairId: chair._id,
          status: {
            $nin: [APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.NO_SHOW],
          },
          ...(excludeAppointmentId ? { _id: { $ne: excludeAppointmentId } } : {}),
          $or: [
            {
              startTime: { $lt: end },
              endTime: { $gt: start },
            },
          ],
        });

        if (!conflict) {
          foundAvailable = true;
          break;
        }
      }

      if (!foundAvailable) return false;
    }

    // Check branch capacity
    return SlotConflictService.checkBranchCapacity(branchId, start, end, excludeAppointmentId);
  }

  static async findAvailableChair(
    branchId,
    start,
    end,
    chairType = null,
    excludeAppointmentId = null,
  ) {
    const baseQuery = {
      branchId,
      isOperational: true,
    };

    if (chairType && chairType !== "general") {
      const specificChairs = await Chair.find({
        ...baseQuery,
        type: chairType,
      }).sort({ number: 1 });

      for (const chair of specificChairs) {
        const conflict = await Appointment.findOne({
          chairId: chair._id,
          status: {
            $nin: [APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.NO_SHOW],
          },
          ...(excludeAppointmentId ? { _id: { $ne: excludeAppointmentId } } : {}),
          $or: [
            {
              startTime: { $lt: end },
              endTime: { $gt: start },
            },
          ],
        });

        if (!conflict) {
          return chair;
        }
      }
    }

    const generalChairs = await Chair.find({
      ...baseQuery,
      type: "general",
    }).sort({ number: 1 });

    for (const chair of generalChairs) {
      const conflict = await Appointment.findOne({
        chairId: chair._id,
        status: {
          $nin: [APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.NO_SHOW],
        },
        ...(excludeAppointmentId ? { _id: { $ne: excludeAppointmentId } } : {}),
        $or: [
          {
            startTime: { $lt: end },
            endTime: { $gt: start },
          },
        ],
      });

      if (!conflict) {
        return chair;
      }
    }

    return null;
  }
}

export default SlotAvailabilityService;
