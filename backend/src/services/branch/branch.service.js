import Branch from "../../models/branch.model.js";
import Chair from "../../models/chair.model.js";
import BarberProfile from "../../models/barberProfile.model.js";
import Appointment from "../../models/appointment.model.js";
import moment from "moment";
import { ApiError } from "../../utils/ApiError.js";

class BranchService {
  static buildLocationFromAddress(data) {
    const lat = data?.address?.coordinates?.lat;
    const lng = data?.address?.coordinates?.lng;

    if (lat == null || lng == null) {
      return null;
    }

    return {
      type: "Point",
      coordinates: [lng, lat],
    };
  }
  static async create(data) {
    const location = this.buildLocationFromAddress(data);

    const branch = new Branch({
      ...data,
      ...(location && { location }),
    });

    await branch.save();

    const chairs = [];
    for (let i = 1; i <= branch.capacity.totalChairs; i++) {
      chairs.push({
        branchId: branch._id,
        name: `Chair ${i}`,
        number: i,
        type: "general",
        isOperational: true,
      });
    }

    await Chair.insertMany(chairs);
    return branch;
  }

  static async getAll({ isActive } = {}) {
    const query = {};
    if (isActive !== undefined) query.isActive = isActive === "true";
    return Branch.find(query);
  }

  static async getNearby({ lat, lng } = {}) {
    if (lat == null || lng == null) {
      throw new ApiError(400, "Latitude and longitude are required");
    }

    const latitude = Number(lat);
    const longitude = Number(lng);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new ApiError(400, "Invalid location parameters");
    }

    if (latitude < -90 || latitude > 90) {
      throw new ApiError(400, "Invalid latitude");
    }

    if (longitude < -180 || longitude > 180) {
      throw new ApiError(400, "Invalid longitude");
    }

    return Branch.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          key: "location",
          distanceField: "distance",
          spherical: true,
          query: {
            isActive: true,
            "settings.allowOnlineBooking": true,
          },
        },
      },
      {
        $addFields: {
          distanceInKm: {
            $round: [
              {
                $divide: ["$distance", 1000],
              },
              2,
            ],
          },
        },
      },
      {
        $project: {
          name: 1,
          code: 1,
          address: 1,
          location: 1,
          phone: 1,
          email: 1,
          timezone: 1,
          workingHours: 1,
          capacity: 1,
          settings: 1,
          logo: 1,
          distanceInKm: 1,
        },
      },
    ]);
  }

  static async getById(id) {
    const branch = await Branch.findById(id);
    if (!branch) throw new ApiError(404, "Branch not found");

    const chairCount = await Chair.countDocuments({ branchId: id });
    const barberCount = await BarberProfile.countDocuments({ branchId: id, isActive: true });
    const data = branch.toObject();
    data.statistics = { chairCount, barberCount };
    return data;
  }

  static async update(id, data) {
    const branch = await Branch.findById(id);
    if (!branch) throw new ApiError(404, "Branch not found");

    delete data.code;

    const location = this.buildLocationFromAddress(data);

    Object.assign(branch, data);

    if (location) {
      branch.location = location;
    }

    await branch.save();
    return branch;
  }

  static async remove(id) {
    const branch = await Branch.findById(id);
    if (!branch) throw new ApiError(404, "Branch not found");

    const activeAppointments = await Appointment.countDocuments({
      branchId: id,
      status: { $in: ["booked", "confirmed", "in_progress"] },
    });
    if (activeAppointments > 0) {
      throw new ApiError(
        400,
        `Branch has ${activeAppointments} active appointments. Cannot delete.`,
      );
    }

    branch.isActive = false;
    await branch.save();
    await Chair.updateMany({ branchId: id }, { isOperational: false });
  }

  static async getCapacity(id, date) {
    const branch = await Branch.findById(id);
    if (!branch) throw new ApiError(404, "Branch not found");

    const chairs = await Chair.countDocuments({ branchId: id, isOperational: true });
    const barbers = await BarberProfile.countDocuments({ branchId: id, isActive: true });
    let todayAppointments = 0;

    if (date) {
      const start = moment(date).startOf("day").toDate();
      const end = moment(date).endOf("day").toDate();
      todayAppointments = await Appointment.countDocuments({
        branchId: id,
        startTime: { $gte: start, $lte: end },
        status: { $nin: ["cancelled", "no_show"] },
      });
    }

    return {
      branchId: id,
      totalChairs: chairs,
      totalBarbers: barbers,
      capacity: branch.capacity,
      todayAppointments,
      isActive: branch.isActive,
    };
  }
}

export default BranchService;
