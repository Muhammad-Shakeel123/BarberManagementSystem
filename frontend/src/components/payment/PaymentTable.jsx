import {
  Eye,
  CreditCard,
  Users,
  CircleDollarSign,
  CheckCircle2,
} from "lucide-react";

import PaymentStatusBadge from "@/components/payment/PaymentStatusBadge";

function PaymentTable({
  payments,
  onViewPayment,
  formatDate,
  formatAmount,
}) {
  const totalAmount = payments.reduce(
    (total, payment) => total + Number(payment?.amount || 0),
    0,
  );

  const paidCount = payments.filter(
    (payment) => payment?.status === "paid",
  ).length;

  return (
    <div className="overflow-hidden rounded-3xl border border-[#2B3A4E] bg-[#172132] shadow-xl shadow-black/10">
      {/* Top section */}
      <div className="border-b border-[#2B3A4E] px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="size-5 text-[#8FA985]" />

              <h2 className="text-lg font-bold text-white">
                Payment Activity
              </h2>
            </div>

            <p className="mt-1 text-xs text-[#64748B]">
              Customer transactions and payment status
            </p>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-[#33445A] bg-[#111B2B]">
            <div className="min-w-[100px] border-r border-[#33445A] px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <Users className="size-3.5 text-[#7F91A9]" />

                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  Transactions
                </p>
              </div>

              <p className="mt-1 text-sm font-bold text-white">
                {payments.length}
              </p>
            </div>

            <div className="min-w-[100px] border-r border-[#33445A] px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-[#7FA46F]" />

                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  Paid
                </p>
              </div>

              <p className="mt-1 text-sm font-bold text-[#A8BE9F]">
                {paidCount}
              </p>
            </div>

            <div className="min-w-[120px] px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <CircleDollarSign className="size-3.5 text-[#8FA985]" />

                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  Volume
                </p>
              </div>

              <p className="mt-1 text-sm font-bold text-white">
                {formatAmount(totalAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty */}
      {payments.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#33445A] bg-[#111B2B]">
            <CreditCard className="size-6 text-[#64748B]" />
          </div>

          <p className="mt-4 text-sm font-semibold text-[#CAD5E2]">
            No payments found
          </p>

          <p className="mt-1 text-xs text-[#64748B]">
            Payment transactions will appear here once available.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead className="border-b border-[#2B3A4E] bg-[#111B2B]">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  Customer
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  Amount
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  Method
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  Date
                </th>

                <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#263548]">
              {payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="group transition hover:bg-[#1C293B]"
                >
                  {/* Customer */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#485F4D] bg-[#263A2A] text-xs font-bold text-[#A8BE9F]">
                        {(payment.customerId?.name || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {payment.customerId?.name || "Unknown customer"}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-[#64748B]">
                          {payment.customerId?.email || "-"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-white">
                      {formatAmount(payment.amount)}
                    </p>

                    {payment.depositAmount != null && (
                      <p className="mt-0.5 text-[11px] text-[#64748B]">
                        Deposit {formatAmount(payment.depositAmount)}
                      </p>
                    )}
                  </td>

                  {/* Method */}
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-2 text-sm text-[#AAB7C8]">
                      <CreditCard className="size-3.5 text-[#64748B]" />

                      <span className="capitalize">
                        {payment.paymentMethod || "-"}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <PaymentStatusBadge status={payment.status} />
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#AAB7C8]">
                      {formatDate(payment.createdAt)}
                    </p>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onViewPayment(payment._id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#33445A] bg-[#111B2B] px-3.5 py-2 text-xs font-bold text-[#CAD5E2] transition hover:border-[#58764F] hover:bg-[#263A2A] hover:text-white active:scale-95"
                    >
                      <Eye className="size-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      {payments.length > 0 && (
        <div className="flex items-center justify-between border-t border-[#2B3A4E] bg-[#111B2B] px-5 py-3.5 sm:px-6">
          <p className="text-xs text-[#64748B]">
            Showing{" "}
            <span className="font-semibold text-[#AAB7C8]">
              {payments.length}
            </span>{" "}
            payment transaction{payments.length !== 1 ? "s" : ""}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <span className="size-1.5 rounded-full bg-[#6B8C5E]" />
            Payment system operational
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentTable;