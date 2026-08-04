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
  "/customers",
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

      // IMPORTANT:
      // If your Firestore uses "assignedCustomerIds",
      // replace "assignedCustomers" below with "assignedCustomerIds".
      const assignedCustomers =
        Array.isArray(staff.assignedCustomers)
          ? staff.assignedCustomers
          : [];

      const search = String(
        req.query.search ?? ""
      )
        .trim()
        .toLowerCase();

      const customersSnapshot = await firestore
        .collection("customers")
        .get();

      const projectsSnapshot = await firestore
        .collection("projects")
        .get();

      const customers = customersSnapshot.docs
        .filter((doc) =>
          assignedCustomers.includes(
            doc.data().customerId
          )
        )
        .map((doc) => {
          const data = doc.data();

          const activeProjects =
            projectsSnapshot.docs.filter(
              (project) =>
                project.data().customerId ===
                  data.customerId &&
                project.data().status !==
                  "Completed"
            ).length;

          return {
            id: doc.id,

            customerId: data.customerId,

            name: data.name,

            company: data.company,

            email: data.email,

            phone: data.phone,

            activeProjects,
          };
        })
        .filter((customer) => {
          if (!search) return true;

          return (
            customer.name
              .toLowerCase()
              .includes(search) ||
            customer.company
              .toLowerCase()
              .includes(search) ||
            customer.customerId
              .toLowerCase()
              .includes(search)
          );
        });

              customers.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      return res.json({
        success: true,

        totalCustomers: customers.length,

        customers,
      });

    } catch (error) {
      console.error(error);

      return sendError(
        res,
        500,
        "Unable to load assigned customers."
      );
    }
  }
);

export default router;