import {
  Armchair,
  Pencil,
  Trash2,
  UserRound,
  ChevronRight,
} from "lucide-react";

function ChairCard({ chair, onView, onEdit, onDelete }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[#485F4D] bg-[#172437] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl hover:shadow-black/20">
      {/* Top Accent */}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[#78a85b]/30 bg-[#78a85b]/10 transition-all duration-300 group-hover:border-[#78a85b]/50 group-hover:bg-[#78a85b]/20">
              <Armchair className="size-5 text-[#9ac47d]" />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-white">
                {chair.name}
              </h3>

              <div className="mt-1 flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Station #{chair.number}
                </span>

                <span className="size-1 rounded-full bg-slate-600" />

                <span className="text-[11px] text-slate-500">Chair</span>
              </div>
            </div>
          </div>

          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
              chair.isOperational
                ? "border-[#78a85b]/30 bg-[#78a85b]/10 text-[#9ac47d]"
                : "border-slate-700 bg-slate-800 text-slate-400"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                chair.isOperational ? "bg-[#78a85b]" : "bg-slate-500"
              }`}
            />

            {chair.isOperational ? "Operational" : "Offline"}
          </span>
        </div>

        {/* Details */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-800 bg-[#111b2d]">
          <div className="divide-y divide-slate-800">
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-xs font-medium text-slate-500">
                Station Type
              </span>

              <span className="text-xs font-semibold capitalize text-slate-200">
                {chair.type || "General"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-xs font-medium text-slate-500">
                Shared Station
              </span>

              <span className="text-xs font-semibold text-slate-200">
                {chair.isShared ? "Yes" : "No"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-xs font-medium text-slate-500">
                Assigned Barber
              </span>

              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <UserRound className="size-3.5 text-[#9ac47d]" />

                {chair.assignedBarberId ? "Assigned" : "Unassigned"}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-800 pt-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onView?.(chair)}
              className="rounded-xl border border-slate-700 bg-slate-800/70 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-700 hover:text-white active:scale-95"
            >
              View
            </button>

            <button
              type="button"
              onClick={() => onEdit?.(chair)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/70 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-[#78a85b]/40 hover:bg-[#78a85b] hover:text-white active:scale-95"
            >
              <Pencil className="size-3.5" />
              Edit
            </button>

            <button
              type="button"
              onClick={() => onDelete?.(chair)}
              className="inline-flex items-center justify-center rounded-xl border border-red-900/50 bg-red-950/20 px-3 py-2 text-red-400 transition hover:bg-red-950/40 hover:text-red-300 active:scale-95"
              title="Delete Chair"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onView?.(chair)}
            className="flex size-8 items-center justify-center rounded-full bg-slate-800 transition-all duration-300 group-hover:bg-[#78a85b]"
            aria-label="View chair details"
          >
            <ChevronRight className="size-4 text-slate-500 transition-colors group-hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChairCard;
