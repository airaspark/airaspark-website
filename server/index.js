import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { encrypt, decrypt } from "./encryption.js";
import { auth, firestore } from "./firebaseAdmin.js";

import authRoutes from "./api/auth.js";
import paymentRoutes from "./api/payments.js";
import adminInvoiceRoutes from "./api/adminInvoices.js";
import staffInvoiceRoutes from "./api/staffInvoices.js";
import receiptRoutes from "./routes/receipt.routes.js";
import receiptFilesRoutes from "./api/receiptFiles.js";
import customerReceiptRoutes from "./api/receipts.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

const mockDatabase = {};

// ==============================
// HEALTH
// ==============================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "AiraSpark Server Running",
  });
});

// ==============================
// AUTH
// ==============================

app.use("/api/auth", authRoutes);

// ==============================
// PAYMENTS (RAZORPAY)
// ==============================

app.use("/api/payments", paymentRoutes);

// ==============================

// ADMIN INVOICES

// ==============================

app.use("/api/admin/invoices", adminInvoiceRoutes);

// ==============================
// STAFF INVOICES
// ==============================

app.use("/api/staff/invoices", staffInvoiceRoutes);

// ==============================

// RECEIPTS

// ==============================

app.use("/api/admin/receipts", receiptRoutes);
app.use("/api/receipt-files", receiptFilesRoutes);
app.use("/api/receipts", customerReceiptRoutes);

// ==============================
// CONTACT ENCRYPTION
// ==============================

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!message) {
    return res.status(400).json({
      error: "Message is required",
    });
  }

  const encryptedPayload = encrypt(message);

  const entryId = Date.now().toString();

  mockDatabase[entryId] = {
    name,
    email,
    secureMessage: encryptedPayload,
  };

  console.log("Saved Encrypted Data:", mockDatabase[entryId]);

  res.status(201).json({
    status: "success",
    message: "Message securely encrypted and saved.",
    id: entryId,
  });
});

// ==============================
// GET CONTACT
// ==============================

app.get("/api/contact/:id", (req, res) => {
  const entryId = req.params.id;

  const record = mockDatabase[entryId];

  if (!record) {
    return res.status(404).json({
      error: "Record not found",
    });
  }

  try {
    const decryptedMessage = decrypt(record.secureMessage);

    res.json({
      name: record.name,
      email: record.email,
      message: decryptedMessage,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to decrypt data.",
    });
  }
});

// ==============================
// CREATE CUSTOMER
// ==============================

app.post("/api/customers", async (req, res) => {
  try {
    const {
      name,
      company,
      email,
      phone,
      password,
    } = req.body;

    if (!name || !company || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const user = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    const customerId = `ASC-${new Date().getFullYear()}-${Math.floor(
      100 + Math.random() * 900
    )}`;

    await firestore.collection("customers").doc(user.uid).set({
      customerId,
      firebaseUid: user.uid,
      authEmail: email,

      name,
      company,
      email,
      phone,

      assignedStaffIds: [],

      isActive: true,

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Customer created successfully.",
      uid: user.uid,
      customerId,
    });
  } catch (error) {
    console.error("Create Customer Error:", error);

    if (error.code === "auth/email-already-exists") {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create customer.",
    });
  }
});

// ==============================
// START SERVER
// ==============================

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});