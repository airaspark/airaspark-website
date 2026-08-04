import {
  Receipt,
  IndianRupee,
  CalendarDays,
  Search,
  
} from "lucide-react";


import { useEffect, useState, useRef } from "react";
import {
  getReceipts,
  type AdminReceipt,
  type ReceiptSummary,
} from "@/services/admin-receipt.service";

import {
  uploadReceiptPdf,
  deleteReceiptPdf,
} from "@/services/receiptFiles.service";

interface ReceiptsProps {
  role?: "admin" | "staff";
}

interface ReceiptManagerProps {
  role?: "admin" | "staff";
}

export default function ReceiptManager({
  role = "admin",
}: ReceiptManagerProps) {
  return <Receipts role={role} />;
}

export function Receipts({
  role = "admin",
}:
ReceiptsProps) {
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [summary, setSummary] =
    useState<ReceiptSummary>({
      totalReceipts: 0,
      totalRevenue: 0,
      paidReceipts: 0,
      todayReceipts: 0,
    });

  const [receipts, setReceipts] = useState<
    AdminReceipt[]
  >([]);

  const [uploadingId, setUploadingId] =
  useState<string | null>(null);

const [selectedReceiptId, setSelectedReceiptId] =
  useState<string | null>(null);

const fileInputRef =
  useRef<HTMLInputElement>(null);

  async function loadReceipts(keyword = "") {
    try {
      setLoading(true);

      const data = await getReceipts(role, keyword);

      if (data.summary) {
  setSummary(data.summary);
}

setReceipts(data.receipts);
    } catch (error) {
      console.error(error);

      alert("Failed to load receipts.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(
  receiptId: string,
  file: File
) {
  try {
    setUploadingId(receiptId);

    await uploadReceiptPdf(receiptId, file);

    await loadReceipts(search);

    alert("Receipt uploaded successfully.");
  } catch (error) {
    console.error(error);

    alert("Failed to upload receipt.");
  } finally {
    setUploadingId(null);
  }
}

async function handleDelete(
  receiptId: string
) {
  const confirmed = window.confirm(
    "Delete this receipt PDF?"
  );

  if (!confirmed) return;

  try {
    await deleteReceiptPdf(receiptId);

    await loadReceipts(search);

    alert("Receipt deleted.");
  } catch (error) {
    console.error(error);

    alert("Failed to delete receipt.");
  }
}

function viewPdf(url: string | null) {
  if (!url) return;

  window.open(url, "_blank");
}

function downloadPdf(url: string | null) {
  if (!url) return;

  const a = document.createElement("a");

  a.href = url;

  a.target = "_blank";

  a.click();
}

  useEffect(() => {
    loadReceipts();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadReceipts(search);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-bold text-white">
          Receipt Management
        </h1>

        <p className="mt-2 text-gray-400">
          Upload, manage and download customer receipt PDFs.
        </p>

      </div>

      {/* Summary */}
      {role === "admin" && (
      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-400">
                Total Receipts
              </p>

              <h2 className="mt-3 text-4xl font-bold text-white">
                {summary.totalReceipts}
              </h2>

            </div>

            <div className="rounded-xl bg-blue-600/20 p-4">

              <Receipt className="h-8 w-8 text-blue-500" />

            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-400">
                Revenue
              </p>

              <h2 className="mt-3 text-4xl font-bold text-green-400">
                ₹{summary.totalRevenue.toLocaleString("en-IN")}
              </h2>

            </div>

            <div className="rounded-xl bg-green-600/20 p-4">

              <IndianRupee className="h-8 w-8 text-green-400" />

            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-400">
                Today's Receipts
              </p>

              <h2 className="mt-3 text-4xl font-bold text-cyan-400">
                {summary.todayReceipts}
              </h2>

            </div>

            <div className="rounded-xl bg-cyan-600/20 p-4">

              <CalendarDays className="h-8 w-8 text-cyan-400" />

            </div>

          </div>

        </div>

      </div>
)}
      {/* Search */}

      <div className="rounded-2xl border border-gray-700 bg-gray-800 p-5">

        <div className="relative">

          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search Receipt Number, Customer, Project..."
            className="w-full rounded-xl border border-gray-700 bg-gray-900 py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />

        </div>

      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800">

        <table className="min-w-full">

          <thead className="bg-gray-900">

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                Receipt
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                Customer
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                Project
              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                Amount
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                Date
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                PDF
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan={7}
                  className="py-20 text-center text-gray-400"
                >
                  Loading receipts...
                </td>

              </tr>

            ) : receipts.length === 0 ? (

              <tr>

                <td
                  colSpan={7}
                  className="py-20 text-center"
                >

                  <Receipt className="mx-auto mb-4 h-14 w-14 text-gray-600" />

                  <h3 className="text-xl font-semibold text-white">
                    No Receipts Available
                  </h3>

                  <p className="mt-2 text-gray-400">
                    Customer receipts will appear here after successful payments.
                  </p>

                </td>

              </tr>

            ) : (

              receipts.map((receipt) => (

                <tr
                  key={receipt.id}
                  className="border-t border-gray-700 hover:bg-gray-900"
                >

                  <td className="px-6 py-4 text-blue-400 font-semibold">
                    {receipt.receiptNumber}
                  </td>

                  <td className="px-6 py-4 text-white">
                    {receipt.customerName}
                  </td>

                  <td className="px-6 py-4 text-gray-300">
                    {receipt.projectName}
                  </td>

                  <td className="px-6 py-4 text-right text-green-400 font-semibold">
                    ₹{receipt.amount.toLocaleString("en-IN")}
                  </td>

                 <td className="px-6 py-4 text-gray-300">
  {(() => {
    let date: Date | null = null;

    if (receipt.paymentDate?.seconds) {
      date = new Date(receipt.paymentDate.seconds * 1000);
    } else if (receipt.paymentDate?._seconds) {
      date = new Date(receipt.paymentDate._seconds * 1000);
    } else if (receipt.paymentDate?.toDate) {
      date = receipt.paymentDate.toDate();
    } else if (receipt.paymentDate) {
      date = new Date(receipt.paymentDate);
    }

    return date
      ? date.toLocaleDateString("en-IN")
      : "-";
  })()}
</td>

                  <td className="px-6 py-4 text-center">

                    {receipt.pdfUrl ? (
                      <span className="rounded-full bg-green-600 px-3 py-1 text-xs text-white">
                        Uploaded
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-600 px-3 py-1 text-xs text-white">
                        Missing
                      </span>
                    )}

                  </td>

                 <td className="px-6 py-4 text-center">

  <div className="flex justify-center gap-2">

    {!receipt.pdfUrl ? (

      <>
        <>
  <button
    onClick={() => {
  setSelectedReceiptId(receipt.id);
  fileInputRef.current?.click();
}}
    disabled={uploadingId === receipt.id}
    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
  >
    {uploadingId === receipt.id ? "Uploading..." : "Upload PDF"}
  </button>

  <input
  ref={fileInputRef}
  type="file"
  accept="application/pdf"
  className="hidden"
  onChange={(e) => {
    const file = e.target.files?.[0];

    if (
      file &&
      selectedReceiptId
    ) {
      handleUpload(
        selectedReceiptId,
        file
      );
    }

    e.target.value = "";
  }}
/>
</>
      </>

    ) : (

      <>
       <button
  onClick={() => viewPdf(receipt.pdfUrl)}
  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
>
  View
</button>

       <button
  onClick={() => downloadPdf(receipt.pdfUrl)}
  className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
>
  Download
</button>

        <button
  onClick={() => handleDelete(receipt.id)}
  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
>
  Delete
</button>
      </>

    )}

  </div>

</td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}