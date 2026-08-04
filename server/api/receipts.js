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
   REQUIRE CUSTOMER
========================================================== */

async function requireCustomer(req, res, next) {
  try {
    const snapshot = await firestore
      .collection("customers")
      .where("firebaseUid", "==", req.firebaseUser.uid)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(403).json({
        success: false,
        message: "Customer account not found.",
      });
    }

    const customer = snapshot.docs[0].data();

    if (customer.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Customer account is inactive.",
      });
    }

    req.customer = customer;

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
   GET CUSTOMER RECEIPTS
========================================================== */

router.get(
  "/",
  requireFirebaseUser,
  requireCustomer,
  async (req, res) => {
    try {
      const search = String(req.query.search || "")
        .trim()
        .toLowerCase();

      const snapshot = await firestore
        .collection("receipts")
        .where("customerId", "==", req.customer.customerId)
        .orderBy("paymentDate", "desc")
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

      if (search) {
        receipts = receipts.filter((receipt) =>
          [
            receipt.receiptNumber,
            receipt.invoiceNumber,
            receipt.projectName,
            receipt.paymentMethod,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(search)
            )
        );
      }

      return res.json({
        success: true,
        receipts,
      });
    } catch (error) {
      console.error(
        "Failed to fetch customer receipts:",
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