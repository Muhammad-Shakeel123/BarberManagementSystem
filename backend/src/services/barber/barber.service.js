import BarberProfile from "../../models/barberProfile.model.js";
import User from "../../models/user.model.js";
import Appointment from "../../models/appointment.model.js";
import Branch from "../../models/branch.model.js";
import SlotService from "../slot/slot.service.js";
import { ApiError } from "../../utils/ApiError.js";

class BarberService {
  static async createProfile({
    userId,
    branchId,
    specialties,
    workingHours,
    qualification,
    experienceYears,
    bio,
  }) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const branch = await Branch.findById(branchId);
    if (!branch) throw new ApiError(404, "Branch not found");

    const existing = await BarberProfile.findOne({ userId });
    if (existing) {
      throw new ApiError(400, "Barber profile already exists for this user");
    }

    user.role = "barber";
    await user.save();

    const barber = new BarberProfile({
      userId,
      branchId,
      branches: [branchId],
      specialties: specialties || [],
      workingHours,
      qualification,
      experienceYears,
      bio,
    });

    await barber.save();

    return BarberProfile.findById(barber._id)
      .populate("userId", "name email phone")
      .populate("branchId", "name code city");
  }

  static async getAll({ branchId } = {}) {
    const filter = {};

    if (branchId) {
      filter.$or = [{ branchId }, { branches: branchId }];
    }

    return BarberProfile.find(filter)
      .populate("userId", "name email phone")
      .populate("branchId", "name code address")
      .populate("branches", "name code")
      .populate("specialties", "name duration price")
      .sort({ createdAt: -1 });
  }

  static async getById(id) {
    const barber = await BarberProfile.findById(id)
      .populate("userId", "name email phone")
      .populate("branchId", "name code address")
      .populate("branches", "name code")
      .populate("specialties", "name duration price");

    if (!barber) throw new ApiError(404, "Barber not found");

    return barber;
  }

  static async getByUserId(userId) {
    const barber = await BarberProfile.findOne({ userId })
      .populate("userId", "name email phone")
      .populate("branchId", "name code address")
      .populate("branches", "name code")
      .populate("specialties", "name duration price");

    if (!barber) throw new ApiError(404, "Barber profile not found");

    return barber;
  }

  static async update(id, data) {
    const {
      branchId,
      specialties,
      workingHours,
      isActive,
      qualification,
      experienceYears,
      bio,
      branches,
    } = data;

    const barber = await BarberProfile.findById(id);

    if (!barber) throw new ApiError(404, "Barber not found");

    if (branchId) barber.branchId = branchId;
    if (branches) barber.branches = branches;
    if (specialties) barber.specialties = specialties;
    if (workingHours) barber.workingHours = workingHours;
    if (isActive !== undefined) barber.isActive = isActive;
    if (qualification) barber.qualification = qualification;
    if (experienceYears !== undefined) {
      barber.experienceYears = experienceYears;
    }
    if (bio) barber.bio = bio;

    await barber.save();

    return barber;
  }

  static async remove(id) {
    const barber = await BarberProfile.findById(id);

    if (!barber) throw new ApiError(404, "Barber not found");

    const activeAppointments = await Appointment.countDocuments({
      barberId: id,
      status: { $in: ["booked", "confirmed", "in_progress"] },
    });

    if (activeAppointments > 0) {
      throw new ApiError(
        400,
        `Barber has ${activeAppointments} active appointments. Cannot delete.`,
      );
    }

    barber.isActive = false;

    await barber.save();
  }

  static async getAvailability(id, { date, serviceIds }) {
    if (!date) throw new ApiError(400, "Date is required");

    const ids = serviceIds ? serviceIds.split(",") : [];

    if (ids.length === 0) {
      const barber = await BarberProfile.findById(id).populate("specialties");

      const specialtyIds = barber.specialties.map((s) => s._id.toString());

      if (specialtyIds.length === 0) {
        throw new ApiError(400, "Barber has no services");
      }

      ids.push(...specialtyIds);
    }

    const barber = await BarberProfile.findById(id);

    return SlotService.generateSlots({
      branchId: barber.branchId,
      barberId: id,
      serviceIds: ids,
      date,
    });
  }
}

export default BarberService;
