import {
  Banknote,
  Building2,
  Clock3,
  CreditCard,
  Scissors,
  X,
} from "lucide-react";

function ServiceDetailsModal({
  service,
  onClose,
  onEdit,
  onDelete,
}) {
  if (!service) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#07101f]/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#344960] bg-[#172638] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#2d4055] p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-13 items-center justify-center rounded-2xl border border-[#466044] bg-[#20352d]">
              <Scissors className="size-5 text-[#a4c57e]" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-[#eef3f8]">
                  {service.name}
                </h2>

                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                    service.isActive
                      ? "border-[#3d6042] bg-[#20352d] text-[#9fc47a]"
                      : "border-[#3a4b5e] bg-[#202f40] text-[#8194aa]"
                  }`}
                >
                  {service.isActive
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>

              <p className="mt-1 text-sm text-[#7188a5]">
                {service.category || "Uncategorized"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-xl text-[#7188a5] transition hover:bg-[#25384c] hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div>
            <p className="text-sm font-semibold text-[#e5ebf2]">
              Description
            </p>

            <p className="mt-2 text-sm leading-6 text-[#8197b1]">
              {service.description ||
                "No description available."}
            </p>
          </div>

          {/* Details */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <DetailItem
              icon={Clock3}
              label="Duration"
              value={`${service.duration ?? 0} minutes`}
            />

            <DetailItem
              icon={Clock3}
              label="Buffer After"
              value={`${service.bufferAfter ?? 0} minutes`}
            />

            <DetailItem
              icon={Banknote}
              label="Service Price"
              value={`Rs. ${service.price ?? 0}`}
            />

            <DetailItem
              icon={CreditCard}
              label="Deposit"
              value={`Rs. ${service.deposit ?? 0}`}
            />

            <DetailItem
              icon={Scissors}
              label="Required Chair"
              value={
                service.chairTypeRequired ||
                "Not specified"
              }
            />

            <DetailItem
              icon={Building2}
              label="Branches"
              value={`${service.branchIds?.length ?? 0} ${
                service.branchIds?.length === 1
                  ? "Branch"
                  : "Branches"
              }`}
            />
          </div>

          {/* Booking */}
          <div className="mt-6 rounded-2xl border border-[#30445a] bg-[#1c2d40] p-5">
            <h3 className="font-bold text-[#e8eef5]">
              Booking Information
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <InfoRow
                label="Deposit Refundable"
                value={
                  service.isDepositRefundable
                    ? "Yes"
                    : "No"
                }
              />

              <InfoRow
                label="Combo Service"
                value={
                  service.isCombo
                    ? "Yes"
                    : "No"
                }
              />
            </div>
          </div>

          {/* Combo */}
          {service.isCombo &&
            service.comboServiceIds?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold text-[#e8eef5]">
                  Included Services
                </h3>

                <p className="mt-2 text-sm text-[#8197b1]">
                  This combo contains{" "}
                  {service.comboServiceIds.length} services.
                </p>
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-[#2d4055] bg-[#142336] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {service.isActive && (
              <button
                type="button"
                onClick={onDelete}
                className="rounded-xl border border-red-900/60 bg-red-950/20 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-950/40"
              >
                Deactivate
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#3a4e65] bg-[#1d3044] px-4 py-2.5 text-sm font-semibold text-[#aebdcd] transition hover:bg-[#263a50] hover:text-white"
            >
              Close
            </button>

            <button
              type="button"
              onClick={onEdit}
              className="rounded-xl border border-[#789f5d] bg-[#709957] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#7ba461]"
            >
              Edit Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-[#30445a] bg-[#1c2d40] p-4">
      <div className="flex items-center gap-2 text-[#7188a5]">
        <Icon className="size-4 text-[#9dbb7c]" />

        <span className="text-xs font-semibold">
          {label}
        </span>
      </div>

      <p className="mt-2 font-bold capitalize text-[#e6edf4]">
        {value}
      </p>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold text-[#7188a5]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#cbd6e1]">
        {value}
      </p>
    </div>
  );
}

export default ServiceDetailsModal;