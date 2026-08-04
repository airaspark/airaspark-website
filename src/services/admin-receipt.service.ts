import { auth } from "@/firebase";

async function authorizationHeader(): Promise<string> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in.");
  }

  return `Bearer ${await user.getIdToken()}`;
}

export interface ReceiptSummary {
  totalReceipts: number;
  totalRevenue: number;
  paidReceipts: number;
  todayReceipts: number;
}

export interface AdminReceipt {
  id: string;

  receiptNumber: string;
  invoiceNumber?: string;

  paymentId: string;

  customerId: string;
  customerName: string;

  projectName: string;

  amount: number;

  paymentMethod: string | null;

  paymentDate: any;

  pdfUrl: string | null;
}

export async function getReceipts(
  role: "admin" | "staff",
  search = ""
): Promise<{
  receipts: AdminReceipt[];
  summary?: ReceiptSummary;
}> {
  const endpoint =
    role === "admin"
      ? "/api/admin/receipts"
      : "/api/admin/receipts/staff";

  const response = await fetch(
    `${endpoint}?search=${encodeURIComponent(search)}`,
    {
      method: "GET",
      headers: {
        Authorization: await authorizationHeader(),
      },
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ?? "Unable to load receipts."
    );
  }

  return data;
}