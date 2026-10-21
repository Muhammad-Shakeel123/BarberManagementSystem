import { useState } from "react";
import {
  X,
  RotateCcw,
  AlertTriangle,
  CircleDollarSign,
} from "lucide-react";

function RefundPaymentModal({
  open,
  payment,
  loading = false,
  onClose,
  onSubmit,
}) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!open) {
    return null;
  }

  const paymentAmount = Number(payment?.amount || 0);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (amount !== "") {
      const numericAmount = Number(amount);

      if (
        Number.isNaN(numericAmount) ||
        numericAmount <= 0 ||
        numericAmount > paymentAmount
      ) {
        setError(
          `Refund amount must be between $0.01 and $${paymentAmount.toFixed(2)}.`,
        );
        return;
      }
    }

    try {
      await onSubmit({
        amount: amount === "" ? undefined : Number(amount),
        reason: reason.trim() || undefined,
      });

      setAmount("");
      setReason("");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to process refund.",
      );
    }
  };

  const handleClose = () => {
    if (loading) {
      return;
    }

    setAmount("");
    setReason("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#33445A] bg-[#172132] shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#2B3A4E] bg-[#111B2B] p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-950/30">
              <RotateCcw className="size-5 text-rose-300" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Refund Payment
              </h2>

              <p className="mt-1 text-xs text-[#64748B]">
                Process a secure refund for this transaction.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex size-9 items-center justify-center rounded-xl text-[#64748B] transition hover:bg-[#1D293D] hover:text-white disabled:opacity-40"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
          {/* Original amount */}
          <div className="rounded-2xl border border-[#485F4D]/60 bg-[#263A2A]/40 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-[#263A2A]">
                <CircleDollarSign className="size-4 text-[#A8BE9F]" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  Original Amount
                </p>

                <p className="mt-0.5 text-xl font-black text-white">
                  ${paymentAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-950/25 px-4 py-3 text-sm text-rose-300">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />

              <p>{error}</p>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#90A1B9]">
              Refund Amount
            </label>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#64748B]">
                $
              </span>

              <input
                type="number"
                min="0.01"
                max={paymentAmount}
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Full refund"
                disabled={loading}
                className="w-full rounded-xl border border-[#33445A] bg-[#111B2B] py-3 pl-8 pr-3 text-sm font-medium text-white outline-none transition placeholder:text-[#4F6075] focus:border-[#58764F] focus:ring-2 focus:ring-[#58764F]/10 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <p className="mt-1.5 text-[11px] text-[#64748B]">
              Leave empty to refund the full payment.
            </p>
          </div>

          {/* Reason */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#90A1B9]">
              Refund Reason
            </label>

            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              maxLength={200}
              rows={3}
              placeholder="Enter refund reason..."
              disabled={loading}
              className="w-full resize-none rounded-xl border border-[#33445A] bg-[#111B2B] px-3.5 py-3 text-sm font-medium text-white outline-none transition placeholder:text-[#4F6075] focus:border-[#58764F] focus:ring-2 focus:ring-[#58764F]/10 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <p className="mt-1.5 text-right text-[10px] text-[#4F6075]">
              {reason.length}/200
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#2B3A4E] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-xl border border-[#33445A] bg-[#111B2B] px-5 py-2.5 text-sm font-bold text-[#AAB7C8] transition hover:border-[#485F4D] hover:bg-[#1D293D] hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-950/20 transition hover:bg-rose-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RotateCcw
                className={`size-4 ${loading ? "animate-spin" : ""}`}
              />

              {loading ? "Processing..." : "Confirm Refund"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RefundPaymentModal;