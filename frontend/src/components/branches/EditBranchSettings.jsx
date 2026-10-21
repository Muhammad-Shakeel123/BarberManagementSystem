import { CalendarDays, Footprints, Globe2, TimerReset } from "lucide-react";

function EditBranchSettings({ form, onChange, loading }) {
  return (
    <section>
      <div className="mb-4 flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-lime-400/30 bg-lime-400/10">
          <Globe2 className="size-4 text-lime-300" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">
            Booking Configuration
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Control how customers can book appointments at this branch.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Booking toggles */}
        <div className="grid gap-4 sm:grid-cols-2">
          <SettingToggle
            icon={Globe2}
            title="Online Booking"
            description="Allow customers to book online."
            checked={form.settings.allowOnlineBooking}
            onChange={(value) => onChange("allowOnlineBooking", value)}
            disabled={loading}
          />

          <SettingToggle
            icon={Footprints}
            title="Walk-in"
            description="Allow customers without appointments."
            checked={form.settings.allowWalkIn}
            onChange={(value) => onChange("allowWalkIn", value)}
            disabled={loading}
          />
        </div>

        {/* Numeric settings */}
        <div className="grid gap-4 sm:grid-cols-3">
          <SettingInput
            icon={CalendarDays}
            label="Advance Booking"
            suffix="days"
            value={form.settings.maxDaysAdvance}
            onChange={(value) => onChange("maxDaysAdvance", value)}
            disabled={loading}
          />

          <SettingInput
            icon={TimerReset}
            label="Minimum Advance"
            suffix="minutes"
            value={form.settings.minMinutesAdvance}
            onChange={(value) => onChange("minMinutesAdvance", value)}
            disabled={loading}
          />

          <SettingInput
            icon={TimerReset}
            label="No-show Grace"
            suffix="minutes"
            value={form.settings.noShowGraceMinutes}
            onChange={(value) => onChange("noShowGraceMinutes", value)}
            disabled={loading}
          />
        </div>
      </div>
    </section>
  );
}

function SettingToggle({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
  disabled,
}) {
  return (
    <label
      className={`group flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
        checked
          ? "border-lime-400/30 bg-lime-400/[0.06]"
          : "border-slate-700 bg-slate-800/50"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex size-9 items-center justify-center rounded-lg border ${
            checked
              ? "border-lime-400/30 bg-lime-400/10"
              : "border-slate-700 bg-slate-900"
          }`}
        >
          <Icon
            className={`size-4 ${
              checked ? "text-lime-300" : "text-slate-500"
            }`}
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-white">{title}</p>

          <p className="mt-0.5 text-[11px] text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="peer sr-only"
        />

        <div className="h-6 w-11 rounded-full bg-slate-700 transition peer-checked:bg-lime-400 peer-focus-visible:ring-2 peer-focus-visible:ring-lime-400/30" />

        <div className="absolute left-1 top-1 size-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />
      </div>
    </label>
  );
}

function SettingInput({
  icon: Icon,
  label,
  suffix,
  value,
  onChange,
  disabled,
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-900">
          <Icon className="size-3.5 text-lime-300" />
        </div>

        <span className="text-xs font-medium text-slate-300">
          {label}
        </span>
      </div>

      <div className="relative">
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 pr-16 text-sm font-semibold text-white outline-none transition focus:border-lime-400/60 focus:ring-1 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium uppercase tracking-wide text-slate-600">
          {suffix}
        </span>
      </div>
    </div>
  );
}

export default EditBranchSettings;