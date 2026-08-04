import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

console.log("Initializing Firebase Admin (modular)");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const keyPath = path.join(
  
  __dirname,
  "firebase-admin-key.json"
  
);
console.log("Looking for Firebase key at:", keyPath);
let serviceAccount = null;

try {
  const raw = fs.readFileSync(keyPath, "utf8");
  serviceAccount = JSON.parse(raw);
} catch {
  try {
    const alt = fs.readFileSync(
      path.resolve(process.cwd(), "server", "firebase-admin-key.json"),
      "utf8"
    );
    serviceAccount = JSON.parse(alt);
  } catch {
    console.warn(
      "Firebase service account key not found. Using default credentials."
    );
  }
}

if (!getApps().length) {
  initializeApp({
    credential: serviceAccount
      ? cert(serviceAccount)
      : undefined,

    storageBucket:
      process.env.FIREBASE_STORAGE_BUCKET ||
      "airaspark-website.firebasestorage.app",
  });
}

export const auth = getAuth();
export const firestore = getFirestore();
export const storage = getStorage();

export default {
  auth,
  firestore,
  storage,
};