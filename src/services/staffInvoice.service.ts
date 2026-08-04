import { auth } from "@/firebase";

async function authorizationHeader(): Promise<string> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in.");
  }

  return `Bearer ${await user.getIdToken()}`;
}

export interface StaffInvoice {
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

export async function getStaffInvoices(
  search = ""
): Promise<StaffInvoice[]> {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set("search", search.trim());
  }

  const response = await fetch(
    `/api/staff/invoices?${params.toString()}`,
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

  return data.invoices;
}