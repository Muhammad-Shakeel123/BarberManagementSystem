import { Building2, Phone, Mail } from "lucide-react";

function EditBranchBasicInfo({ form, branch, onChange, loading }) {
  return (
    <section>
      <div className="mb-4 flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-lime-400/30 bg-lime-400/10">
          <Building2 className="size-4 text-lime-300" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">
            Basic Information
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Update the primary details of this branch.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Branch Name */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            Branch Name
          </label>

          <input
            type="text"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            required
            disabled={loading}
            placeholder="Main Branch"
            className="w-full rounded-lg border border-slate-700 bg-slate-800/70 px-3.5 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-lime-400/60 focus:ring-1 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Branch Code */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            Branch Code
          </label>

          <input
            type="text"
            value={branch.code || ""}
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-slate-700 bg-slate-950/50 px-3.5 py-3 text-sm uppercase text-slate-500 outline-none"
          />

          <p className="mt-1.5 text-[11px] text-slate-600">
            Branch code cannot be changed.
          </p>
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-300">
            <Phone className="size-3.5 text-slate-500" />
            Phone
            <span className="font-normal text-slate-600">(Optional)</span>
          </label>

          <input
            type="text"
            value={form.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            disabled={loading}
            placeholder="+923001234567"
            className="w-full rounded-lg border border-slate-700 bg-slate-800/70 px-3.5 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-lime-400/60 focus:ring-1 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-300">
            <Mail className="size-3.5 text-slate-500" />
            Email
            <span className="font-normal text-slate-600">(Optional)</span>
          </label>

          <input
            type="email"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            disabled={loading}
            placeholder="branch@example.com"
            className="w-full rounded-lg border border-slate-700 bg-slate-800/70 px-3.5 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-lime-400/60 focus:ring-1 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
    </section>
  );
}

export default EditBranchBasicInfo;