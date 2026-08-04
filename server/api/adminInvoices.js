import express from "express";
import { auth, firestore } from "../firebaseAdmin.js";

const router = express.Router();

/* ==========================================================
   AUTHENTICATE FIREBASE USER
========================================================== */

async function requireFirebaseUser(req, res, next) {
  const header = req.header("Authorization");

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  try {
    req.firebaseUser = await auth.verifyIdToken(
      header.substring("Bearer ".length)
    );

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      success: false,
      message: "Invalid session.",
    });
  }
}

/* ==========================================================
   REQUIRE ADMIN
========================================================== */
async function requireAdmin(req, res, next) {
  try {
    const adminDoc = await firestore
      .collection("admins")
      .doc(req.firebaseUser.uid)
      .get();

    if (!adminDoc.exists) {
      return res.status(403).json({
        success: false,
        message: "Administrator access required.",
      });
    }

    const admin = adminDoc.data();

    if (admin?.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Administrator account is inactive.",
      });
    }

    req.admin = admin;

    next();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Authorization failed.",
    });
  }
}

/* ==========================================================
   GET ALL INVOICES
========================================================== */

router.get(
  "/",
  requireFirebaseUser,
  requireAdmin,
  async (req, res) => {
    try {
      const search =
        String(req.query.search || "")
          .trim()
          .toLowerCase();

      const snapshot = await firestore
        .collection("invoices")
        .orderBy("paymentDate", "desc")
        .get();

      let invoices = snapshot.docs.map((doc) => {
  const data = doc.data();

  return {
    id: doc.id,
    ...data,
    invoiceNumber: data.invoiceNumber ?? data.invoiceId ?? "",
  };
});

      if (search.length > 0) {
        invoices = invoices.filter((invoice) => {
          return [
            invoice.invoiceId,
            invoice.customerId,
            invoice.customerName,
            invoice.projectName,
            invoice.paymentId,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(search)
            );
        });
      }

      const totalRevenue = invoices.reduce(
        (sum, invoice) =>
          sum + Number(invoice.amount || 0),
        0
      );

      const paidInvoices = invoices.filter(
        (invoice) => invoice.status === "paid"
      ).length;

      const today = new Date().toDateString();

      const todayInvoices = invoices.filter(
        (invoice) =>
          new Date(
            invoice.paymentDate
          ).toDateString() === today
      ).length;

      return res.json({
        success: true,

        summary: {
          totalInvoices: invoices.length,
          totalRevenue,
          paidInvoices,
          todayInvoices,
        },

        invoices,
      });
    } catch (error) {
      console.error(
        "Failed to fetch admin invoices:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to fetch invoices.",
      });
    }
  }
);

export default router;