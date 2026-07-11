import { getStorage, type FirebaseStorage } from "firebase/storage";
import { firebaseApp } from "./config";

export const storage: FirebaseStorage = getStorage(firebaseApp);

export function getStoragePath(folder: string, filename: string): string {
  return `${folder}/${filename}`;
}
