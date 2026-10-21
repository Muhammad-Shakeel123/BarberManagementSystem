import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Filter,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { getAuditLogFilters, getAuditLogs } from "@/services/auditLog.service";

const formatDate = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatAction = (action) =>
  String(action || "Unknown")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatChanges = (changes) => {
  if (!changes) return "-";

  const from = changes.from?.status;
  const to = changes.to?.status;

  if (from || to) {
    return `${from || "-"} -> ${to || "-"}`;
  }

  return JSON.stringify(changes);
};

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ actions: [], targetTypes: [] });
  const [action, setAction] = useState("");
  const [targetType, setTargetType] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadLogs = useCallback(
    async ({ refresh = false } = {}) => {
      try {
        setError("");
        refresh ? setIsRefreshing(true) : setIsLoading(true);

        const response = await getAuditLogs({
          page,
          limit: 25,
          ...(action ? { action } : {}),
          ...(targetType ? { targetType } : {}),
        });

        setLogs(response?.data?.logs || []);
        setPagination(
          response?.data?.pagination || { page: 1, pages: 1, total: 0 },
        );
      } catch (err) {
        console.error("Audit logs error:", err);
        setError(err?.response?.data?.message || "Unable to load audit logs.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [action, page, targetType],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadLogs();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadLogs]);

  useEffect(() => {
    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await getAuditLogFilters();
        setFilters(response?.data || { actions: [], targetTypes: [] });
      } catch (err) {
        console.error("Audit filter error:", err);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleActionChange = (value) => {
    setAction(value);
    setPage(1);
  };

  const handleTargetChange = (value) => {
    setTargetType(value);
    setPage(1);
  };

  return (
    <div className="space-y-6 text-white">
      <section className="relative overflow-hidden rounded-3xl border border-[#485F4D] bg-[#1E2B3B] p-6 shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-[#4A6741]/15 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-lg">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8FA985]">
                Security history
              </p>
              <h1 className="mt-1 text-2xl font-black sm:text-3xl">
                Audit Log
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#90A1B9]">
                See who changed appointment status and what happened in the
                system.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => loadLogs({ refresh: true })}
            disabled={isRefreshing}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#485F4D] bg-[#172132] px-4 text-sm font-bold text-[#CAD5E2] transition hover:border-[#8FA985] hover:bg-[#24332F] disabled:opacity-60"
          >
            <RefreshCw
              className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/30 p-4 text-sm text-rose-200">
          {error}
        </div>
      )}

      <section className="rounded-3xl border border-[#485F4D] bg-[#1E2B3B] p-4 shadow-xl sm:p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
          <Filter className="size-4 text-[#8FA985]" />
          Filter history
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <select
            value={action}
            onChange={(event) => handleActionChange(event.target.value)}
            className="h-11 rounded-xl border border-[#485F4D] bg-[#172132] px-3 text-sm text-white outline-none focus:border-[#8FA985]"
          >
            <option value="">All actions</option>
            {filters.actions.map((item) => (
              <option key={item} value={item}>
                {formatAction(item)}
              </option>
            ))}
          </select>
          <select
            value={targetType}
            onChange={(event) => handleTargetChange(event.target.value)}
            className="h-11 rounded-xl border border-[#485F4D] bg-[#172132] px-3 text-sm text-white outline-none focus:border-[#8FA985]"
          >
            <option value="">All record types</option>
            {filters.targetTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-[#485F4D] bg-[#1E2B3B] shadow-xl">
        {isLoading ? (
          <div className="flex min-h-72 items-center justify-center">
            <RefreshCw className="size-6 animate-spin text-[#8FA985]" />
          </div>
        ) : logs.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <ClipboardList className="mx-auto size-10 text-[#8FA985]" />
            <h2 className="mt-4 text-lg font-bold">No audit records found</h2>
            <p className="mt-1 text-sm text-[#90A1B9]">
              Records will appear when protected actions change system data.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead className="border-b border-[#485F4D] bg-[#172132]">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#8FA985]">
                    Time
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#8FA985]">
                    Actor
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#8FA985]">
                    Action
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#8FA985]">
                    Target
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#8FA985]">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#485F4D]/50">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-[#172132]/70">
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-[#90A1B9]">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-white">
                        {log.actorType === "system"
                          ? "System"
                          : log.userId?.name || "Unknown user"}
                      </p>
                      <p className="text-xs text-[#90A1B9]">
                        {log.userId?.role || log.metadata?.actor || "-"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full border border-[#485F4D] bg-[#172132] px-2.5 py-1 text-xs font-bold text-[#CAD5E2]">
                        {formatAction(log.action)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-white">
                        {log.targetType}
                      </p>
                      <p
                        className="max-w-48 truncate text-xs text-[#90A1B9]"
                        title={log.targetId}
                      >
                        {log.targetId}
                      </p>
                    </td>
                    <td className="max-w-72 px-5 py-4 text-xs text-[#CAD5E2]">
                      {formatChanges(log.changes)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="flex items-center justify-between rounded-2xl border border-[#485F4D] bg-[#1E2B3B] px-4 py-3">
        <p className="text-xs text-[#90A1B9]">
          {pagination.total || 0} total records
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
            disabled={page <= 1 || isLoading}
            className="flex size-9 items-center justify-center rounded-lg border border-[#485F4D] bg-[#172132] text-[#CAD5E2] disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-xs font-bold text-[#CAD5E2]">
            Page {pagination.page || page} of {pagination.pages || 1}
          </span>
          <button
            type="button"
            onClick={() =>
              setPage((current) => Math.min(current + 1, pagination.pages || 1))
            }
            disabled={page >= (pagination.pages || 1) || isLoading}
            className="flex size-9 items-center justify-center rounded-lg border border-[#485F4D] bg-[#172132] text-[#CAD5E2] disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuditLogs;
