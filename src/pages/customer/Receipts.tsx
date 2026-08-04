import { useEffect, useMemo, useState } from "react";
import {
  FolderKanban,
  ReceiptText,
  Download,
  Eye,
  Lock,
  Loader2,
} from "lucide-react";

import { useAuthContext } from "@/contexts/AuthContext";

import {
  getProjectsByCustomer,
} from "@/services/project.service";

import {
  getInstallmentsByCustomer,
} from "@/services/installment.service";

import {
  getReceiptsByCustomer,
} from "@/services/receipt.service";

import type {
  Project,
  Installment,
  Receipt,
} from "@/types";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

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

export default function CustomerReceipts() {
  const { user } = useAuthContext();

  const [loading, setLoading] =
    useState(true);

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [installments, setInstallments] =
    useState<Installment[]>([]);

  const [receipts, setReceipts] =
    useState<Receipt[]>([]);

  const [selectedReceipt, setSelectedReceipt] =
    useState<Receipt | null>(null);

  async function loadData() {
    if (!user?.entityId) {
      setLoading(false);
      return;
    }
    

    try {
      setLoading(true);

      const projectData = await getProjectsByCustomer(user.entityId);

const installmentData = await getInstallmentsByCustomer(
  user.entityId
);

let receiptData: Receipt[] = [];

try {
  receiptData = await getReceiptsByCustomer(user.entityId);
} catch (err) {
  console.warn("Receipts could not be loaded:", err);
}

console.log("User ID:", user.entityId);
console.log("Projects:", projectData);
console.log("Installments:", installmentData);
console.log("Receipts:", receiptData);

installmentData.forEach((installment) => {
  const receiptMatch = receiptData.find(
    (receipt) => receipt.installmentId === installment.installmentId
  );

  console.log("Installment match check:", {
    installmentId: installment.installmentId,
    receiptInstallmentId: receiptMatch?.installmentId,
    receiptId: receiptMatch?.receiptId,
    pdfUrl: receiptMatch?.pdfUrl,
    customerId: receiptMatch?.customerId,
    projectId: receiptMatch?.projectId,
  });
});

setProjects(projectData);
setInstallments(installmentData);
setReceipts(receiptData);

    } catch (error) {
      console.error("Failed to load receipts:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, [user?.entityId]);

  const groupedProjects = useMemo(() => {
    return projects.map((project) => {
      const projectInstallments = installments
        .filter(
          (item) =>
            item.projectId === project.projectId
        )
        .sort(
          (a, b) =>
            a.sequence - b.sequence
        );

      return {
        project,
        installments: projectInstallments,
        total: project.totalCost,
        paid: project.paidAmount,
        remaining:
          project.totalCost -
          project.paidAmount,
        percentage:
          project.totalCost === 0
            ? 0
            : Math.round(
                (project.paidAmount /
                  project.totalCost) *
                  100
              ),
      };
    });
  }, [projects, installments]);

  function getReceipt(
    installmentId: string
  ) {
    return receipts.find(
      (receipt) =>
        receipt.installmentId ===
        installmentId
    );
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">

            <div>
        <h1 className="text-4xl font-bold">
          Project Receipts
        </h1>

        <p className="text-gray-400">
          View receipts for each installment of your projects.
        </p>
      </div>

      {groupedProjects.length === 0 ? (

        <div className="rounded-3xl border border-dashed border-gray-700 py-20 text-center">

          <h2 className="text-2xl font-bold">
            No Projects Found
          </h2>

          <p className="mt-2 text-gray-400">
            You don't have any active projects.
          </p>

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
                key={project.id}
                className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-900"
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

                        Payment Plan :{" "}

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
                        Paid :{" "}
                        {currency.format(paid)}
                      </span>

                      <span>
                        Remaining :{" "}
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

                      Total :{" "}

                      {currency.format(total)}

                    </div>

                  </div>

                </div>

                <div className="space-y-4 p-6">
{installments.map((installment) => {
  const receipt = getReceipt(installment.installmentId);
  console.log("INSTALLMENT ID:", installment.installmentId);

console.log("MATCHED RECEIPT:", receipt);

console.log("ALL RECEIPTS:", receipts);

  const receiptPdfAvailable = Boolean(receipt?.pdfUrl);

  return (
    <div
      key={installment.installmentId}
      className="rounded-xl border border-gray-700 bg-gray-800 p-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Installment {installment.sequence} • {installment.percentage}%
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            {currency.format(installment.amount)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          {installment.status === "paid" ? (
            <>
              <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
                ✅ Paid
              </span>

              {receiptPdfAvailable ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => receipt && setSelectedReceipt(receipt)}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <Eye className="h-4 w-4" />
                    View Receipt
                  </button>

                  <button
                    disabled={!receiptPdfAvailable}
                    onClick={() => {
                      if (!receipt?.pdfUrl) return;
                      window.open(receipt.pdfUrl, "_blank");
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-600 px-4 py-2 text-sm font-semibold hover:bg-gray-700 disabled:opacity-50"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              ) : (
                <span className="text-sm text-yellow-400">
                  Receipt Pending Approval
                </span>
              )}
            </>
          ) : installment.locked ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-700 px-4 py-2 text-sm text-gray-400">
              <Lock className="h-4 w-4" />
              Locked
            </span>
          ) : (
            <span className="rounded-full bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-400">
              ⏳ Pending Payment
            </span>
          )}
        </div>
      </div>
    </div>
  );
})}
                </div>

              </div>

            )
          )}

        </div>

      )}

            {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

          <div className="w-full max-w-2xl rounded-2xl border border-gray-700 bg-gray-900">

            <div className="flex items-center justify-between border-b border-gray-700 p-6">

              <div>

                <h2 className="text-2xl font-bold">
                  Receipt Details
                </h2>

                <p className="text-gray-400">
                  {selectedReceipt.receiptNumber}
                </p>

              </div>

              <button
                onClick={() => setSelectedReceipt(null)}
                className="rounded-lg px-3 py-2 hover:bg-gray-800"
              >
                ✕
              </button>

            </div>

            <div className="space-y-5 p-6">

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <p className="text-sm text-gray-400">
                    Receipt Number
                  </p>

                  <p className="font-semibold">
                    {selectedReceipt.receiptNumber}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Project
                  </p>

                  <p className="font-semibold">
                    {selectedReceipt.projectName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Customer
                  </p>

                  <p className="font-semibold">
                    {selectedReceipt.customerName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Amount Paid
                  </p>

                  <p className="text-xl font-bold text-emerald-400">
                    {currency.format(selectedReceipt.amount)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Payment Method
                  </p>

                  <p className="font-semibold">
                    {selectedReceipt.paymentMethod ??
                      "Online Payment"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Razorpay Payment ID
                  </p>

                  <p className="break-all font-mono text-sm">
                    {selectedReceipt.razorpayPaymentId}
                  </p>
                </div>

              </div>

              <div className="rounded-xl bg-emerald-500/10 p-4">

                <div className="flex items-center gap-3">

                  <ReceiptText className="h-6 w-6 text-emerald-400" />

                  <div>

                    <p className="font-semibold text-emerald-400">
                      Payment Verified
                    </p>

                    <p className="text-sm text-gray-300">
                      This payment has been verified successfully by AiraSpark.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            <div className="flex justify-end gap-3 border-t border-gray-700 p-6">

              <button
                disabled={!selectedReceipt.pdfUrl}
                onClick={() => {
                  if (!selectedReceipt.pdfUrl) return;

                  const link =
                    document.createElement("a");

                  link.href =
                    selectedReceipt.pdfUrl;

                  link.download =
                    `${selectedReceipt.receiptNumber}.pdf`;

                  link.click();
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-600 px-5 py-3 hover:bg-gray-800 disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>

              <button
                onClick={() =>
                  setSelectedReceipt(null)
                }
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
