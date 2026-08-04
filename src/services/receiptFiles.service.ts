import { auth } from "@/firebase";

async function authorizationHeader(): Promise<string> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in.");
  }

  return `Bearer ${await user.getIdToken()}`;
}

/* ==========================================================
   Upload Receipt PDF
========================================================== */

export async function uploadReceiptPdf(
  receiptId: string,
  file: File
): Promise<string> {
  const formData = new FormData();

  formData.append("pdf", file);

  const response = await fetch(
    `/api/receipt-files/${receiptId}/upload`,
    {
      method: "POST",
      headers: {
        Authorization: await authorizationHeader(),
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ?? "Failed to upload receipt."
    );
  }

  return data.pdfUrl;
}

/* ==========================================================
   Delete Receipt PDF
========================================================== */

export async function deleteReceiptPdf(
  receiptId: string
): Promise<void> {
  const response = await fetch(
    `/api/receipt-files/${receiptId}/pdf`,
    {
      method: "DELETE",
      headers: {
        Authorization: await authorizationHeader(),
      },
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ?? "Failed to delete receipt."
    );
  }
}