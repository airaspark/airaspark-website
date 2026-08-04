import express from "express";
import { auth, firestore } from "../firebaseAdmin.js";

const router = express.Router();

/* ==========================================================
   HELPERS
========================================================== */

function sendError(res, status, message) {
  return res.status(status).json({
    success: false,
    message,
  });
}

async function requireFirebaseUser(req, res, next) {
  const header = req.header("Authorization");

  if (!header?.startsWith("Bearer ")) {
    return sendError(
      res,
      401,
      "Authentication is required."
    );
  }

  try {
    req.firebaseUser = await auth.verifyIdToken(
      header.substring("Bearer ".length)
    );

    next();
  } catch (error) {
    console.error(error);

    return sendError(
      res,
      401,
      "Your session has expired."
    );
  }
}

async function getCustomerIdForUid(uid) {
  const userDoc = await firestore
    .collection("users")
    .doc(uid)
    .get();

  if (
    !userDoc.exists ||
    userDoc.data()?.role !== "customer"
  ) {
    return null;
  }

  return userDoc.data().entityId;
}

async function getAdminIdForUid(uid) {
  const userDoc = await firestore
    .collection("users")
    .doc(uid)
    .get();

  if (
    !userDoc.exists ||
    userDoc.data()?.role !== "admin"
  ) {
    return null;
  }

  return userDoc.data().entityId;
}

function sumAmounts(items, field = "amount") {
  return items.reduce(
    (sum, item) => sum + Number(item[field] ?? 0),
    0
  );
}

/* ==========================================================
   CUSTOMER DASHBOARD
========================================================== */

router.get(
  "/customer",
  requireFirebaseUser,
  async (req, res) => {
    try {
      const customerId =
        await getCustomerIdForUid(
          req.firebaseUser.uid
        );

      if (!customerId) {
        return sendError(
          res,
          403,
          "Customer account not found."
        );
      }

      const [
        projectsSnapshot,
        invoicesSnapshot,
        installmentsSnapshot,
        receiptsSnapshot,
      ] = await Promise.all([
        firestore
          .collection("projects")
          .where("customerId", "==", customerId)
          .get(),

        firestore
          .collection("invoices")
          .where("customerId", "==", customerId)
          .get(),

        firestore
          .collection("installments")
          .where("customerId", "==", customerId)
          .get(),

        firestore
          .collection("receipts")
          .where("customerId", "==", customerId)
          .get(),
      ]);

      const projects = projectsSnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

      const invoices = invoicesSnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

      const installments =
        installmentsSnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

      const receipts = receiptsSnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

      const activeProjects =
        projects.filter(
          (p) => p.status !== "Completed"
        ).length;

      const pendingInvoices =
        invoices.filter(
          (i) =>
            i.status === "pending" ||
            i.status === "Pending" ||
            i.status === "draft"
        ).length;

      const paymentsDue =
        installments.filter(
          (i) => i.status === "pending"
        ).length;

      const totalReceipts =
        receipts.length;

      const recentProjects = [...projects]
        .sort(
          (a, b) =>
            new Date(
              b.updatedAt ?? b.createdAt
            ).getTime() -
            new Date(
              a.updatedAt ?? a.createdAt
            ).getTime()
        )
        .slice(0, 5);

      const recentReceipts = [...receipts]
        .sort(
          (a, b) =>
            new Date(
              b.paymentDate ?? b.createdAt
            ).getTime() -
            new Date(
              a.paymentDate ?? a.createdAt
            ).getTime()
        )
        .slice(0, 5);

      return res.json({
        success: true,

        stats: {
          activeProjects,
          pendingInvoices,
          paymentsDue,
          totalReceipts,
        },

        recentProjects,

        recentReceipts,
      });
    } catch (error) {
      console.error(error);

      return sendError(
        res,
        500,
        "Unable to load customer dashboard."
      );
    }
  }
);

/* ==========================================================
   ADMIN DASHBOARD
========================================================== */

router.get(
  "/admin",
  requireFirebaseUser,
  async (req, res) => {
    try {
      const adminId = await getAdminIdForUid(
        req.firebaseUser.uid
      );

      if (!adminId) {
        return sendError(
          res,
          403,
          "Admin account not found."
        );
      }

      const [
        customersSnapshot,
        staffSnapshot,
        projectsSnapshot,
        paymentsSnapshot,
        receiptsSnapshot,
        reviewsSnapshot,
      ] = await Promise.all([
        firestore.collection("customers").get(),
        firestore.collection("staff").get(),
        firestore.collection("projects").get(),
        firestore.collection("payments").get(),
        firestore.collection("receipts").get(),
        firestore.collection("reviews").get(),
      ]);

      const customers = customersSnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

      const staff = staffSnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

      const projects = projectsSnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

      const payments = paymentsSnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

      const receipts = receiptsSnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

      const reviews = reviewsSnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

      const activeProjects = projects.filter(
        (p) => p.status !== "Completed"
      ).length;

      const completedProjects = projects.filter(
        (p) => p.status === "Completed"
      ).length;

      const pendingReceipts = receipts.filter(
        (r) => !r.approved
      );

      const revenue = sumAmounts(payments);

      const recentProjects = [...projects]
        .sort(
          (a, b) =>
            new Date(
              b.updatedAt ?? b.createdAt
            ).getTime() -
            new Date(
              a.updatedAt ?? a.createdAt
            ).getTime()
        )
        .slice(0, 5);

      const recentPayments = [...payments]
        .sort(
          (a, b) =>
            new Date(
              b.paidAt ?? b.createdAt
            ).getTime() -
            new Date(
              a.paidAt ?? a.createdAt
            ).getTime()
        )
        .slice(0, 5);

      return res.json({
        success: true,

        stats: {
          totalCustomers: customers.length,

          totalStaff: staff.length,

          activeProjects,

          completedProjects,

          totalRevenue: revenue,

          totalPayments: payments.length,

          pendingReceipts:
            pendingReceipts.length,

          totalReviews:
            reviews.length,
        },

        recentProjects,

        recentPayments,

        pendingReceipts:
          pendingReceipts.slice(0, 5),
      });
    } catch (error) {
      console.error(error);

      return sendError(
        res,
        500,
        "Unable to load admin dashboard."
      );
    }
  }
);

export default router;