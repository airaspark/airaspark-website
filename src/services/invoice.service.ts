import { auth } from "@/firebase";

async function authorizationHeader(): Promise<string> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in.");
  }

  return `Bearer ${await user.getIdToken()}`;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  projectName: string;
  customerName: string;
  amount: number;
  paymentMethod: string | null;
  paymentDate: string;
  status: string;
  pdfUrl: string | null;
}

export async function getInvoicesByCustomer(): Promise<Invoice[]> {
  const response = await fetch("/api/payments/invoices", {
    method: "GET",
    headers: {
      Authorization: await authorizationHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message ?? "Unable to load invoices.");
  }

  return data.invoices;
}