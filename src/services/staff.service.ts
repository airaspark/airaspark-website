import {
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/firebase";
import { COLLECTIONS } from "@/utils/constants";
import { timestampToIso } from "@/services/idGenerator.service";
import {
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";


export interface Staff {
  id: string;
  staffId: string;
  firebaseUid: string | null;
  name: string;
  email: string;
  role: "staff";
  active: boolean;
  createdAt: string;
}

function mapStaffDoc(
  id: string,
  data: Record<string, unknown>
): Staff {
  return {
    id,
    staffId: data.staffId as string,
    firebaseUid: (data.firebaseUid as string) ?? null,
    name: data.name as string,
    email: data.email as string,
    role: "staff",
    active: (data.active as boolean) ?? true,
    createdAt: timestampToIso(data.createdAt as never),
  };
}

export async function getStaffByEmail(
  email: string
): Promise<Staff | null> {

  const q = query(
    collection(db, COLLECTIONS.staff),
    where("email", "==", email),
    limit(1)
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  const docSnap = snap.docs[0];

  return mapStaffDoc(docSnap.id, docSnap.data());
}

export async function getStaffByUid(
  uid: string
): Promise<Staff | null> {

  const q = query(
    collection(db, COLLECTIONS.staff),
    where("firebaseUid", "==", uid),
    limit(1)
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  const docSnap = snap.docs[0];

  return mapStaffDoc(docSnap.id, docSnap.data());
}

export async function getStaff() {
  const q = query(
    collection(db, COLLECTIONS.staff),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) =>
    mapStaffDoc(docSnap.id, docSnap.data())
  );
}

export async function createStaff(data: Record<string, unknown>) {
  return await addDoc(
    collection(db, COLLECTIONS.staff),
    {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );
}

export async function updateStaff(
  id: string,
  data: Record<string, unknown>
) {
  return await updateDoc(
    doc(db, COLLECTIONS.staff, id),
    {
      ...data,
      updatedAt: new Date(),
    }
  );
}

export async function deleteStaff(
  id: string
) {
  return await deleteDoc(
    doc(db, COLLECTIONS.staff, id)
  );
}

export async function getStaffByStaffId(
  staffId: string
): Promise<(Staff & Record<string, unknown>) | null> {

  console.log("Searching staff:", staffId);

  const q = query(
    collection(db, COLLECTIONS.staff),
    where("staffId", "==", staffId),
    limit(1)
  );

  console.log("About to query Firestore...");

  try {
    const snap = await getDocs(q);

   console.log("Empty:", snap.empty);

if (!snap.empty) {
  console.log("Staff data:", snap.docs[0].data());
}
    if (snap.empty) return null;

    const docSnap = snap.docs[0];

    return {
      id: docSnap.id,
      ...(docSnap.data() as Record<string, unknown>),
    } as Staff & Record<string, unknown>;

  } catch (e) {
    console.error("🔥 Firestore Error:", e);
    throw e;
  }
}

export async function verifyStaffPassword(
  staff: Record<string, unknown>,
  password: string
): Promise<boolean> {

  return staff.password === password;
}

export async function completeStaffProfile(
  id: string,
  data: {
    name: string;
    email: string;
    phone: string;
    firebaseUid: string;
    googleLinked?: boolean;
  }
) {
  return await updateDoc(
    doc(db, COLLECTIONS.staff, id),
    {
      name: data.name,
      email: data.email,
      phone: data.phone,
      firebaseUid: data.firebaseUid,
      profileCompleted: true,
      googleLinked: data.googleLinked ?? false,
      updatedAt: new Date(),
    }
  );
}