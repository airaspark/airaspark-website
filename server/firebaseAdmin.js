import admin from "firebase-admin";
import serviceAccount from "./firebase-admin-key.json" assert { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const auth = admin.auth();
export const firestore = admin.firestore();

export default admin;