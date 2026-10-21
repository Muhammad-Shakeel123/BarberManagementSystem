import { Plus, Scissors } from "lucide-react";

function ServicesHeader({ onCreate }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-lg shadow-[#4A6741]/25">
          <Scissors className="size-6" />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Services
            </h1>

            <span className="rounded-full border border-[#485F4D] bg-[#172132] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#8FA985]">
              Service Catalog
            </span>
          </div>

          <p className="mt-1.5 text-sm text-[#90A1B9]">
            Manage barber shop services, pricing, duration, and availability.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onCreate}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#8FA985]/40 bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] px-5 text-sm font-bold text-white shadow-lg shadow-[#4A6741]/25 transition hover:brightness-110 active:scale-[0.98]"
      >
        <Plus className="size-4" />
        Create Service
      </button>
    </div>
  );
}

export default ServicesHeader;