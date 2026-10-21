import Chair from "../../models/chair.model.js";
import Appointment from "../../models/appointment.model.js";
import moment from "moment";
import { ApiError } from "../../utils/ApiError.js";

class ChairService {
  static async create({ branchId, name, number, type, assignedBarberId, isShared }) {
    const existing = await Chair.findOne({ branchId, number });
    if (existing) throw new ApiError(400, `Chair number ${number} already exists in this branch`);

    const chair = new Chair({
      branchId,
      name,
      number,
      type: type || "general",
      assignedBarberId: assignedBarberId || null,
      isShared: isShared !== undefined ? isShared : true,
    });
    await chair.save();
    return chair;
  }

  static async getByBranch(branchId, { isOperational } = {}) {
    const query = { branchId };
    if (isOperational !== undefined) query.isOperational = isOperational === "true";
    return Chair.find(query).populate("assignedBarberId", "userId").sort({ number: 1 });
  }

  static async getById(id) {
    const chair = await Chair.findById(id)
      .populate("branchId", "name code")
      .populate("assignedBarberId", "userId");
    if (!chair) throw new ApiError(404, "Chair not found");
    return chair;
  }

  static async update(id, data) {
    const { name, type, isOperational, assignedBarberId, isShared } = data;
    const chair = await Chair.findById(id);
    if (!chair) throw new ApiError(404, "Chair not found");

    if (name) chair.name = name;
    if (type) chair.type = type;
    if (isOperational !== undefined) chair.isOperational = isOperational;
    if (assignedBarberId !== undefined) chair.assignedBarberId = assignedBarberId;
    if (isShared !== undefined) chair.isShared = isShared;

    await chair.save();
    return chair;
  }

  static async remove(id) {
    const chair = await Chair.findById(id);
    if (!chair) throw new ApiError(404, "Chair not found");

    const activeAppointments = await Appointment.countDocuments({
      chairId: id,
      status: { $in: ["booked", "confirmed", "in_progress"] },
    });
    if (activeAppointments > 0) {
      throw new ApiError(
        400,
        `Chair has ${activeAppointments} active appointments. Cannot delete.`,
      );
    }

    await Chair.findByIdAndDelete(id);
  }

  static async getAvailability(id, date) {
    if (!date) throw new ApiError(400, "Date is required");
    const start = moment(date).startOf("day").toDate();
    const end = moment(date).endOf("day").toDate();

    return Appointment.find({
      chairId: id,
      startTime: { $gte: start, $lte: end },
      status: { $nin: ["cancelled", "no_show"] },
    }).sort({ startTime: 1 });
  }
}

export default ChairService;
