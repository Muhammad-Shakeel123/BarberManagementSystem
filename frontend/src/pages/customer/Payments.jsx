import { useEffect, useState } from "react";
import { Eye, RefreshCw } from "lucide-react";

import {
  createPaymentIntent,
  getMyPayments,
  getPaymentById,
} from "@/services/payment.service";
import PaymentDetailsModal from "@/components/payment/PaymentDetailsModal";
import StripePaymentModal from "@/components/payment/StripePaymentModal";

function CustomerPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [payingPaymentId, setPayingPaymentId] = useState(null);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyPayments();

      setPayments(response?.data || []);
    } catch (err) {
      console.error("Load my payments error:", err);

      setError(err?.response?.data?.message || "Unable to load your payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPayments();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleViewPayment = async (paymentId) => {
    try {
      setDetailsLoading(true);
      setDetailsOpen(true);
      setError("");

      const response = await getPaymentById(paymentId);

      setSelectedPayment(response?.data || null);
    } catch (err) {
      console.error("Payment details error:", err);

      setError(
        err?.response?.data?.message || "Unable to load payment details.",
      );

      setDetailsOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handlePayNow = async (payment) => {
    const appointmentId = payment?.appointmentId?._id || payment?.appointmentId;

    if (!appointmentId) {
      setError("This payment is not linked to an appointment.");
      return;
    }

    try {
      setPayingPaymentId(payment._id);
      setError("");

      const response = await createPaymentIntent(appointmentId, "card");
      const paymentData = response?.data;

      if (!paymentData?.clientSecret) {
        throw new Error("Payment setup did not return a Stripe client secret.");
      }

      setPaymentClientSecret(paymentData.clientSecret);
      setPaymentAmount(paymentData.amount || payment.amount || 0);
      setPaymentOpen(true);
    } catch (err) {
      console.error("Create payment intent error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to start payment.",
      );
    } finally {
      setPayingPaymentId(null);
    }
  };

  const handlePaymentSuccess = async () => {
    setPaymentOpen(false);
    setPaymentClientSecret("");
    setPaymentAmount(0);
    await loadPayments();
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatAmount = (amount) => {
    return `Rs. ${Number(amount || 0).toLocaleString()}`;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "paid":
        return "bg-[#4A6741]/25 text-[#8FA985] border-[#485F4D]";

      case "pending":
        return "bg-amber-950/40 text-amber-300 border-amber-500/30";

      case "failed":
        return "bg-rose-950/40 text-rose-300 border-rose-500/30";

      case "refunded":
        return "bg-[#172132] text-[#90A1B9] border-[#485F4D]/50";

      default:
        return "bg-[#172132] text-[#90A1B9] border-[#485F4D]/50";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto size-7 animate-spin rounded-full border-2 border-[#485F4D] border-t-[#8FA985]" />

          <p className="mt-3 text-sm text-[#90A1B9]">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">My Payments</h1>

          <p className="mt-1 text-sm text-[#90A1B9]">
            View your payment history and transaction details.
          </p>
        </div>

        <button
          type="button"
          onClick={loadPayments}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#485F4D] bg-[#172132] px-4 py-2.5 text-sm font-semibold text-[#CAD5E2] transition hover:border-[#8FA985] hover:bg-[#1D293D] hover:text-white disabled:opacity-60"
        >
          <RefreshCw className="size-4 text-[#8FA985]" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-[#485F4D] bg-[#1E2B3B] shadow-xl shadow-black/20">
        {payments.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-[#90A1B9]">No payments found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="border-b border-[#485F4D]/60 bg-[#172132]/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#8FA985]">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#8FA985]">
                    Method
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#8FA985]">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#8FA985]">
                    Date
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-[#8FA985]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#485F4D]/40">
                {payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="transition hover:bg-[#1D293D]/60"
                  >
                    <td className="px-6 py-4 font-bold text-white">
                      {formatAmount(payment.amount)}
                    </td>

                    <td className="px-6 py-4 text-sm capitalize text-[#CAD5E2]">
                      {payment.paymentMethod || "-"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getStatusClass(
                          payment.status,
                        )}`}
                      >
                        {payment.status || "-"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-[#90A1B9]">
                      {formatDate(payment.createdAt)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {payment.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => handlePayNow(payment)}
                            disabled={payingPaymentId === payment._id}
                            className="rounded-xl bg-[#6f9f5b] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#7da866] disabled:opacity-60"
                          >
                            {payingPaymentId === payment._id
                              ? "Preparing..."
                              : "Pay now"}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleViewPayment(payment._id)}
                          className="inline-flex items-center gap-2 rounded-xl border border-[#485F4D] bg-[#172132] px-3 py-1.5 text-xs font-semibold text-[#CAD5E2] transition hover:border-[#8FA985] hover:bg-[#1D293D] hover:text-white"
                        >
                          <Eye className="size-3.5 text-[#8FA985]" />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PaymentDetailsModal
        open={detailsOpen}
        payment={selectedPayment}
        loading={detailsLoading}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedPayment(null);
        }}
      />

      <StripePaymentModal
        open={paymentOpen}
        clientSecret={paymentClientSecret}
        amount={paymentAmount}
        onSuccess={handlePaymentSuccess}
        onClose={() => {
          setPaymentOpen(false);
          setPaymentClientSecret("");
          setPaymentAmount(0);
        }}
      />
    </div>
  );
}

export default CustomerPayments;
