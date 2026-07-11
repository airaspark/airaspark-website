import { CreditCard } from "lucide-react";

export default function CustomerPayments() {
  return (
    <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6">

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Payments</h2>

        <button className="rounded-lg border border-gray-700 px-3 py-1 text-sm hover:bg-gray-800">
          View All
        </button>
      </div>

      <div className="space-y-4">

        <div className="rounded-xl border border-gray-700 p-4">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="rounded-lg bg-green-600 p-3">
                <CreditCard size={18} />
              </div>

              <div>
                <h3 className="font-semibold">
                  Payment #PAY-001
                </h3>

                <p className="text-sm text-gray-400">
                  5 Jul 2026
                </p>
              </div>

            </div>

            <div className="text-right">

              <span className="rounded bg-green-600/20 px-2 py-1 text-xs text-green-400">
                Paid
              </span>

              <p className="mt-2 text-lg font-bold">
                ₹15,000
              </p>

            </div>

          </div>

        </div>

        <div className="rounded-xl border border-gray-700 p-4">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="rounded-lg bg-yellow-600 p-3">
                <CreditCard size={18} />
              </div>

              <div>
                <h3 className="font-semibold">
                  Payment #PAY-002
                </h3>

                <p className="text-sm text-gray-400">
                  Pending
                </p>
              </div>

            </div>

            <div className="text-right">

              <span className="rounded bg-yellow-600/20 px-2 py-1 text-xs text-yellow-400">
                Pending
              </span>

              <p className="mt-2 text-lg font-bold">
                ₹25,000
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}