import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/firebase";
import { timestampToIso } from "@/services/idGenerator.service";
import { COLLECTIONS } from "@/utils/constants";
import type { Receipt } from "@/types";

/* ==========================================================
   FIRESTORE RECEIPT MAPPER
========================================================== */

function mapReceipt(id: string, data: any): Receipt {
  return {
    id,

    receiptId: data.receiptId,
    receiptNumber: data.receiptNumber,

    installmentId: data.installmentId ?? "",

    invoiceNumber: data.invoiceNumber ?? "",

    paymentId: data.paymentId,
    projectId: data.projectId,
    customerId: data.customerId,

    customerName: data.customerName,
    projectName: data.projectName,

    amount: data.amount,

    paymentMethod: data.paymentMethod ?? null,

    razorpayPaymentId: data.razorpayPaymentId,

    paymentDate: data.paymentDate,

   
    pdfUrl: data.pdfUrl ?? null,

    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
  };
}

/* ==========================================================
   FIRESTORE VERSION
========================================================== */

export async function getReceiptsByCustomerFirestore(
  customerId: string
): Promise<Receipt[]> {
  console.log("Fetching receipts for customerId:", customerId);

  const snapshot = await getDocs(
    query(
      collection(db, COLLECTIONS.receipts),
      where("customerId", "==", customerId),
      orderBy("paymentDate", "desc")
    )
  );

  const receipts = snapshot.docs.map((item) => {
    const receipt = mapReceipt(item.id, item.data());
    console.log("Loaded receipt:", {
      id: item.id,
      receiptId: receipt.receiptId,
      installmentId: receipt.installmentId,
      customerId: receipt.customerId,
      projectId: receipt.projectId,
      pdfUrl: receipt.pdfUrl,
      approved: item.data().approved,
    });
    return receipt;
  });

  return receipts;
}

/* ==========================================================
   BACKEND API VERSION
========================================================== */

export async function getReceiptsByCustomer(
  customerId: string
): Promise<Receipt[]> {
  if (!customerId) {
    return [];
  }

  return getReceiptsByCustomerFirestore(customerId);
}