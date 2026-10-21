import {
  CheckCircle2,
  Clock3,
  XCircle,
  RotateCcw,
  CircleDollarSign,
} from "lucide-react";

function PaymentStatusBadge({ status }) {
  const getStatusConfig = (value) => {
    switch (value) {
      case "paid":
        return {
          label: "Paid",
          icon: CheckCircle2,
          className: "payment-status--paid",
          dot: "payment-status-dot--paid",
        };

      case "pending":
        return {
          label: "Pending",
          icon: Clock3,
          className: "payment-status--pending",
          dot: "payment-status-dot--pending",
        };

      case "failed":
        return {
          label: "Failed",
          icon: XCircle,
          className: "payment-status--failed",
          dot: "payment-status-dot--failed",
        };

      case "refunded":
        return {
          label: "Refunded",
          icon: RotateCcw,
          className: "payment-status--refunded",
          dot: "payment-status-dot--refunded",
        };

      default:
        return {
          label: value || "Unknown",
          icon: CircleDollarSign,
          className: "payment-status--unknown",
          dot: "payment-status-dot--unknown",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={`payment-status inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${config.className}`}
    >
      <span className={`size-1.5 rounded-full ${config.dot}`} />

      <Icon className="size-3" />

      {config.label}
    </span>
  );
}

export default PaymentStatusBadge;
