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
   REQUIRE STAFF
========================================================== */

async function requireStaff(req, res, next) {
  try {
    const snapshot = await firestore
      .collection("staff")
      .where("firebaseUid", "==", req.firebaseUser.uid)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(403).json({
        success: false,
        message: "Staff account not found.",
      });
    }

    const staff = snapshot.docs[0].data();

    if (staff.active === false) {
      return res.status(403).json({
        success: false,
        message: "Staff account is inactive.",
      });
    }

    req.staff = staff;

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
   GET STAFF INVOICES
========================================================== */

router.get(
  "/",
  requireFirebaseUser,
  requireStaff,
  async (req, res) => {
    try {
      const search = String(req.query.search || "")
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

      if (search) {
        invoices = invoices.filter((invoice) =>
          [
            invoice.invoiceNumber,
            invoice.customerId,
            invoice.customerName,
            invoice.projectName,
            invoice.paymentId,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value).toLowerCase().includes(search)
            )
        );
      }

      const totalRevenue = invoices.reduce(
        (sum, invoice) => sum + Number(invoice.amount || 0),
        0
      );

      const paidInvoices = invoices.filter(
        (invoice) =>
          String(invoice.status).toLowerCase() === "paid"
      ).length;

      const today = new Date().toDateString();

      const todayInvoices = invoices.filter((invoice) => {
        let date;

        if (invoice.paymentDate?.toDate) {
          date = invoice.paymentDate.toDate();
        } else if (
          typeof invoice.paymentDate?._seconds === "number"
        ) {
          date = new Date(
            invoice.paymentDate._seconds * 1000
          );
        } else {
          date = new Date(invoice.paymentDate);
        }

        return date.toDateString() === today;
      }).length;

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
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch invoices.",
      });
    }
  }
);

export default router;