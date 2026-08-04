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

    if (staff.isActive === false) {
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
   GET STAFF RECEIPTS
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
        .collection("receipts")
        .orderBy("paymentDate", "desc")
        .get();

      let receipts = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,

          receiptNumber:
            data.receiptNumber ??
            data.receiptId ??
            "",

          invoiceNumber:
            data.invoiceNumber ?? "",

          paymentId:
            data.paymentId ?? "",

          customerId:
            data.customerId ?? "",

          customerName:
            data.customerName ?? "",

          projectName:
            data.projectName ?? "",

          amount:
            Number(data.amount ?? 0),

          paymentMethod:
            data.paymentMethod ?? null,

          paymentDate:
            data.paymentDate ?? null,

          pdfUrl:
            data.pdfUrl ?? null,
        };
      });

      if (search.length > 0) {
        receipts = receipts.filter((receipt) =>
          [
            receipt.receiptNumber,
            receipt.invoiceNumber,
            receipt.paymentId,
            receipt.customerId,
            receipt.customerName,
            receipt.projectName,
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
        (sum, receipt) => sum + receipt.amount,
        0
      );

      const today = new Date().toDateString();

      const todayReceipts = receipts.filter(
        (receipt) => {
          let date;

          if (
            typeof receipt.paymentDate?.toDate ===
            "function"
          ) {
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
          todayReceipts,
        },

        receipts,
      });
    } catch (error) {
      console.error(
        "Failed to fetch staff receipts:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch receipts.",
      });
    }
  }
);

export default router;