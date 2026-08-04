import { firestore } from "../firebaseAdmin.js";
import generateInvoicePDF from "./invoice/index.js";
import { uploadInvoicePDF } from "./storage.js";

/**
 * Creates a customer invoice after successful payment.
 */
export async function createInvoice({
  invoiceNumber,
  paymentId,
  projectId,
  customerId,
  customerName,
  projectName,
  amount,
  paymentMethod,
  razorpayPaymentId,
  paymentDate,
}) {
  // Generate PDF
 // Generate PDF
const pdfBuffer = await generateInvoicePDF({
  invoiceNumber,

  issueDate: paymentDate,
  paymentDate,

  status: "PAID",

  customer: {
    name: customerName,
    customerId,
    email: "", // Fill from customer record if available
  },

  project: {
    name: projectName,
    projectId,
    service: "Software Development",
  },

  payment: {
    method: paymentMethod,
    status: "Paid",
    paymentId,
    orderId: "",
    transactionId: razorpayPaymentId,
    date: paymentDate,
  },

  items: [
    {
      description: projectName,
      quantity: 1,
      unitPrice: amount,
      total: amount,
    },
  ],

  gst: 0,
  discount: 0,
});

  // Upload PDF to Firebase Storage
  const { storagePath, downloadUrl } =
    await uploadInvoicePDF(pdfBuffer, invoiceNumber);

  const now = new Date();

  // Create Firestore document
  await firestore
    .collection("invoices")
    .doc(invoiceNumber)
    .set({
      invoiceId: invoiceNumber,

      paymentId,
      projectId,
      customerId,

      customerName,
      projectName,

      amount,

      paymentMethod,

      razorpayPaymentId,

      paymentDate,

      status: "paid",

      pdfUrl: downloadUrl,

      storagePath,

      createdAt: now,
      updatedAt: now,
    });

  return {
    invoiceId: invoiceNumber,
    pdfUrl: downloadUrl,
  };
}