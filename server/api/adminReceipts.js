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
   GET ALL RECEIPTS
========================================================== */

router.get(
  "/",
  requireFirebaseUser,
  requireAdmin,
  async (req, res) => {
    try {
      const search = String(req.query.search || "")
        .trim()
        .toLowerCase();

      const snapshot = await firestore
        .collection("receipts")
        
        .get();

      let receipts = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          ...data,
          receiptNumber:
            data.receiptNumber ??
            data.receiptId ??
            "",
        };
      });

      if (search.length > 0) {
        receipts = receipts.filter((receipt) =>
          [
            receipt.receiptNumber,
            receipt.customerId,
            receipt.customerName,
            receipt.projectName,
            receipt.invoiceNumber,
            receipt.paymentId,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(search)
            )
        );
      }

      const totalRevenue = receipts.reduce(
        (sum, receipt) =>
          sum + Number(receipt.amount || 0),
        0
      );

      const paidReceipts = receipts.filter(
        (receipt) =>
          String(receipt.status).toLowerCase() ===
          "paid"
      ).length;

      const today = new Date().toDateString();

      const todayReceipts = receipts.filter(
        (receipt) => {
          let date;

          if (receipt.paymentDate?.toDate) {
            date = receipt.paymentDate.toDate();
          } else if (
            typeof receipt.paymentDate?._seconds ===
            "number"
          ) {
            date = new Date(
              receipt.paymentDate._seconds * 1000
            );
          } else {
            date = new Date(receipt.paymentDate);
          }

          return date.toDateString() === today;
        }
      ).length;

      return res.json({
        success: true,

        summary: {
          totalReceipts: receipts.length,
          totalRevenue,
          paidReceipts,
          todayReceipts,
        },

        receipts,
      });
    } catch (error) {
      console.error(
        "Failed to fetch admin receipts:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to fetch receipts.",
      });
    }
  }
);

export default router;