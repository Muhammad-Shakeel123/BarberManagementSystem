import { useState } from "react";

import {
  Banknote,
  Building2,
  ChevronRight,
  Clock3,
  MoreVertical,
  Pencil,
  Power,
  Scissors,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

function ServiceCard({
  service,
  onClick,
  onEdit,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    setMenuOpen(false);
    onEdit?.(service);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    setMenuOpen(false);
    onDelete?.(service);
  };

  return (
    <Card
      onClick={onClick}
      className="group relative cursor-pointer overflow-visible rounded-3xl border border-[#3d6041] bg-[#1b2b3d] shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-[#6B8C5E] hover:bg-[#1e3043]"
    >
      <CardContent className="p-0">

        {/* Main */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[#466044] bg-[#20352d] text-[#a2c47e]">
                <Scissors className="size-5" />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-base font-bold text-[#eef3f8]">
                  {service.name}
                </h3>

                <p className="mt-1 truncate text-xs font-semibold text-[#7188a5]">
                  {service.category || "General Grooming"}
                </p>
              </div>
            </div>

            <div className="relative flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                  service.isActive
                    ? "border-[#3d6042] bg-[#20352d] text-[#9dc477]"
                    : "border-[#3a4b5e] bg-[#202f40] text-[#8194aa]"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    service.isActive
                      ? "bg-[#61c84a]"
                      : "bg-[#788ba1]"
                  }`}
                />

                {service.isActive
                  ? "Active"
                  : "Inactive"}
              </span>

              <button
                type="button"
                onClick={handleMenuClick}
                className="flex size-8 items-center justify-center rounded-xl text-[#7188a5] transition hover:bg-[#26394d] hover:text-[#dce5ef]"
              >
                <MoreVertical className="size-4" />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 top-10 z-30 w-44 overflow-hidden rounded-2xl border border-[#344960] bg-[#172638] p-1.5 shadow-2xl"
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-[#cbd6e2] transition hover:bg-[#23364a]"
                  >
                    <Pencil className="size-3.5" />
                    Edit Service
                  </button>

                  {service.isActive && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-red-400 transition hover:bg-red-950/30"
                    >
                      <Power className="size-3.5" />
                      Deactivate
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <p className="mt-4 line-clamp-2 min-h-10 text-xs leading-5 text-[#7890ad]">
            {service.description ||
              "Premium hair and grooming service."}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 border-y border-[#2d4055] bg-[#192a3b]">
          <div className="border-r border-[#2d4055] px-5 py-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#7188a5]">
              <Clock3 className="size-3.5 text-[#9dbb7c]" />
              Duration
            </div>

            <p className="mt-1.5 text-sm font-bold text-[#edf2f7]">
              {service.duration ?? 0}{" "}
              <span className="font-medium text-[#7188a5]">
                mins
              </span>
            </p>
          </div>

          <div className="px-5 py-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#7188a5]">
              <Banknote className="size-3.5 text-[#9dbb7c]" />
              Price
            </div>

            <p className="mt-1.5 text-sm font-bold text-[#edf2f7]">
              Rs. {service.price ?? 0}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#7188a5]">
            <Building2 className="size-3.5" />

            <span>
              {service.branchIds?.length ?? 0}{" "}
              {service.branchIds?.length === 1
                ? "Branch"
                : "Branches"}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-[#9fc17d] transition group-hover:text-[#b5d691]">
            Details
            <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ServiceCard;