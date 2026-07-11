import {
  runTransaction,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/firebase";
import { COLLECTIONS } from "@/utils/constants";
import type { IdCounter, IdPrefix } from "@/types";

const COUNTER_FIELD_MAP: Record<keyof IdCounter, IdPrefix> = {
  admin: "ADM",
  staff: "STF",
  customer: "ASC",
  project: "PR",
  invoice: "INV",
  payment: "PAY",
  review: "REV",
};

function formatId(
  prefix: IdPrefix,
  year: number,
  sequence: number
): string {
  return `${prefix}-${year}-${String(sequence).padStart(3, "0")}`;
}

function getCounterKey(
  type: keyof IdCounter
): keyof IdCounter {
  return type;
}

export async function generateId(
  type: keyof IdCounter,
  year: number = new Date().getFullYear()
): Promise<string> {
  const counterRef = doc(
    db,
    COLLECTIONS.counters,
    String(year)
  );

  const prefix = COUNTER_FIELD_MAP[type];

  const generatedId = await runTransaction(
    db,
    async (transaction) => {
      const counterSnap = await transaction.get(counterRef);

      let counters: IdCounter;

      if (counterSnap.exists()) {
        counters = counterSnap.data() as IdCounter;
      } else {
        counters = {
          admin: 0,
          staff: 0,
          customer: 0,
          project: 0,
          invoice: 0,
          payment: 0,
          review: 0,
        };
      }

      const field = getCounterKey(type);

      const nextValue = (counters[field] ?? 0) + 1;

      counters[field] = nextValue;

      transaction.set(counterRef, counters, {
        merge: true,
      });

      return formatId(prefix, year, nextValue);
    }
  );

  return generatedId;
}

/* ==========================================================
   CUSTOMER
========================================================== */

export async function generateCustomerId() {
  return generateId("customer");
}

/* ==========================================================
   STAFF
========================================================== */

export async function generateStaffId() {
  return generateId("staff");
}

/* ==========================================================
   PROJECT
   Example:
   ASP-PR-2026-001-ASC-2026-001
========================================================== */

export async function generateProjectId(
  customerId: string
): Promise<string> {
  const projectCode = await generateId("project");

  return `ASP-${projectCode}-${customerId}`;
}

/* ==========================================================
   INVOICE
========================================================== */

export async function generateInvoiceId(
  customerId: string
): Promise<string> {
  const invoiceCode = await generateId("invoice");

  return `ASP-${invoiceCode}-${customerId}`;
}

/* ==========================================================
   PAYMENT
========================================================== */

export async function generatePaymentId(
  customerId: string
): Promise<string> {
  const paymentCode = await generateId("payment");

  return `ASP-${paymentCode}-${customerId}`;
}

/* ==========================================================
   DOCUMENT
========================================================== */

export async function generateDocumentId(
  customerId: string
): Promise<string> {
  const documentCode = await generateId("invoice");

  return `ASP-DOC-${documentCode.split("-").slice(1).join("-")}-${customerId}`;
}

/* ==========================================================
   MILESTONE
========================================================== */

export async function generateMilestoneId(
  customerId: string
): Promise<string> {
  const milestoneCode = await generateId("project");

  return `ASP-MS-${milestoneCode.split("-").slice(1).join("-")}-${customerId}`;
}

/* ==========================================================
   QUOTATION
========================================================== */

export async function generateQuotationId(
  customerId: string
): Promise<string> {
  const quotationCode = await generateId("invoice");

  return `ASP-QUO-${quotationCode.split("-").slice(1).join("-")}-${customerId}`;
}

/* ==========================================================
   AGREEMENT
========================================================== */

export async function generateAgreementId(
  customerId: string
): Promise<string> {
  const agreementCode = await generateId("invoice");

  return `ASP-AGR-${agreementCode.split("-").slice(1).join("-")}-${customerId}`;
}

/* ==========================================================
   RECEIPT
========================================================== */

export async function generateReceiptId(
  customerId: string
): Promise<string> {
  const receiptCode = await generateId("payment");

  return `ASP-RCP-${receiptCode.split("-").slice(1).join("-")}-${customerId}`;
}

/* ==========================================================
   CERTIFICATE
========================================================== */

export async function generateCertificateId(
  customerId: string
): Promise<string> {
  const certificateCode = await generateId("project");

  return `ASP-CER-${certificateCode.split("-").slice(1).join("-")}-${customerId}`;
}

export async function initializeCountersIfNeeded(
  year: number = new Date().getFullYear()
): Promise<void> {
  const counterRef = doc(
    db,
    COLLECTIONS.counters,
    String(year)
  );

  const snap = await getDoc(counterRef);

  if (!snap.exists()) {
    await setDoc(counterRef, {
      admin: 0,
      staff: 0,
      customer: 0,
      project: 0,
      invoice: 0,
      payment: 0,
      review: 0,
    });
  }
}

export function timestampToIso(
  value: Timestamp | string | null | undefined
): string {
  if (!value) return new Date().toISOString();

  if (typeof value === "string") return value;

  return value.toDate().toISOString();
}

export { serverTimestamp };