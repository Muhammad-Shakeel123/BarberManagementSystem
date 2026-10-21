import { AlertCircle, CheckCircle2} from "lucide-react";

function PaymentAlerts({ error, success }) {
  return (
    <div className="space-y-3">
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-950/25 px-4 py-3.5 text-sm text-rose-300">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />

          <p className="flex-1">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-[#58764F]/50 bg-[#263A2A]/50 px-4 py-3.5 text-sm text-[#A8BE9F]">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#7FA46F]" />

          <p className="flex-1">{success}</p>
        </div>
      )}
    </div>
  );
}

export default PaymentAlerts;