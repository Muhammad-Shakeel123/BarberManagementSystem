import {
  RefreshCw,
  CreditCard,
  Sparkles,
} from "lucide-react";

function PaymentPageHeader({ onRefresh, loading }) {
  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
      {/* Title */}
      <div className="flex items-start gap-4">
        <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl border border-[#485F4D] bg-gradient-to-b from-[#4A6741] to-[#304A34] shadow-lg shadow-black/20">
          <CreditCard className="size-6 text-[#E4EDDF]" />

          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full border-2 border-[#0D1528] bg-[#6B8C5E]">
            <span className="size-1.5 rounded-full bg-white" />
          </span>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Payment Transactions
            </h1>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#485F4D] bg-[#172132] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#A8BE9F]">
              <Sparkles className="size-3 text-[#8FA985]" />
              Stripe Verified
            </span>
          </div>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#90A1B9]">
            Monitor customer payments, transaction status, and secure refund
            operations from one place.
          </p>
        </div>
      </div>

      {/* Refresh */}
      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-[#33445A] bg-[#172132] px-4 text-sm font-semibold text-[#CAD5E2] shadow-sm transition hover:border-[#485F4D] hover:bg-[#1D293D] hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 xl:self-auto"
      >
        <RefreshCw
          className={`size-4 ${
            loading ? "animate-spin text-[#8FA985]" : "text-[#90A1B9]"
          }`}
        />

        {loading ? "Refreshing..." : "Refresh Feed"}
      </button>
    </div>
  );
}

export default PaymentPageHeader;