import { auth } from "@/firebase";

async function authorizationHeader(): Promise<string> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in.");
  }

  return `Bearer ${await user.getIdToken()}`;
}

export interface AdminInvoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  projectName: string;
  amount: number;
  paymentMethod: string | null;
  paymentDate: string;
  paymentId: string;
  status: string;
  pdfUrl: string | null;
}

export interface InvoiceSummary {
  totalInvoices: number;
  totalRevenue: number;
  paidInvoices: number;
  todayInvoices: number;
}

export interface AdminInvoiceResponse {
  summary: InvoiceSummary;
  invoices: AdminInvoice[];
}

export async function getAllInvoices(
  search = ""
): Promise<AdminInvoiceResponse> {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set("search", search.trim());
  }

  const response = await fetch(
    `/api/admin/invoices?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: await authorizationHeader(),
      },
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message ?? "Unable to load invoices.");
  }

  return {
    summary: data.summary,
    invoices: data.invoices,
  };
}

export async function getInvoicesByCustomer(
  customerId: string
): Promise<AdminInvoice[]> {
  const all = await getAllInvoices();
  return all.invoices.filter(
    (invoice) => invoice.customerId === customerId
  );
}