import Service from "../../models/service.model.js";
import Appointment from "../../models/appointment.model.js";
import { ApiError } from "../../utils/ApiError.js";

class ServiceCatalogService {
  static async create(data) {
    const service = new Service(data);
    await service.save();
    return service;
  }

  static async getAll({ branchId, isActive, category } = {}) {
    const query = {};
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (category) query.category = category;
    if (branchId) query.branchIds = branchId;
    return Service.find(query).sort({ name: 1 });
  }

  static async getById(id) {
    const service = await Service.findById(id);
    if (!service) throw new ApiError(404, "Service not found");
    return service;
  }

  static async update(id, data) {
    const service = await Service.findById(id);
    if (!service) throw new ApiError(404, "Service not found");
    Object.assign(service, data);
    await service.save();
    return service;
  }

  static async remove(id) {
    const service = await Service.findById(id);
    if (!service) throw new ApiError(404, "Service not found");

    const activeAppointments = await Appointment.countDocuments({
      serviceIds: id, status: { $in: ["booked", "confirmed", "in_progress"] },
    });
    if (activeAppointments > 0) {
      throw new ApiError(400, `Service is used in ${activeAppointments} active appointments. Cannot delete.`);
    }

    service.isActive = false;
    await service.save();
  }

  static async getCategories() {
    const categories = await Service.distinct("category", { isActive: true });
    return categories.filter((c) => c);
  }
}

export default ServiceCatalogService;
