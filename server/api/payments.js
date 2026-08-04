import crypto from "crypto";
import express from "express";
import razorpay from "../config/razorpay.js";
import { auth, firestore } from "../firebaseAdmin.js";
import { createInvoice } from "../utils/invoiceService.js";

const router = express.Router();
const CURRENCY = "INR";
const PAID_STATUS = "paid";

function sendError(res, status, message) {
  return res.status(status).json({ success: false, message });
}

async function requireFirebaseUser(req, res, next) {
  const header = req.header("Authorization");
  if (!header?.startsWith("Bearer ")) return sendError(res, 401, "Authentication is required.");
  try {
    req.firebaseUser = await auth.verifyIdToken(header.slice("Bearer ".length));
    next();
  } catch {
    return sendError(res, 401, "Your session is invalid or has expired.");
  }
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function requireString(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

async function getCustomerIdForUid(uid) {
  const profile = await firestore.collection("users").doc(uid).get();
  if (!profile.exists || profile.data()?.role !== "customer" || typeof profile.data()?.entityId !== "string") return null;
  return profile.data().entityId;
}

async function getAuthorizedInstallment(uid, installmentId) {
  const customerId = await getCustomerIdForUid(uid);
  if (!customerId) return { error: "Only linked customer accounts can make payments." };
  const installment = await firestore.collection("installments").doc(installmentId).get();
  if (!installment.exists || installment.data()?.customerId !== customerId) return { error: "Installment not found." };
  const data = installment.data();
  if (!isRecord(data) || data.status !== "pending") return { error: "This installment is not available for payment." };
  const earlier = await firestore.collection("installments")
    .where("projectId", "==", data.projectId).where("sequence", "<", data.sequence).get();
  if (earlier.docs.some((item) => item.data().status !== PAID_STATUS)) return { error: "Complete earlier installments before paying this one." };
  return { customerId, installment, data };
}

function verifySignature(orderId, paymentId, signature) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error("Razorpay is not configured.");
  const expected = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  const received = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  return received.length === expectedBuffer.length && crypto.timingSafeEqual(received, expectedBuffer);
}

async function nextPaymentIdentifiers(transaction) {
  const year = new Date().getFullYear();

  const counterRef = firestore.collection("counters").doc(String(year));

  const counter = await transaction.get(counterRef);

  const paymentCounter = counter.exists
    ? Number(counter.data()?.payment ?? 0)
    : 0;

  const invoiceCounter = counter.exists
    ? Number(counter.data()?.invoice ?? 0)
    : 0;

  const paymentNumber = paymentCounter + 1;
  const invoiceNumber = invoiceCounter + 1;

  transaction.set(
    counterRef,
    {
      payment: paymentNumber,
      invoice: invoiceNumber,
    },
    { merge: true }
  );

  return {
    paymentId: `PAY-${year}-${String(paymentNumber).padStart(5, "0")}`,

    receiptNumber: `RCP-${year}-${String(paymentNumber).padStart(5, "0")}`,

    invoiceNumber: `INV-${year}-${String(invoiceNumber).padStart(5, "0")}`,
  };
}

router.post("/create-order", requireFirebaseUser, async (req, res) => {
  const installmentId = requireString(req.body?.installmentId);
  if (!installmentId) return sendError(res, 400, "A valid installment is required.");
  try {
    const authorized = await getAuthorizedInstallment(req.firebaseUser.uid, installmentId);
    if (authorized.error) return sendError(res, 403, authorized.error);
    const amount = authorized.data.amount;
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) return sendError(res, 409, "Installment amount is invalid.");
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), currency: CURRENCY, receipt: installmentId.slice(0, 40),
      notes: { installmentId, projectId: String(authorized.data.projectId), customerId: authorized.customerId },
    });
    await firestore.collection("paymentAttempts").doc(order.id).set({
      razorpayOrderId: order.id, installmentId, projectId: authorized.data.projectId, customerId: authorized.customerId,
      amount, status: "created", createdAt: new Date(), updatedAt: new Date(),
    });
    return res.json({ success: true, orderId: order.id, amount: order.amount, currency: order.currency, key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error("Razorpay order creation failed", error);
    return sendError(res, 500, "Unable to create a payment order.");
  }
});

