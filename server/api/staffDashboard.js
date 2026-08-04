import express from "express";
import { auth, firestore } from "../firebaseAdmin.js";

const router = express.Router();

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
      header.slice("Bearer ".length)
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

async function getStaffId(uid) {
  const user = await firestore
    .collection("users")
    .doc(uid)
    .get();

  if (
    !user.exists ||
    user.data()?.role !== "staff"
  ) {
    return null;
  }

  return user.data().entityId;
}

router.get(
  "/staff",
  requireFirebaseUser,
  async (req, res) => {
    try {
      const staffId = await getStaffId(
        req.firebaseUser.uid
      );

      if (!staffId) {
        return sendError(
          res,
          403,
          "Staff account not found."
        );
      }

            const staffSnapshot = await firestore
        .collection("staff")
        .where("staffId", "==", staffId)
        .limit(1)
        .get();

      if (staffSnapshot.empty) {
        return sendError(
          res,
          404,
          "Staff profile not found."
        );
      }

      const staff = staffSnapshot.docs[0].data();

      const assignedCustomers =
        Array.isArray(staff.assignedCustomers)
          ? staff.assignedCustomers
          : [];

      const [
        customersSnapshot,
        projectsSnapshot,
        paymentsSnapshot,
        receiptsSnapshot,
      ] = await Promise.all([
        firestore.collection("customers").get(),
        firestore.collection("projects").get(),
        firestore.collection("payments").get(),
        firestore.collection("receipts").get(),
      ]);

      const customers =
        customersSnapshot.docs.filter((doc) =>
          assignedCustomers.includes(
            doc.data().customerId
          )
        );

      const projects =
        projectsSnapshot.docs.filter((doc) =>
          assignedCustomers.includes(
            doc.data().customerId
          )
        );

      const payments =
        paymentsSnapshot.docs.filter((doc) =>
          assignedCustomers.includes(
            doc.data().customerId
          )
        );

      const receipts =
        receiptsSnapshot.docs.filter((doc) =>
          assignedCustomers.includes(
            doc.data().customerId
          )
        );

              const stats = {
        assignedCustomers: customers.length,

        activeProjects: projects.filter(
          (project) =>
            project.data().status !== "Completed"
        ).length,

        pendingUploads: receipts.filter(
          (receipt) =>
            receipt.data().approved === false
        ).length,

        dueMilestones: projects.filter(
          (project) =>
            project.data().status === "Planning" ||
            project.data().status === "In Progress"
        ).length,
      };

      const recentProjects = projects
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
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

      const recentPayments = payments
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort(
          (a, b) =>
            new Date(
              b.paidAt ?? b.createdAt
            ).getTime() -
            new Date(
              a.paidAt ?? a.createdAt
            ).getTime()
        )
        .slice(0, 10);

              return res.json({
        success: true,

        stats,

        recentProjects,

        recentPayments,

        customers: customers.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      });

    } catch (error) {
      console.error(error);

      return sendError(
        res,
        500,
        "Unable to load staff dashboard."
      );
    }
  }
);

export default router;