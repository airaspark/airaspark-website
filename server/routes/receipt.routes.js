import express from "express";
import multer from "multer";
import { auth, firestore } from "../firebaseAdmin.js";
import {
  uploadReceiptPdf,
  deleteReceiptPdf,
} from "../utils/storage.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

/* ==========================================================
   FIREBASE AUTH
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
   GET CURRENT USER ROLE
========================================================== */

async function getPortalUser(uid) {
  let snapshot = await firestore
    .collection("admins")
    .where("firebaseUid", "==", uid)
    .limit(1)
    .get();

  if (!snapshot.empty) {
    return {
      role: "admin",
      data: snapshot.docs[0].data(),
    };
  }

  snapshot = await firestore
    .collection("staff")
    .where("firebaseUid", "==", uid)
    .limit(1)
    .get();

  if (!snapshot.empty) {
    return {
      role: "staff",
      data: snapshot.docs[0].data(),
    };
  }

  snapshot = await firestore
    .collection("customers")
    .where("firebaseUid", "==", uid)
    .limit(1)
    .get();

  if (!snapshot.empty) {
    return {
      role: "customer",
      data: snapshot.docs[0].data(),
    };
  }

  return null;
}

/* ==========================================================
   CUSTOMER RECEIPTS
========================================================== */

router.get(
  "/customer",
  requireFirebaseUser,
  async (req, res) => {
    try {
      const portalUser = await getPortalUser(
        req.firebaseUser.uid
      );

      if (
        !portalUser ||
        portalUser.role !== "customer"
      ) {
        return res.status(403).json({
          success: false,
          message: "Customer account not found.",
        });
      }

      const customerId =
        portalUser.data.customerId;

      const snapshot = await firestore
        .collection("receipts")
        .where("customerId", "==", customerId)
        .orderBy("paymentDate", "desc")
        .get();

      const receipts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.json({
        success: true,
        receipts,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Unable to load receipts.",
      });
    }
  }
);

/* ==========================================================
   ADMIN RECEIPTS
========================================================== */

router.get(
  "/",
  requireFirebaseUser,
  async (req, res) => {


    

    try {
      const portalUser = await getPortalUser(
        req.firebaseUser.uid
      );

      if (
        !portalUser ||
        portalUser.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Administrator access required.",
        });
      }

      const search = String(
        req.query.search || ""
      )
        .trim()
        .toLowerCase();

      const snapshot = await firestore
        .collection("receipts")
        .orderBy("paymentDate", "desc")
        .get();

      let receipts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (search.length > 0) {
        receipts = receipts.filter((receipt) =>
          [
            receipt.receiptNumber,
            receipt.receiptId,
            receipt.customerId,
            receipt.customerName,
            receipt.projectName,
            receipt.paymentId,
            receipt.invoiceNumber,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(search)
        );
      }

      const summary = {
        totalReceipts: receipts.length,

        totalRevenue: receipts.reduce(
          (sum, receipt) =>
            sum + Number(receipt.amount || 0),
          0
        ),

        todayReceipts: receipts.filter((receipt) => {
          let date = null;

          if (
            typeof receipt.paymentDate?.toDate ===
            "function"
          ) {
            date = receipt.paymentDate.toDate();
          } else if (
            receipt.paymentDate?._seconds
          ) {
            date = new Date(
              receipt.paymentDate._seconds * 1000
            );
          } else if (receipt.paymentDate) {
            date = new Date(
              receipt.paymentDate
            );
          }

          if (!date) return false;

          return (
            date.toDateString() ===
            new Date().toDateString()
          );
        }).length,
      };

      return res.json({
        success: true,
        summary,
        receipts,
      });
    } catch (error) {
      console.error(
        "Failed to fetch admin receipts:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to load receipts.",
      });
    }
  }
);

/* ==========================================================
   STAFF RECEIPTS
========================================================== */

router.get(
  "/staff",
  requireFirebaseUser,
  async (req, res) => {
    try {
      const portalUser = await getPortalUser(
        req.firebaseUser.uid
      );

      if (
        !portalUser ||
        portalUser.role !== "staff"
      ) {
        return res.status(403).json({
          success: false,
          message: "Staff access required.",
        });
      }

      const search = String(
        req.query.search || ""
      )
        .trim()
        .toLowerCase();

      const snapshot = await firestore
        .collection("receipts")
        .orderBy("paymentDate", "desc")
        .get();

      let receipts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (search.length > 0) {
        receipts = receipts.filter((receipt) =>
          [
            receipt.receiptNumber,
            receipt.customerId,
            receipt.customerName,
            receipt.projectName,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(search)
        );
      }

      return res.json({
        success: true,
        receipts,
      });
    } catch (error) {
      console.error(
        "Failed to fetch staff receipts:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to load receipts.",
      });
    }
  }
);

/* ==========================================================
   UPLOAD RECEIPT PDF
========================================================== */

router.post(
  "/:receiptId/upload",
  requireFirebaseUser,
  upload.single("pdf"),
  async (req, res) => {
    try {
      const portalUser = await getPortalUser(
        req.firebaseUser.uid
      );

      if (
        !portalUser ||
        (portalUser.role !== "admin" &&
          portalUser.role !== "staff")
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Only Admin or Staff can upload receipt PDFs.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select a PDF file.",
        });
      }

      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({
          success: false,
          message: "Only PDF files are allowed.",
        });
      }

      const receiptRef = firestore
        .collection("receipts")
        .doc(req.params.receiptId);

      const receiptDoc = await receiptRef.get();

      if (!receiptDoc.exists) {
        return res.status(404).json({
          success: false,
          message: "Receipt not found.",
        });
      }

      const pdfUrl = await uploadReceiptPdf(
        req.params.receiptId,
        req.file.buffer
      );

      await receiptRef.update({
        pdfUrl,
        updatedAt: new Date(),
        uploadedBy: portalUser.role,
        uploadedByUid: req.firebaseUser.uid,
      });

      return res.json({
        success: true,
        message: "Receipt uploaded successfully.",
        pdfUrl,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to upload receipt PDF.",
      });
    }
  }
);

/* ==========================================================
   DELETE RECEIPT PDF
========================================================== */

router.delete(
  "/:receiptId/pdf",
  requireFirebaseUser,
  async (req, res) => {
    try {
      const portalUser = await getPortalUser(
        req.firebaseUser.uid
      );

      if (
        !portalUser ||
        (portalUser.role !== "admin" &&
          portalUser.role !== "staff")
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Only Admin or Staff can delete receipt PDFs.",
        });
      }

      const receiptRef = firestore
        .collection("receipts")
        .doc(req.params.receiptId);

      const receiptDoc = await receiptRef.get();

      if (!receiptDoc.exists) {
        return res.status(404).json({
          success: false,
          message: "Receipt not found.",
        });
      }

      const receipt = receiptDoc.data();

      if (receipt?.pdfUrl) {
        await deleteReceiptPdf(receipt.pdfUrl);
      }

      await receiptRef.update({
        pdfUrl: null,
        updatedAt: new Date(),
      });

      return res.json({
        success: true,
        message: "Receipt PDF deleted successfully.",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to delete receipt PDF.",
      });
    }
  }
);

/* ==========================================================
   HEALTH CHECK
========================================================== */

router.get("/health", (req, res) => {
  return res.json({
    success: true,
    service: "Receipt Service",
    status: "Running",
    timestamp: new Date(),
  });
});

/* ==========================================================
   DEFAULT EXPORT
========================================================== */

export default router;