router.post("/verify", requireFirebaseUser, async (req, res) => {
  const installmentId = requireString(req.body?.installmentId);
  const razorpayOrderId = requireString(req.body?.razorpayOrderId);
  const razorpayPaymentId = requireString(req.body?.razorpayPaymentId);
  const razorpaySignature = requireString(req.body?.razorpaySignature);
  if (!installmentId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) return sendError(res, 400, "Incomplete payment verification data.");
  try {
    if (!verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) return sendError(res, 400, "Payment signature verification failed.");
    const authorized = await getAuthorizedInstallment(req.firebaseUser.uid, installmentId);
    if (authorized.error) return sendError(res, 403, authorized.error);
    const attempt = await firestore.collection("paymentAttempts").doc(razorpayOrderId).get();
    if (!attempt.exists || attempt.data()?.installmentId !== installmentId || attempt.data()?.customerId !== authorized.customerId) return sendError(res, 409, "Payment order is not valid for this installment.");
    let razorpayPayment = await razorpay.payments.fetch(razorpayPaymentId);
    console.log("========== RAZORPAY PAYMENT ==========");
console.log(JSON.stringify(razorpayPayment, null, 2));
console.log("======================================");
    if (razorpayPayment.order_id !== razorpayOrderId || razorpayPayment.amount !== Math.round(authorized.data.amount * 100)) return sendError(res, 409, "Razorpay could not confirm this payment.");
    if (razorpayPayment.status === "authorized") {
      razorpayPayment = await razorpay.payments.capture(razorpayPaymentId, razorpayPayment.amount, CURRENCY);
    }
    if (razorpayPayment.status !== "captured") return sendError(res, 409, "Razorpay has not captured this payment.");
    console.log("Reached before Firestore transaction");
   const result = await firestore.runTransaction(async (transaction) => {
  console.log("========== TRANSACTION START ==========");

  const existing = await transaction.get(
    firestore.collection("payments").doc(razorpayPaymentId)
  );

  console.log("Existing payment exists:", existing.exists);

  if (existing.exists) {
    console.log("Payment already exists.");
    return {
      paymentId: existing.data().paymentId,
      receiptNumber: existing.data().receiptNumber,
    };
  }

  const installmentRef = firestore
    .collection("installments")
    .doc(installmentId);

  const projectQuery = await firestore
  .collection("projects")
  .where("projectId", "==", authorized.data.projectId)
  .limit(1)
  .get();

if (projectQuery.empty) {
  throw new Error("Project document not found.");
}

const projectRef = projectQuery.docs[0].ref;

const [installment, project] = await Promise.all([
  transaction.get(installmentRef),
  transaction.get(projectRef),
]);

const nextInstallmentQuery = await transaction.get(

  firestore

    .collection("installments")

    .where("projectId", "==", authorized.data.projectId)

    .where("sequence", "==", installment.data().sequence + 1)

);

console.log(

  "Next installment found:",

  !nextInstallmentQuery.empty

);
  console.log("Installment exists:", installment.exists);
  console.log("Project exists:", project.exists);

  console.log("Installment Data:");
  console.log(installment.data());

  console.log("Project Data:");
  console.log(project.data());

  if (!installment.exists) {
    throw new Error("Installment document not found.");
  }

  if (!project.exists) {
    throw new Error("Project document not found.");
  }

  if (installment.data()?.status !== "pending") {
    throw new Error(
      `Installment status is '${installment.data()?.status}'`
    );
  }

  console.log("Status check passed.");

  const {
  paymentId,
  receiptNumber,
  invoiceNumber,
} = await nextPaymentIdentifiers(transaction);
  const now = new Date();

  const method =
    typeof razorpayPayment.method === "string"
      ? razorpayPayment.method
      : null;

  const amount = installment.data().amount;

 transaction.set(
  firestore.collection("receipts").doc(receiptNumber),
  {
    receiptId: receiptNumber,

    receiptNumber,

    invoiceNumber,

    paymentId,

    installmentId,

    projectId: authorized.data.projectId,

    customerId: authorized.customerId,

    customerName: String(project.data()?.customerName ?? ""),

    projectName: String(project.data()?.title ?? ""),

    amount,

    paymentMethod: method,

    razorpayPaymentId,

    paymentDate: now,

    status: "pending",

    approved: false,

    approvedBy: null,

    approvedByRole: null,

    approvedAt: null,

    pdfUrl: null,

    createdAt: now,

    updatedAt: now,
  }
);


  transaction.set(
  firestore.collection("payments").doc(paymentId),
  {
    paymentId,

    projectId: authorized.data.projectId,

    customerId: authorized.customerId,

    installmentId,

    amount,

    status: PAID_STATUS,

    razorpayOrderId,

    razorpayPaymentId,

    method,

    paidAt: now,

    createdAt: now,

    updatedAt: now,
  }
);


  transaction.update(installmentRef, {
    status: PAID_STATUS,
    paidAt: now,
    paymentId,
    updatedAt: now,
  });

 

  console.log(
    "Next installment found:",
    !nextInstallmentQuery.empty
  );

  if (!nextInstallmentQuery.empty) {
    transaction.update(nextInstallmentQuery.docs[0].ref, {
      locked: false,
      updatedAt: now,
    });
  }

  transaction.update(projectRef, {
    paidAmount:
      Number(project.data()?.paidAmount ?? 0) + amount,
    updatedAt: now,
  });

 

  transaction.update(
    firestore.collection("paymentAttempts").doc(razorpayOrderId),
    {
      status: PAID_STATUS,
      razorpayPaymentId,
      updatedAt: now,
    }
  );

  console.log("🚨 NEW PAYMENTS.JS IS RUNNING 🚨");
console.log("Saving paymentId:", paymentId);
console.log("Saving receiptNumber:", receiptNumber);

  return {
    paymentId,
    receiptNumber,
    invoiceNumber,

    projectId: authorized.data.projectId,

    customerId: authorized.customerId,

    customerName: String(project.data()?.customerName ?? ""),

    projectName: String(project.data()?.title ?? ""),

    amount,

    paymentMethod: method,

    razorpayPaymentId,

    paymentDate: now,
};
});await createInvoice({
    invoiceNumber: result.invoiceNumber,

    paymentId: result.paymentId,

    projectId: result.projectId,

    customerId: result.customerId,

    customerName: result.customerName,

    projectName: result.projectName,

    amount: result.amount,

    paymentMethod: result.paymentMethod,

    razorpayPaymentId: result.razorpayPaymentId,

    paymentDate: result.paymentDate,
});
    return res.json({ success: true, ...result });
  } catch (error) {
    console.error("Razorpay payment verification failed", error);
    return sendError(res, 500, "Unable to verify the payment. Please contact support if you were charged.");
  }
});
router.get("/invoices", requireFirebaseUser, async (req, res) => {
  try {
    const customerId = await getCustomerIdForUid(req.firebaseUser.uid);

    if (!customerId) {
      return sendError(res, 403, "Customer account not found.");
    }

    const snapshot = await firestore
      .collection("invoices")
      .where("customerId", "==", customerId)
      .orderBy("paymentDate", "desc")
      .get();

    const invoices = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.json({
      success: true,
      invoices,
    });

  } catch (error) {
    console.error("Failed to fetch invoices:", error);

    return sendError(
      res,
      500,
      "Unable to fetch invoices."
    );
  }
});

export default router;

