import { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  Lock,
  ReceiptText,
  FolderKanban,
} from "lucide-react";

import { useAuthContext } from "@/contexts/AuthContext";
import { getInstallmentsByCustomer } from "@/services/installment.service";
import { getProjectsByCustomer } from "@/services/project.service";
import { startRazorpayPayment } from "@/services/payment.service";

import type {
  Installment,
  Project,
} from "@/types";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export default function CustomerPayments() {

  const { user } = useAuthContext();

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [installments, setInstallments] =
    useState<Installment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [paying, setPaying] =
    useState<string | null>(null);

  async function loadPayments() {

    if (!user?.entityId) return;

    setLoading(true);

    try {

      const [
        projectData,
        installmentData,
      ] = await Promise.all([
        getProjectsByCustomer(user.entityId),
        getInstallmentsByCustomer(user.entityId),
      ]);

      setProjects(projectData);

      setInstallments(installmentData);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    void loadPayments();

  }, [user?.entityId]);

  const groupedProjects = useMemo(() => {

    return projects.map((project) => {

      const projectInstallments =
        installments
          .filter(
            (item) =>
              item.projectId ===
              project.projectId
          )
          .sort(
            (a, b) =>
              a.sequence - b.sequence
          );

      const total =
        project.totalCost;

      const paid =
        project.paidAmount;

      const percentage =
        total === 0
          ? 0
          : Math.round(
              (paid / total) * 100
            );

      return {

        project,

        installments:
          projectInstallments,

        total,

        paid,

        remaining:
          total - paid,

        percentage,

      };

    });

  }, [projects, installments]);

  function isPayable(
    installment: Installment
  ) {

    return !installments.some(
      (item) =>
        item.projectId ===
          installment.projectId &&
        item.sequence <
          installment.sequence &&
        item.status !== "paid"
    );

  }

  async function pay(
    installment: Installment
  ) {

    if (!user) return;

    setPaying(
      installment.installmentId
    );

    try {

      await startRazorpayPayment({

        installmentId:
          installment.installmentId,

        customerName:
          user.displayName ??
          "Customer",

        email:
          user.email ?? "",

        phone:
          user.phone ?? "",

      });

      alert(
        "Payment Successful!\n\n" +
        "Your receipt will appear after approval."
      );

      await loadPayments();

    } catch (error) {

      alert(
        error instanceof Error
          ? error.message
          : "Payment failed."
      );

    } finally {

      setPaying(null);

    }

  }

  return (
  <div className="space-y-8">

    <div>

      <h1 className="text-4xl font-bold">
        Payments
      </h1>

      <p className="text-gray-400">
        Pay your project installments securely through Razorpay.
      </p>

    </div>

    {loading ? (

      <div className="py-20 text-center text-gray-400">
        Loading payment schedule...
      </div>

    ) : groupedProjects.length === 0 ? (

      <div className="rounded-2xl border border-dashed border-gray-700 p-12 text-center text-gray-400">

        No Projects Found

      </div>

    ) : (

      <div className="space-y-8">

        {groupedProjects.map(
          ({
            project,
            installments,
            total,
            paid,
            remaining,
            percentage,
          }) => (

            <div
              key={project.projectId}
              className="rounded-2xl border border-gray-700 bg-gray-900 overflow-hidden"
            >

              <div className="border-b border-gray-700 p-6">

                <div className="flex items-start justify-between">

                  <div>

                    <div className="flex items-center gap-3">

                      <FolderKanban className="h-7 w-7 text-blue-500" />

                      <div>

                        <h2 className="text-2xl font-bold">

                          {project.title}

                        </h2>

                        <p className="text-sm text-gray-400">

                          {project.projectId}

                        </p>

                      </div>

                    </div>

                    <p className="mt-3 text-gray-400">

                      Payment Plan :
                      {" "}
                      {paymentPlanLabel(
                        project.paymentPlan
                      )}

                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-sm text-gray-400">
                      Progress
                    </p>

                    <h2 className="text-3xl font-bold text-blue-400">

                      {percentage}%

                    </h2>

                  </div>

                </div>

                <div className="mt-6">

                  <div className="mb-2 flex justify-between text-sm">

                    <span>

                      Paid :
                      {" "}
                      {currency.format(paid)}

                    </span>

                    <span>

                      Remaining :
                      {" "}
                      {currency.format(remaining)}

                    </span>

                  </div>

                  <div className="h-3 rounded-full bg-gray-800">

                    <div

                      className="h-3 rounded-full bg-blue-600"

                      style={{
                        width: `${percentage}%`,
                      }}

                    />

                  </div>

                  <div className="mt-2 text-sm text-gray-400">

                    Total :
                    {" "}
                    {currency.format(total)}

                  </div>

                </div>

              </div>

              <div className="space-y-4 p-6">

                {installments.map((installment) => {

  const payable =
    installment.status === "pending" &&
    isPayable(installment);

  return (

    <div
      key={installment.installmentId}
      className="rounded-xl border border-gray-700 bg-gray-800 p-5 transition hover:border-blue-500"
    >

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h3 className="text-lg font-semibold text-white">

            Installment {installment.sequence}

            {" "}•{" "}

            {installment.percentage}%

          </h3>

          <p className="mt-1 text-gray-400">

            Due Date :

            {" "}

            {installment.dueDate ??
              "On Project Confirmation"}

          </p>

        </div>

        <div className="text-center">

          <p className="text-xs uppercase tracking-wide text-gray-500">

            Amount

          </p>

          <h2 className="text-2xl font-bold text-green-400">

            {currency.format(
              installment.amount
            )}

          </h2>

        </div>

        <div>

          {installment.status === "paid" ? (

            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">

              ✅ Paid

            </span>

          ) : payable ? (

            <button

              onClick={() => void pay(installment)}

              disabled={paying !== null}

              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"

            >

              <CreditCard className="h-5 w-5" />

              {paying === installment.installmentId

                ? "Opening Checkout..."

                : "Pay Now"}

            </button>

          ) : (

            <span className="inline-flex items-center gap-2 rounded-full bg-gray-700 px-4 py-2 text-sm text-gray-400">

              <Lock className="h-4 w-4" />

              Locked

            </span>

          )}

        </div>

      </div>

    </div>

  );

})}

     </div>

            </div>

          ))}

      </div>

    )}

    <div className="rounded-xl border border-amber-600/30 bg-amber-500/10 p-4">

      <div className="flex items-start gap-3">

        <ReceiptText className="mt-0.5 h-5 w-5 text-amber-400" />

        <div>

          <h3 className="font-semibold text-amber-300">
            Official Receipt Approval
          </h3>

          <p className="mt-1 text-sm text-amber-200">
            After your payment is verified, the AiraSpark team will review,
            digitally approve and stamp your official receipt.
            Once approved, it will automatically appear in your
            <strong> Receipts </strong>
            section for download.
          </p>

        </div>

      </div>

    </div>

    </div>
);
}

function paymentPlanLabel(
  plan: Project["paymentPlan"]
): string {

  switch (plan) {

    case "100_advance":
      return "100% Advance";

    case "50_50":
      return "50% / 50%";

    case "30_40_30":
      return "30% / 40% / 30%";

    default:
      return "Custom";

  }

}