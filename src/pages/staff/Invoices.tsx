import { useEffect, useState } from "react";
import {
  getStaffInvoices,
  type StaffInvoice,
} from "@/services/staffInvoice.service";

export default function Invoices() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [invoices, setInvoices] = useState<StaffInvoice[]>([]);

  async function loadInvoices(keyword = "") {
    try {
      setLoading(true);

      const data = await getStaffInvoices(keyword);

      setInvoices(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load invoices.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadInvoices(search);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  }

  function formatDate(date: any) {
    if (!date) return "-";

    let jsDate: Date;

    if (typeof date?.toDate === "function") {
      jsDate = date.toDate();
    } else if (typeof date?._seconds === "number") {
      jsDate = new Date(date._seconds * 1000);
    } else if (date instanceof Date) {
      jsDate = date;
    } else {
      jsDate = new Date(date);
    }

    if (isNaN(jsDate.getTime())) {
      return "-";
    }

    return jsDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function openPdf(url: string | null) {
    if (!url) {
      alert("PDF not available.");
      return;
    }

    window.open(url, "_blank");
  }

  function downloadPdf(url: string | null, invoiceNumber: string) {
    if (!url) {
      alert("PDF not available.");
      return;
    }

    const link = document.createElement("a");

    link.href = url;
    link.download = `${invoiceNumber}.pdf`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">
        Staff Invoices
      </h1>

      {/* Search */}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Invoice No, Customer, Project, Payment ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p className="text-gray-400">
          Loading invoices...
        </p>
      ) : invoices.length === 0 ? (
        <p className="text-gray-400">
          No invoices found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-700 rounded-lg">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-3 text-left">Invoice No</th>
                <th className="p-3 text-left">Customer ID</th>
                <th className="p-3 text-left">Customer Name</th>
                <th className="p-3 text-left">Project</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-left">Payment</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-t border-gray-700 hover:bg-gray-800"
                >
                  <td className="p-3 font-medium text-blue-400">
                    {invoice.invoiceNumber}
                  </td>

                  <td className="p-3">
                    {invoice.customerId}
                  </td>

                  <td className="p-3">
                    {invoice.customerName}
                  </td>

                  <td className="p-3">
                    {invoice.projectName}
                  </td>

                  <td className="p-3 text-right font-semibold">
                    {formatCurrency(invoice.amount)}
                  </td>

                  <td className="p-3">
                    {invoice.paymentMethod ?? "-"}
                  </td>

                  <td className="p-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        invoice.status?.toLowerCase() === "paid"
                          ? "bg-green-600 text-white"
                          : invoice.status?.toLowerCase() === "pending"
                          ? "bg-yellow-500 text-black"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>

                  <td className="p-3">
                    {formatDate(invoice.paymentDate)}
                  </td>

                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openPdf(invoice.pdfUrl)}
                        className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          downloadPdf(
                            invoice.pdfUrl,
                            invoice.invoiceNumber
                          )
                        }
                        className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
                      >
                        Download
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
  );
}