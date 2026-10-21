import Service from "../../models/service.model.js";
import { ApiError } from "../../utils/ApiError.js";
class SlotDurationService {
  static async calculateTotalDuration(serviceIds, branchId) {
    const services = await Service.find({
      _id: { $in: serviceIds },
      isActive: true,
    });

    if (services.length !== serviceIds.length) {
      const foundIds = services.map((s) => s._id.toString());
      const missing = serviceIds.filter((id) => !foundIds.includes(id.toString()));

      throw new ApiError(400, `Invalid or inactive services: ${missing.join(", ")}`);
    }

    let total = 0;

    for (let i = 0; i < services.length; i++) {
      total += services[i].duration;

      if (i < services.length - 1) {
        total += services[i].bufferAfter || 0;
      }
    }

    return total;
  }
}

export default SlotDurationService;
