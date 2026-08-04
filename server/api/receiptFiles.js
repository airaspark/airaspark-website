import express from "express";
import multer from "multer";
import { auth, firestore, storage } from "../firebaseAdmin.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, //10MB
  },
});

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

async function requireAdminOrStaff(req, res, next) {
  try {
    const admin = await firestore
      .collection("admins")
      .doc(req.firebaseUser.uid)
      .get();

    if (admin.exists) {
      req.role = "admin";
      return next();
    }

    const staff = await firestore
      .collection("staff")
      .where("firebaseUid", "==", req.firebaseUser.uid)
      .limit(1)
      .get();

    if (!staff.empty) {
      req.role = "staff";
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Permission denied.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Authorization failed.",
    });
  }
}

/*
=====================================================
UPLOAD PDF
=====================================================
*/

router.post(
  "/:receiptId/upload",
  requireFirebaseUser,
  requireAdminOrStaff,
  upload.single("pdf"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select a PDF.",
        });
      }

      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({
          success: false,
          message: "Only PDF files are allowed.",
        });
      }

      const receiptId = req.params.receiptId;

      const receiptRef = firestore
        .collection("receipts")
        .doc(receiptId);

      const receiptDoc = await receiptRef.get();

      if (!receiptDoc.exists) {
        return res.status(404).json({
          success: false,
          message: "Receipt not found.",
        });
      }

      const bucket = storage.bucket();

      const file = bucket.file(
        `receipts/${receiptId}.pdf`
      );

      await file.save(req.file.buffer, {
        metadata: {
          contentType: "application/pdf",
        },
      });

      await file.makePublic();

      const pdfUrl = `https://storage.googleapis.com/${bucket.name}/receipts/${receiptId}.pdf`;

     await receiptRef.update({
  pdfUrl,
  status: "approved",
  approved: true,
  approvedAt: new Date(),
  updatedAt: new Date(),
});

      return res.json({
        success: true,
        pdfUrl,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Upload failed.",
      });
    }
  }
);

/*
=====================================================
DELETE PDF
=====================================================
*/

router.delete(
  "/:receiptId/pdf",
  requireFirebaseUser,
  requireAdminOrStaff,
  async (req, res) => {
    try {
      const receiptId = req.params.receiptId;

      const bucket = storage.bucket();

      const file = bucket.file(
        `receipts/${receiptId}.pdf`
      );

      await file.delete({
        ignoreNotFound: true,
      });

      await firestore
        .collection("receipts")
        .doc(receiptId)
        .update({
          pdfUrl: null,
          updatedAt: new Date(),
        });

      return res.json({
        success: true,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Delete failed.",
      });
    }
  }
);

export default router;