import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let app;

// =========================
// VERCEL PRODUCTION
// =========================

if (process.env.FIREBASE_PRIVATE_KEY) {
  console.log("Using Firebase Admin from Environment Variables");

  if (!getApps().length) {
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
      storageBucket:
        process.env.FIREBASE_STORAGE_BUCKET ||
        "airaspark-website.firebasestorage.app",
    });
  } else {
    app = getApps()[0];
  }
}

// =========================
// LOCAL DEVELOPMENT
// =========================

else {
  console.log("Using local firebase-admin-key.json");

  const keyPath = path.join(__dirname, "firebase-admin-key.json");

  const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));

  if (!getApps().length) {
    app = initializeApp({
      credential: cert(serviceAccount),
      storageBucket:
        process.env.FIREBASE_STORAGE_BUCKET ||
        "airaspark-website.firebasestorage.app",
    });
  } else {
    app = getApps()[0];
  }
}

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export default app;