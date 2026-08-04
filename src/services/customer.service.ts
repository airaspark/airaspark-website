import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  limit,
  addDoc,
  orderBy,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import bcrypt from "bcryptjs";
import { db, storage } from "@/firebase";
import { COLLECTIONS } from "@/utils/constants";
import { timestampToIso } from "@/services/idGenerator.service";
import type { Customer, DocumentRecord, Review } from "@/types";

function mapCustomerDoc(
  id: string,
  data: Record<string, unknown>
): Customer {
  return {
    id,
    customerId: data.customerId as string,
    firebaseUid: (data.firebaseUid as string) ?? null,
    authEmail: data.authEmail as string,
    passwordHash: data.passwordHash as string,
    name: data.name as string,
    company: data.company as string,
    email: data.email as string,
    phone: data.phone as string,
    website: (data.website as string) ?? "",
    gst: (data.gst as string) ?? "",
    industry: (data.industry as string) ?? "",
    assignedStaffIds: (data.assignedStaffIds as string[]) ?? [],
    isActive: data.isActive !== false,
    createdAt: timestampToIso(data.createdAt as never),
    updatedAt: timestampToIso(data.updatedAt as never),
  };
}

export async function getCustomerByCustomerId(
  customerId: string
): Promise<Customer | null> {

  const q = query(
    collection(db, COLLECTIONS.customers),
    where("customerId", "==", customerId.toUpperCase()),
    limit(1)
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  return mapCustomerDoc(
    snap.docs[0].id,
    snap.docs[0].data()
  );
}

export async function getCustomerByFirebaseUid(
  firebaseUid: string
): Promise<Customer | null> {

  const q = query(
    collection(db, COLLECTIONS.customers),
    where("firebaseUid", "==", firebaseUid),
    limit(1)
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  return mapCustomerDoc(
    snap.docs[0].id,
    snap.docs[0].data()
  );
}

export async function getCustomerByPhone(
  phone: string
): Promise<Customer | null> {

  const q = query(
    collection(db, COLLECTIONS.customers),
    where("phone", "==", phone),
    limit(1)
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  return mapCustomerDoc(
    snap.docs[0].id,
    snap.docs[0].data()
  );
}

export async function verifyCustomerPassword(
  customer: Customer,
  password: string
): Promise<boolean> {

  return bcrypt.compare(
    password,
    customer.passwordHash
  );
}

export async function linkCustomerToFirebase(
  customerDocId: string,
  firebaseUid: string
): Promise<void> {

  await updateDoc(
    doc(db, COLLECTIONS.customers, customerDocId),
    {
      firebaseUid,
      updatedAt: new Date().toISOString(),
    }
  );
}

export async function hashPassword(
  password: string
): Promise<string> {

  return bcrypt.hash(password, 12);
}

export function isValidCustomerIdFormat(
  customerId: string
): boolean {

  return /^ASC-\d{4}-\d{3}$/i.test(
    customerId.trim()
  );
}

export async function getCustomers(): Promise<Customer[]> {

  const q = query(
    collection(db, COLLECTIONS.customers),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) =>
    mapCustomerDoc(
      docSnap.id,
      docSnap.data()
    )
  );
}

export async function addCustomer(customer: any) {

  return await addDoc(
    collection(db, COLLECTIONS.customers),
    {
      ...customer,
      createdAt: new Date(),
    }
  );
}

export async function updateCustomer(
  id: string,
  customer: Partial<Customer>
): Promise<void> {

  await updateDoc(
    doc(db, COLLECTIONS.customers, id),
    {
      ...customer,
      updatedAt: new Date(),
    }
  );
}

export async function deleteCustomer(
  id: string
): Promise<void> {

  await deleteDoc(
    doc(db, COLLECTIONS.customers, id)
  );
}

export async function getDocumentsByCustomer(
  customerId: string
): Promise<DocumentRecord[]> {
  const q = query(
    collection(db, COLLECTIONS.documents),
    where("customerId", "==", customerId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as Record<string, unknown>;
    return {
      id: docSnap.id,
      documentId: data.documentId as string,
      projectId: (data.projectId as string) ?? "",
      customerId: data.customerId as string,
      name: data.name as string,
      type: data.type as string,
      storagePath: data.storagePath as string,
      uploadedBy: data.uploadedBy as string,
      downloadUrl: data.downloadUrl as string,
      createdAt: timestampToIso(data.createdAt as never),
      updatedAt: timestampToIso(data.updatedAt as never),
    };
  });
}

export async function uploadCustomerDocument(
  customerId: string,
  file: File,
  uploadedBy: string
): Promise<DocumentRecord> {
  const storageRef = ref(
    storage,
    `documents/${customerId}/${Date.now()}-${file.name}`
  );

  await uploadBytes(storageRef, file);

  const downloadUrl = await getDownloadURL(storageRef);

  const documentId = `DOC-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

  const docRef = await addDoc(
    collection(db, COLLECTIONS.documents),
    {
      documentId,
      customerId,
      projectId: "",
      name: file.name,
      type: file.type || "document",
      storagePath: storageRef.fullPath,
      downloadUrl,
      uploadedBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  return {
    id: docRef.id,
    documentId,
    customerId,
    projectId: "",
    name: file.name,
    type: file.type || "document",
    storagePath: storageRef.fullPath,
    uploadedBy,
    downloadUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function getReviewsByCustomer(
  customerId: string
): Promise<Review[]> {
  const q = query(
    collection(db, COLLECTIONS.reviews),
    where("customerId", "==", customerId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as Record<string, unknown>;
    return {
      id: docSnap.id,
      reviewId: data.reviewId as string,
      name: data.name as string,
      company: data.company as string,
      email: data.email as string,
      content: data.content as string,
      rating: (data.rating as number) ?? null,
      status: (data.status as string) as Review["status"],
      customerId: (data.customerId as string | null) ?? null,
      isPublic: Boolean(data.isPublic),
      createdAt: timestampToIso(data.createdAt as never),
      updatedAt: timestampToIso(data.updatedAt as never),
    };
  });
}

export async function getCustomerById(
  id: string
): Promise<Customer | null> {

  const ref = doc(
    db,
    COLLECTIONS.customers,
    id
  );

  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return mapCustomerDoc(
    snap.id,
    snap.data()
  );
}