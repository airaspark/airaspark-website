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

import bcrypt from "bcryptjs";
import { db } from "@/firebase";
import { COLLECTIONS } from "@/utils/constants";
import { timestampToIso } from "@/services/idGenerator.service";
import type { Customer } from "@/types";

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