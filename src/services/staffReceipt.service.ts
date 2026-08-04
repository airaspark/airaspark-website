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
  todayReceipts: number;
}

export interface StaffReceipt {
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

export async function getStaffReceipts(
  search = ""
): Promise<{
  receipts: StaffReceipt[];
  summary: ReceiptSummary;
}> {
  const response = await fetch(
    `/api/staff/receipts?search=${encodeURIComponent(search)}`,
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

  return {
    receipts: data.receipts,
    summary: data.summary,
  };
}