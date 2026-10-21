import { useState } from "react";
import {
  PaymentElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  CreditCard,
  ShieldCheck,
  X,
  LockKeyhole,
} from "lucide-react";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
);

function PaymentForm({ onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      setProcessing(true);
      setError("");

      const { error } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        setError(error.message || "Payment failed.");
        return;
      }

      onSuccess();
    } catch (err) {
      console.error("Stripe payment error:", err);

      setError(err?.message || "Unable to process payment.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-2xl border border-[#33445A] bg-[#111B2B] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg border border-[#485F4D] bg-[#263A2A]">
              <CreditCard className="size-4 text-[#A8BE9F]" />
            </div>

            <p className="text-xs font-bold uppercase tracking-wider text-[#90A1B9]">
              Payment Method
            </p>
          </div>

          <LockKeyhole className="size-3.5 text-[#64748B]" />
        </div>

        <div className="rounded-xl bg-white p-3">
          <PaymentElement />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      <div className="flex items-start gap-3 rounded-xl border border-[#33445A] bg-[#111B2B] px-3.5 py-3">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#8FA985]" />

        <p className="text-[11px] leading-5 text-[#90A1B9]">
          Your payment information is securely processed by Stripe. Your card
          details are never stored on our servers.
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-[#2B3A4E] pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="rounded-xl border border-[#33445A] bg-[#111B2B] px-5 py-2.5 text-sm font-bold text-[#CAD5E2] transition hover:border-[#485F4D] hover:bg-[#1D293D] hover:text-white disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={!stripe || !elements || processing}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4A6741] to-[#6B8C5E] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#4A6741]/20 transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CreditCard className="size-4" />

          {processing ? "Processing Payment..." : "Pay Now"}
        </button>
      </div>
    </form>
  );
}

function StripePaymentModal({
  open,
  clientSecret,
  amount,
  onSuccess,
  onClose,
}) {
  if (!open || !clientSecret) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#33445A] bg-[#172132] shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#2B3A4E] bg-[#111B2B] p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#485F4D] bg-gradient-to-b from-[#4A6741] to-[#304A34]">
              <CreditCard className="size-5 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  Complete Payment
                </h2>

                <span className="inline-flex items-center gap-1 rounded-full border border-[#485F4D]/50 bg-[#263A2A] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#A8BE9F]">
                  <ShieldCheck className="size-2.5" />
                  Secure
                </span>
              </div>

              <p className="mt-1 text-xs text-[#64748B]">
                Secure payment powered by Stripe.
              </p>

              <p className="mt-3 text-2xl font-black text-white">
                ${Number(amount || 0).toFixed(2)}
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

        {/* Payment */}
        <div className="p-5">
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
            }}
          >
            <PaymentForm
              onSuccess={onSuccess}
              onCancel={onClose}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
}

export default StripePaymentModal;