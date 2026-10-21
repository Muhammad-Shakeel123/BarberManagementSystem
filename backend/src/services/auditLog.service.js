import AuditLog from "../models/auditLog.model.js";

class AuditLogService {
  static async list({ page = 1, limit = 25, action, targetType }) {
    const safePage = Math.max(Number(page) || 1, 1);
    const safeLimit = Math.min(Math.max(Number(limit) || 25, 1), 100);
    const filter = {};

    if (action) filter.action = action;
    if (targetType) filter.targetType = targetType;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .populate("userId", "name email role")
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit)
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    return {
      logs,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        pages: Math.ceil(total / safeLimit),
      },
    };
  }

  static async getFilters() {
    const [actions, targetTypes] = await Promise.all([
      AuditLog.distinct("action"),
      AuditLog.distinct("targetType"),
    ]);

    return {
      actions: actions.filter(Boolean).sort(),
      targetTypes: targetTypes.filter(Boolean).sort(),
    };
  }
}

export default AuditLogService;
