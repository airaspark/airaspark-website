import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "@/firebase";
import { COLLECTIONS } from "@/utils/constants";
import { serverTimestamp, timestampToIso } from "@/services/idGenerator.service";
import type { UserProfile, UserRole } from "@/types";
import { getAdminByUid } from "@/services/admin.service";
import { getStaffByUid } from "@/services/staff.service";
import { getCustomerByFirebaseUid } from "@/services/customer.service";

function mapUserDoc(uid: string, data: Record<string, unknown>): UserProfile {
  return {
    uid,
    email: (data.email as string) ?? null,
    phone: (data.phone as string) ?? null,
    displayName: (data.displayName as string) ?? null,
    photoURL: (data.photoURL as string) ?? null,
    role: (data.role as UserRole) ?? "pending",
    entityId: (data.entityId as string) ?? null,
    isLinked: Boolean(data.isLinked),
    createdAt: timestampToIso(data.createdAt as never),
    updatedAt: timestampToIso(data.updatedAt as never),
    lastLoginAt: data.lastLoginAt
      ? timestampToIso(data.lastLoginAt as never)
      : null,
  };
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const ref = doc(db, COLLECTIONS.users, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return mapUserDoc(uid, snap.data());
}

export async function createUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<UserProfile> {
  const now = serverTimestamp();
  const payload = {
    uid,
    email: data.email ?? null,
    phone: data.phone ?? null,
    displayName: data.displayName ?? null,
    photoURL: data.photoURL ?? null,
    role: data.role ?? "pending",
    entityId: data.entityId ?? null,
    isLinked: data.isLinked ?? false,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
  };

  await setDoc(doc(db, COLLECTIONS.users, uid), payload);
  return mapUserDoc(uid, { ...payload, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), lastLoginAt: new Date().toISOString() });
}

export async function createOrUpdateStaffUserProfile(
  uid: string,
  data: {
    email: string;
    phone: string;
    displayName: string | null;
    photoURL: string | null;
    staffId: string;
  }
): Promise<UserProfile> {
  const existing = await getUserProfile(uid);
  const payload: Partial<UserProfile> = {
    email: data.email,
    phone: data.phone,
    displayName: data.displayName,
    photoURL: data.photoURL,
    role: "staff",
    entityId: data.staffId,
    isLinked: true,
    lastLoginAt: new Date().toISOString(),
  };

  if (existing) {
    await updateUserProfile(uid, payload);
    return (await getUserProfile(uid))!;
  }

  return createUserProfile(uid, payload);
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Omit<UserProfile, "uid" | "createdAt">>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.users, uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function upsertUserFromAuth(
  uid: string,
  authData: {
    email: string | null;
    phone: string | null;
    displayName: string | null;
    photoURL: string | null;
  }
): Promise<UserProfile> {

 const existing = await getUserProfile(uid);

if (existing) {

 await updateUserProfile(uid, {
  email: authData.email ?? existing.email,
  phone: authData.phone ?? existing.phone,
  displayName: authData.displayName ?? existing.displayName,
  photoURL: authData.photoURL ?? existing.photoURL,
  lastLoginAt: new Date().toISOString(),
});

  // If already linked, just return it
  if (existing.role !== "pending") {
    return (await getUserProfile(uid))!;
  }

}

// ------------------------
// ADMIN
// ------------------------

const admin = await getAdminByUid(uid);

if (admin) {

  if (existing) {

   await updateUserProfile(uid, {
  role: "admin",
  entityId: admin.adminId,
  isLinked: true,
  email: authData.email ?? existing.email,
  phone: authData.phone ?? existing.phone,
  displayName: authData.displayName ?? existing.displayName,
  photoURL: authData.photoURL ?? existing.photoURL,
  lastLoginAt: new Date().toISOString(),
});

    return (await getUserProfile(uid))!;
  }

  return createUserProfile(uid, {
    ...authData,
    role: "admin",
    entityId: admin.adminId,
    isLinked: true,
  });
}

console.log("❌ Admin NOT found");

  // ------------------------
// STAFF
// ------------------------

const staff = await getStaffByUid(uid);

if (staff) {

  if (existing) {
   await updateUserProfile(uid, {
  role: "staff",
  entityId: staff.staffId,
  isLinked: true,
  email: authData.email ?? existing.email,
  phone: authData.phone ?? existing.phone,
  displayName: authData.displayName ?? existing.displayName,
  photoURL: authData.photoURL ?? existing.photoURL,
  lastLoginAt: new Date().toISOString(),
});

    return (await getUserProfile(uid))!;
  }

  return createUserProfile(uid, {
    ...authData,
    role: "staff",
    entityId: staff.staffId,
    isLinked: true,
  });
}
  // ------------------------
// CUSTOMER
// ------------------------

const customer = await getCustomerByFirebaseUid(uid);

if (customer) {

  if (existing) {
   await updateUserProfile(uid, {
  role: "customer",
  entityId: customer.customerId,
  isLinked: true,
  email: authData.email ?? existing.email,
  phone: authData.phone ?? existing.phone,
  displayName: authData.displayName ?? existing.displayName,
  photoURL: authData.photoURL ?? existing.photoURL,
  lastLoginAt: new Date().toISOString(),
});

    return (await getUserProfile(uid))!;
  }

  return createUserProfile(uid, {
    ...authData,
    role: "customer",
    entityId: customer.customerId,
    isLinked: true,
  });
}

  // NEW USER
  return createUserProfile(uid, {
    ...authData,
    role: "pending",
    isLinked: false,
  });
}

export async function getUserByEntityId(
  entityId: string
): Promise<UserProfile | null> {
  const q = query(
    collection(db, COLLECTIONS.users),
    where("entityId", "==", entityId),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return mapUserDoc(docSnap.id, docSnap.data());
}

export async function linkUserToCustomer(
  uid: string,
  customerId: string
): Promise<void> {
  await updateUserProfile(uid, {
    entityId: customerId,
    role: "customer",
    isLinked: true,
    lastLoginAt: new Date().toISOString(),
  });
}

export async function linkUserToStaff(
  uid: string,
  staffId: string
): Promise<void> {
  await updateUserProfile(uid, {
    entityId: staffId,
    role: "staff",
    isLinked: true,
    lastLoginAt: new Date().toISOString(),
  });
}

export async function linkUserToAdmin(
  uid: string,
  adminId: string
): Promise<void> {
  await updateUserProfile(uid, {
    entityId: adminId,
    role: "admin",
    isLinked: true,
    lastLoginAt: new Date().toISOString(),
  });
}
