import { useEffect, useState } from "react";
import {
  Calendar,
  Download,
  ExternalLink,
  FileText,
  IndianRupee,
} from "lucide-react";

import {
  getInvoicesByCustomer,
  type Invoice,
} from "@/services/invoice.service";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export default function CustomerInvoices() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  async function loadInvoices() {
    setLoading(true);

    try {
      const data = await getInvoicesByCustomer();
      setInvoices(data);
    } catch (error) {
      console.error("Failed to load invoices:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadInvoices();
  }, []);


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

function getTime(date: any) {
  if (!date) return 0;

  if (typeof date?.toDate === "function") {
    return date.toDate().getTime();
  }

  if (typeof date?._seconds === "number") {
    return date._seconds * 1000;
  }

  return new Date(date).getTime();
}


  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Invoices</h1>

          <p className="text-gray-400">
            Loading your invoices...
          </p>
        </div>

        <div className="rounded-2xl border border-gray-700 bg-gray-900 p-12 text-center text-gray-400">
          Loading invoices...
        </div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Invoices</h1>

          <p className="text-gray-400">
            Download your payment invoices.
          </p>
        </div>

        <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-900 p-16 text-center">
          <FileText className="mx-auto h-16 w-16 text-gray-600" />

          <h2 className="mt-6 text-2xl font-semibold">
            No invoices yet
          </h2>

          <p className="mt-2 text-gray-400">
            Your invoices will automatically appear
            here after successful payments.
          </p>
        </div>
      </div>
    );
  }

  return (
  <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-4xl font-bold">Invoices</h1>
        <p className="text-gray-400">
          Download your payment invoices.
        </p>
      </div>

      <div className="rounded-xl border border-gray-700 bg-gray-900 px-5 py-3">
        <p className="text-sm text-gray-400">Total Invoices</p>
        <p className="text-2xl font-bold">{invoices.length}</p>
      </div>
    </div>

    <div className="space-y-4">
      {[...invoices]
       .sort(
  (a, b) => getTime(b.paymentDate) - getTime(a.paymentDate)
)
        .map((invoice) => (
          <div
            key={invoice.id}
            className="rounded-2xl border border-gray-700 bg-gray-900 p-6"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">
                    Invoice Number
                  </p>

                  <h2 className="text-xl font-semibold">
                    {invoice.invoiceNumber}
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-400" />

                    <div>
                      <p className="text-xs text-gray-500">
                        Project
                      </p>

                      <p>{invoice.projectName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <IndianRupee className="h-5 w-5 text-emerald-400" />

                    <div>
                      <p className="text-xs text-gray-500">
                        Amount
                      </p>

                      <p className="font-semibold">
                        {currency.format(invoice.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-amber-400" />

                    <div>
                      <p className="text-xs text-gray-500">
                        Payment Date
                      </p>

                      <p>{formatDate(invoice.paymentDate)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Payment Method
                    </p>

                    <p className="capitalize">
                      {invoice.paymentMethod ?? "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start gap-4 lg:items-end">
                <span
                  className={`rounded-full px-4 py-1 text-sm font-medium ${
                    invoice.status === "paid"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {invoice.status.toUpperCase()}
                </span>

                <div className="flex gap-3">
                  <button
                    disabled={!invoice.pdfUrl}
                    onClick={() => {
                      if (invoice.pdfUrl) {
                        window.open(invoice.pdfUrl, "_blank");
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View
                  </button>

                  <a
                    href={invoice.pdfUrl ?? "#"}
                    download
                    onClick={(e) => {
                      if (!invoice.pdfUrl) {
                        e.preventDefault();
                      }
                    }}
                    className={`inline-flex items-center gap-2 rounded-xl border border-gray-700 px-4 py-2 text-sm font-semibold ${
                      invoice.pdfUrl
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "cursor-not-allowed bg-gray-900 opacity-50"
                    }`}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  </div>
);
}
