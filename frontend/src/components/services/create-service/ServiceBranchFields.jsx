import { Building2, MapPin } from "lucide-react";

function ServiceBranchFields({
  formData,
  branches,
  onChange,
}) {
  return (
    <section>
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
          Branch Availability
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Select the branches where this service is available.
        </p>
      </div>

      {branches?.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-[#162235] p-6 text-center">
          <Building2 className="mx-auto size-6 text-slate-500" />

          <p className="mt-2 text-sm font-medium text-slate-300">
            No branches available
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Create a branch before assigning services.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <select
              multiple
              value={formData.branchIds}
              onChange={onChange}
              className="min-h-32 w-full rounded-xl border border-slate-700 bg-[#182438] px-3.5 py-3 text-sm text-white outline-none transition hover:border-slate-600 focus:border-[#71965a] focus:ring-4 focus:ring-[#71965a]/10"
            >
              {branches.map((branch) => (
                <option
                  key={branch._id}
                  value={branch._id}
                  className="bg-[#182438] py-2"
                >
                  {branch.name}
                  {branch.code ? ` (${branch.code})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-700/70 bg-[#121e30] px-3.5 py-2.5">
            <MapPin className="size-3.5 text-[#88ae69]" />

            <p className="text-xs text-slate-500">
              Hold{" "}
              <span className="font-medium text-slate-300">
                Ctrl
              </span>{" "}
              /{" "}
              <span className="font-medium text-slate-300">
                Cmd
              </span>{" "}
              to select multiple branches.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default ServiceBranchFields;