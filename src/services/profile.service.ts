import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import {
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

import { storage } from "@/firebase/firestore";
import { db } from "@/firebase/firestore";

export type ProfileRole = "admin" | "staff";

interface UploadProfilePhotoOptions {
  role: ProfileRole;
  documentId: string;
  profileId: string;
  file: File;
}

/**
 * Upload profile image
 */
export async function uploadProfilePhoto({
  role,
  documentId,
  profileId,
  file,
}: UploadProfilePhotoOptions): Promise<string> {
  const extension = file.name.split(".").pop() || "jpg";

  const storageRef = ref(
    storage,
    `profile-images/${role}/${profileId}.${extension}`
  );

  await uploadBytes(storageRef, file);

  const downloadURL = await getDownloadURL(storageRef);

  // Update Admin / Staff collection
  await updateDoc(doc(db, `${role}s`, documentId), {
    profilePhoto: downloadURL,
    updatedAt: new Date().toISOString(),
  });

  // Update Users collection
  await updateDoc(doc(db, "users", documentId), {
    profilePhoto: downloadURL,
    updatedAt: new Date().toISOString(),
  });

  return downloadURL;
}

/**
 * Delete profile image
 */
export async function deleteProfilePhoto(
  role: ProfileRole,
  documentId: string,
  profileId: string
) {
  const firestoreRef = doc(db, `${role}s`, documentId);

  const snapshot = await getDoc(firestoreRef);

  if (!snapshot.exists()) return;

  const data = snapshot.data();

  const profilePhoto = data.profilePhoto as string | undefined;

  if (profilePhoto) {
    try {
      const extension = profilePhoto.split(".").pop()?.split("?")[0] || "jpg";

      const storageRef = ref(
        storage,
        `profile-images/${role}/${profileId}.${extension}`
      );

      await deleteObject(storageRef);
    } catch {
      // Ignore missing storage file
    }
  }

  // Remove from Admin / Staff
  await updateDoc(doc(db, `${role}s`, documentId), {
    profilePhoto: null,
    updatedAt: new Date().toISOString(),
  });

  // Remove from Users
  await updateDoc(doc(db, "users", documentId), {
    profilePhoto: null,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Update photo URL only
 */
export async function updateProfilePhotoUrl(
  role: ProfileRole,
  documentId: string,
  photoURL: string
) {
  await updateDoc(doc(db, `${role}s`, documentId), {
    profilePhoto: photoURL,
    updatedAt: new Date().toISOString(),
  });

  await updateDoc(doc(db, "users", documentId), {
    profilePhoto: photoURL,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Get profile photo
 */
export async function getProfilePhoto(
  role: ProfileRole,
  documentId: string
): Promise<string | null> {
  const snapshot = await getDoc(doc(db, `${role}s`, documentId));

  if (!snapshot.exists()) return null;

  return (snapshot.data().profilePhoto as string) ?? null;
}