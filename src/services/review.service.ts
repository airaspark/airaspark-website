import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

export interface Review {
  id?: string;
  fullName: string;
  companyName?: string;
  email: string;
  review: string;
  rating: number;

  approved: boolean;
  rejected: boolean;
  featured: boolean;

  createdAt?: unknown;
  approvedAt?: unknown;
  approvedBy?: string;
}

const reviewsCollection = collection(db, "reviews");

/* ---------------------------------------- */
/* Submit Review                            */
/* ---------------------------------------- */

export async function submitReview(
  data: Omit<
    Review,
    | "id"
    | "approved"
    | "rejected"
    | "featured"
    | "createdAt"
    | "approvedAt"
    | "approvedBy"
  >
) {
  return await addDoc(reviewsCollection, {
    ...data,

    approved: false,
    rejected: false,
    featured: false,

    createdAt: serverTimestamp(),
    approvedAt: null,
    approvedBy: null,
  });
}

/* ---------------------------------------- */
/* Approved Reviews                         */
/* ---------------------------------------- */

export async function getApprovedReviews() {
  const q = query(
    reviewsCollection,
    where("approved", "==", true),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Review[];
}

/* ---------------------------------------- */
/* Pending Reviews                          */
/* ---------------------------------------- */

export async function getPendingReviews() {
  const q = query(
    reviewsCollection,
    where("approved", "==", false),
    where("rejected", "==", false),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Review[];
}

/* ---------------------------------------- */
/* Approve Review                           */
/* ---------------------------------------- */

export async function approveReview(
  reviewId: string,
  adminId: string
) {
  const reviewRef = doc(db, "reviews", reviewId);

  await updateDoc(reviewRef, {
    approved: true,
    approvedAt: serverTimestamp(),
    approvedBy: adminId,
  });
}

/* ---------------------------------------- */
/* Reject Review                            */
/* ---------------------------------------- */

export async function rejectReview(reviewId: string) {
  const reviewRef = doc(db, "reviews", reviewId);

  await updateDoc(reviewRef, {
    rejected: true,
  });
}

/* ---------------------------------------- */
/* Delete Review                            */
/* ---------------------------------------- */

export async function deleteReview(reviewId: string) {
  await deleteDoc(doc(db, "reviews", reviewId));
}