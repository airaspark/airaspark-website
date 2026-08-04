import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import { storage } from "@/firebase/firestore";

export async function uploadReceiptPDF(
  receiptId: string,
  file: File
): Promise<string> {

  const storageRef = ref(
    storage,
    `receipts/${receiptId}/${Date.now()}-${file.name}`
  );

  await uploadBytes(storageRef, file);

  return getDownloadURL(storageRef);
}