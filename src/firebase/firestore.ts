import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { firebaseApp } from "./config";

export const db: Firestore = getFirestore(firebaseApp);

export const storage: FirebaseStorage = getStorage(firebaseApp);