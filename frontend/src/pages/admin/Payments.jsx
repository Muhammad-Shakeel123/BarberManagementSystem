import { useEffect, useState } from "react";

import {
  getAllPayments,
  getPaymentById,
  refundPayment,
} from "@/services/payment.service";

import PaymentPageHeader from "@/components/payment/PaymentPageHeader";
import PaymentAlerts from "@/components/payment/PaymentAlerts";
import PaymentTable from "@/components/payment/PaymentTable";
import PaymentDetailsModal from "@/components/payment/PaymentDetailsModal";
import RefundPaymentModal from "@/components/payment/RefundPaymentModal";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [refundOpen, setRefundOpen] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);

  /*
   * Load all payments
   */
  const loadPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllPayments();

      setPayments(response?.data || []);
    } catch (err) {
      console.error("Load payments error:", err);

      setError(err?.response?.data?.message || "Unable to load payments.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * Initial load
   */
  useEffect(() => {
    const timeoutId = setTimeout(loadPayments, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  /*
   * View payment details
   */
  const handleViewPayment = async (paymentId) => {
    try {
      setDetailsLoading(true);
      setDetailsOpen(true);
      setError("");
      setSuccess("");

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

  /*
   * Refund payment
   */
  const handleRefundPayment = async (refundData) => {
    if (!selectedPayment?._id) {
      throw new Error("Payment ID is missing.");
    }

    try {
      setRefundLoading(true);
      setError("");
      setSuccess("");

      const response = await refundPayment(selectedPayment._id, refundData);

      const updatedPayment = response?.data;

      if (updatedPayment) {
        setSelectedPayment(updatedPayment);
      }

      setRefundOpen(false);

      await loadPayments();

      setSuccess("Payment refunded successfully.");
    } catch (err) {
      console.error("Refund payment error:", err);

      throw err;
    } finally {
      setRefundLoading(false);
    }
  };

  /*
   * Format date
   */
  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  /*
   * Format amount
   */
  const formatAmount = (amount) => {
    return `$${Number(amount || 0).toFixed(2)}`;
  };

  /*
   * Loading state
   */
  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-[#485F4D] bg-[#172132]">
            <div className="size-6 animate-spin rounded-full border-2 border-[#485F4D] border-t-[#8FA985]" />
          </div>

          <p className="mt-4 text-sm font-medium text-[#90A1B9]">
            Loading payment transactions...
          </p>

          <p className="mt-1 text-xs text-[#64748B]">
            Preparing your payment workspace
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PaymentPageHeader onRefresh={loadPayments} loading={loading} />

      <PaymentAlerts error={error} success={success} />

      <PaymentTable
        payments={payments}
        onViewPayment={handleViewPayment}
        formatDate={formatDate}
        formatAmount={formatAmount}
      />

      <PaymentDetailsModal
        open={detailsOpen}
        payment={selectedPayment}
        loading={detailsLoading}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedPayment(null);
        }}
        onRefund={() => {
          setRefundOpen(true);
        }}
      />

      <RefundPaymentModal
        open={refundOpen}
        payment={selectedPayment}
        loading={refundLoading}
        onClose={() => {
          if (!refundLoading) {
            setRefundOpen(false);
          }
        }}
        onSubmit={handleRefundPayment}
      />
    </div>
  );
}

export default Payments;