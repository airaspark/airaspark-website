import {
  collection,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";

import { db } from "@/firebase";
import { COLLECTIONS } from "@/utils/constants";
import { timestampToIso } from "@/services/idGenerator.service";

export interface Admin {
  id: string;
  adminId: string;
  firebaseUid: string | null;
  name: string;
  email: string;
  password: string;
  role: "admin";
  active: boolean;
  createdAt: string;
}

function mapAdminDoc(
  id: string,
  data: Record<string, unknown>
): Admin {
  return {
    id,
    adminId: data.adminId as string,
    firebaseUid: (data.firebaseUid as string) ?? null,
    name: data.name as string,
    email: data.email as string,
    password: (data.password as string) ?? "",
    role: "admin",
    active: (data.active as boolean) ?? true,
    createdAt: timestampToIso(data.createdAt as never),
  };
}

export async function getAdminByUid(
  uid: string
): Promise<Admin | null> {

  const q = query(
    collection(db, COLLECTIONS.admins),
    where("firebaseUid", "==", uid),
    limit(1)
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  return mapAdminDoc(snap.docs[0].id, snap.docs[0].data());
}

export async function getAdminByAdminId(
  adminId: string
): Promise<(Admin & Record<string, unknown>) | null> {

  const q = query(
    collection(db, COLLECTIONS.admins),
    where("adminId", "==", adminId),
    limit(1)
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  return {
    id: snap.docs[0].id,
    ...(snap.docs[0].data() as Record<string, unknown>),
  } as Admin & Record<string, unknown>;
}

export async function verifyAdminPassword(
  admin: Record<string, unknown>,
  password: string
): Promise<boolean> {

  return admin.password === password;
}