import { Building2, Check, MapPin } from "lucide-react";

function EditServiceBranches({
  branches = [],
  branchIds = [],
  onToggle,
}) {
  return (
    <section>
      <div className="mb-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-100">
          Branch Availability
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          Select the branches where this service is available.
        </p>
      </div>

      {branches.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-600 bg-[#111d30] p-6 text-center">
          <Building2 className="mx-auto size-6 text-slate-500" />

          <p className="mt-2 text-sm font-semibold text-slate-300">
            No branches available
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Create a branch before assigning services.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {branches.map((branch) => {
            const selected = branchIds.includes(branch._id);

            return (
              <button
                key={branch._id}
                type="button"
                onClick={() => onToggle(branch._id)}
                className={`group flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                  selected
                    ? "border-[#769f5b]/70 bg-[#263a2b] shadow-[0_0_0_1px_rgba(118,159,91,0.15)]"
                    : "border-slate-600/70 bg-[#111d30] hover:border-slate-500 hover:bg-[#172438]"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${
                      selected
                        ? "border-[#769f5b]/50 bg-[#344c32] text-[#a9c78e]"
                        : "border-slate-600 bg-[#1a2a3e] text-slate-400"
                    }`}
                  >
                    <Building2 className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-100">
                      {branch.name}
                    </p>

                    <div className="mt-1 flex items-center gap-1.5">
                      <MapPin className="size-3 text-slate-500" />

                      <span className="text-xs text-slate-500">
                        {branch.code || "Branch location"}
                      </span>
                    </div>
                  </div>
                </div>

                {selected && (
                  <div className="ml-3 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#769f5b] text-white shadow-sm">
                    <Check className="size-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default EditServiceBranches;