import { Filter, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";

function ServiceFilters({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  categories,
}) {
  const hasFilters =
    searchTerm ||
    categoryFilter !== "all" ||
    statusFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="rounded-3xl border border-[#485F4D] bg-[#1E2B3B] p-5 shadow-none">
      <div className="flex flex-col gap-3 xl:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#90A1B9]" />

          <Input
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search service, category or description..."
            className="h-12 rounded-2xl border-[#485F4D]/70 bg-[#172132] pl-11 text-sm text-[#CAD5E2] placeholder:text-[#90A1B9]/60 shadow-none focus:border-[#8FA985] focus:ring-1 focus:ring-[#8FA985]/20"
          />
        </div>

        {/* Category */}
        <div className="relative xl:w-52">
          <Filter className="absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-[#90A1B9]" />

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
            className="h-12 w-full appearance-none rounded-2xl border border-[#485F4D]/70 bg-[#172132] pl-11 pr-8 text-sm font-medium text-[#CAD5E2] outline-none transition hover:border-[#8FA985]/60 focus:border-[#8FA985] focus:ring-1 focus:ring-[#8FA985]/20"
          >
            <option value="all">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className="h-12 rounded-2xl border border-[#485F4D]/70 bg-[#172132] px-4 text-sm font-medium text-[#CAD5E2] outline-none transition hover:border-[#8FA985]/60 focus:border-[#8FA985] focus:ring-1 focus:ring-[#8FA985]/20 xl:w-44"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#485F4D]/60 bg-[#172132] px-5 text-sm font-semibold text-[#90A1B9] transition hover:border-[#8FA985] hover:bg-[#1D293D] hover:text-white"
          >
            <X className="size-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default ServiceFilters;