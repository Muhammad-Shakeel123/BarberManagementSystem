import {
  X,
  User,
  CalendarDays,
  CreditCard,
  Receipt,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import PaymentStatusBadge from "./PaymentStatusBadge";

const formatDate = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatAmount = (value) => {
  return `$${Number(value || 0).toFixed(2)}`;
};

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-[#2B3A4E] py-3.5 last:border-b-0">
      <span className="shrink-0 text-xs font-medium text-[#64748B]">
        {label}
      </span>

      <span className="max-w-[65%] break-all text-right text-sm font-semibold text-[#D8E0EA]">
        {value || "—"}
      </span>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div className="flex size-8 items-center justify-center rounded-lg border border-[#33445A] bg-[#172132]">
        <Icon className="size-4 text-[#8FA985]" />
      </div>

      <h3 className="text-sm font-bold text-white">{title}</h3>
    </div>
  );
}

function PaymentDetailsModal({
  open,
  payment,
  loading = false,
  onClose,
  onRefund,
}) {
  if (!open) {
    return null;
  }

  const customer = payment?.customerId;
  const appointment = payment?.appointmentId;

  const isRefundable =
    payment?.status === "paid" &&
    !payment?.refundId &&
    typeof onRefund === "function";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="payment-details-modal max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#33445A] bg-[#172132] shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#2B3A4E] bg-[#172132]/95 px-5 py-5 backdrop-blur sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#485F4D] bg-[#263A2A]">
              <Receipt className="size-5 text-[#A8BE9F]" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Payment Details
              </h2>

              <p className="mt-1 text-xs text-[#64748B]">
                Complete transaction information
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-xl text-[#64748B] transition hover:bg-[#1D293D] hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          {loading ? (
            <div className="flex min-h-56 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-[#33445A] bg-[#111B2B]">
                  <div className="size-6 animate-spin rounded-full border-2 border-[#485F4D] border-t-[#8FA985]" />
                </div>

                <p className="mt-4 text-sm font-medium text-[#90A1B9]">
                  Loading payment details...
                </p>
              </div>
            </div>
          ) : !payment ? (
            <div className="rounded-2xl border border-[#33445A] bg-[#111B2B] py-12 text-center">
              <Receipt className="mx-auto size-7 text-[#64748B]" />

              <p className="mt-3 text-sm font-medium text-[#AAB7C8]">
                Payment details not available.
              </p>
            </div>
          ) : (
            <>
              {/* Payment summary */}
              <div className="payment-summary relative overflow-hidden rounded-2xl border border-[#485F4D]/70 p-5">
                <div className="absolute -right-10 -top-10 size-32 rounded-full bg-[#6B8C5E]/10 blur-2xl" />

                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="payment-summary-icon flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#58764F] bg-[#314734]">
                    <CreditCard className="size-5 text-[#B7CBAF]" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                      Payment Amount
                    </p>

                    <p className="mt-1 text-3xl font-black tracking-tight text-[var(--text-main)]">
                      {formatAmount(payment.amount)}
                    </p>
                  </div>

                  <div className="sm:ml-auto">
                    <PaymentStatusBadge status={payment.status} />
                  </div>
                </div>
              </div>

              {/* Customer */}
              <section>
                <SectionHeader icon={User} title="Customer" />

                <div className="rounded-2xl border border-[#2B3A4E] bg-[#111B2B] px-4">
                  <DetailRow label="Name" value={customer?.name} />
                  <DetailRow label="Email" value={customer?.email} />
                  <DetailRow label="Phone" value={customer?.phone} />
                </div>
              </section>

              {/* Appointment */}
              <section>
                <SectionHeader icon={CalendarDays} title="Appointment" />

                <div className="rounded-2xl border border-[#2B3A4E] bg-[#111B2B] px-4">
                  <DetailRow
                    label="Appointment ID"
                    value={appointment?._id}
                  />

                  <DetailRow
                    label="Start Time"
                    value={formatDate(appointment?.startTime)}
                  />

                  <DetailRow
                    label="End Time"
                    value={formatDate(appointment?.endTime)}
                  />

                  <DetailRow
                    label="Status"
                    value={appointment?.status}
                  />
                </div>
              </section>

              {/* Payment information */}
              <section>
                <SectionHeader
                  icon={Receipt}
                  title="Payment Information"
                />

                <div className="rounded-2xl border border-[#2B3A4E] bg-[#111B2B] px-4">
                  <DetailRow label="Payment ID" value={payment._id} />

                  <DetailRow
                    label="Payment Method"
                    value={payment.paymentMethod}
                  />

                  <DetailRow
                    label="Amount"
                    value={formatAmount(payment.amount)}
                  />

                  <DetailRow
                    label="Deposit"
                    value={formatAmount(payment.depositAmount)}
                  />

                  <DetailRow
                    label="Transaction ID"
                    value={payment.transactionId}
                  />

                  <DetailRow
                    label="Created"
                    value={formatDate(payment.createdAt)}
                  />

                  <DetailRow
                    label="Paid At"
                    value={formatDate(payment.paidAt)}
                  />
                </div>
              </section>

              {/* Refund information */}
              {(payment.refundId || payment.refundAmount > 0) && (
                <section>
                  <SectionHeader
                    icon={RotateCcw}
                    title="Refund Information"
                  />

                  <div className="rounded-2xl border border-purple-500/20 bg-purple-950/15 px-4">
                    <DetailRow
                      label="Refund ID"
                      value={payment.refundId}
                    />

                    <DetailRow
                      label="Refund Amount"
                      value={formatAmount(payment.refundAmount)}
                    />

                    <DetailRow
                      label="Reason"
                      value={payment.refundReason}
                    />

                    <DetailRow
                      label="Refunded At"
                      value={formatDate(payment.refundedAt)}
                    />
                  </div>
                </section>
              )}

              {/* Security */}
              <div className="flex items-start gap-3 rounded-2xl border border-[#33445A] bg-[#111B2B] px-4 py-3.5">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#8FA985]" />

                <div>
                  <p className="text-xs font-bold text-[#CAD5E2]">
                    Secure transaction
                  </p>

                  <p className="mt-0.5 text-[11px] leading-5 text-[#64748B]">
                    Payment information is securely processed through Stripe.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col-reverse gap-3 border-t border-[#2B3A4E] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-[#33445A] bg-[#111B2B] px-5 py-2.5 text-sm font-bold text-[#AAB7C8] transition hover:border-[#485F4D] hover:bg-[#1D293D] hover:text-white"
                >
                  Close
                </button>

                {isRefundable && (
                  <button
                    type="button"
                    onClick={onRefund}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-950/20 transition hover:bg-rose-500 active:scale-[0.98]"
                  >
                    <RotateCcw className="size-4" />
                    Refund Payment
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentDetailsModal;
