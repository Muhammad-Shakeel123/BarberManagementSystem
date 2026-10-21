import DashboardAdminService from "./dashboard.admin.service.js";
import DashboardSlotAnalyticsService from "./dashboard.slot-analytics.service.js";

class DashboardService {
  static getAdminDashboard(...args) {
    return DashboardAdminService.getDashboardStats(...args);
  }
  static getAdminSlotAnalytics(...args) {
    return DashboardSlotAnalyticsService.getSlotAnalytics(...args);
  }
}

export default DashboardService;
