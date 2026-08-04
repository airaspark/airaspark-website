import { storage } from "../firebaseAdmin.js";
import { v4 as uuidv4 } from "uuid";

/* ======================================================
   Upload Invoice PDF
====================================================== */

export async function uploadInvoicePDF(pdfBuffer, invoiceNumber) {
  const bucket = storage.bucket();

  const storagePath = `invoices/${invoiceNumber}.pdf`;

  const file = bucket.file(storagePath);

  const token = uuidv4();

  await file.save(pdfBuffer, {
    metadata: {
      contentType: "application/pdf",
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
    resumable: false,
  });

  const downloadUrl =
    `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
      storagePath
    )}?alt=media&token=${token}`;

  return {
    storagePath,
    downloadUrl,
  };
}

/* ======================================================
   Upload Receipt PDF
====================================================== */

export async function uploadReceiptPdf(
  receiptId,
  pdfBuffer
) {
  const bucket = storage.bucket();

  const storagePath = `receipts/${receiptId}.pdf`;

  const file = bucket.file(storagePath);

  const token = uuidv4();

  await file.save(pdfBuffer, {
    metadata: {
      contentType: "application/pdf",
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
    resumable: false,
  });

  const downloadUrl =
    `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
      storagePath
    )}?alt=media&token=${token}`;

  return {
    storagePath,
    downloadUrl,
  };
}

/* ======================================================
   Delete Receipt PDF
====================================================== */

export async function deleteReceiptPdf(
  storagePath
) {
  const bucket = storage.bucket();

  const file = bucket.file(storagePath);

  const exists = await file.exists();

  if (exists[0]) {
    await file.delete();
  }
}