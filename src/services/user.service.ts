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
import { getStaffByUid, getStaffByEmail, getStaffByPhone } from "@/services/staff.service";
import { getCustomerByFirebaseUid, getCustomerByPhone } from "@/services/customer.service";

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

function normalizeEmail(email: string | null | undefined): string | null {
  const trimmed = email?.trim().toLowerCase();
  return trimmed ? trimmed : null;
}

function normalizePhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const trimmed = phone.trim();
  if (!trimmed) return null;
  const compact = trimmed.replace(/[\s-]/g, "");
  const digits = compact.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  if (compact.startsWith("+")) return compact;
  if (compact.startsWith("91") && compact.length > 10) return `+${compact}`;
  return compact;
}

function buildPhoneCandidates(phone: string | null | undefined): string[] {
  const candidates = new Set<string>();
  if (!phone) return [];
  const trimmed = phone.trim();
  if (!trimmed) return [];
  candidates.add(trimmed);
  const compact = trimmed.replace(/[\s-]/g, "");
  if (compact) candidates.add(compact);
  const normalized = normalizePhone(trimmed);
  if (normalized) candidates.add(normalized);
  const digits = normalized?.replace(/^\+/, "") ?? null;
  if (digits) candidates.add(digits);
  if (digits?.startsWith("91")) candidates.add(digits.slice(2));
  return Array.from(candidates);
}

async function findDocByField(
  collectionName: string,
  field: string,
  value: string
): Promise<{ id: string; data: Record<string, unknown> } | null> {
  const q = query(collection(db, collectionName), where(field, "==", value), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, data: snap.docs[0].data() as Record<string, unknown> };
}

async function findAdminMatch(
  uid: string,
  email: string | null,
  phone: string | null
): Promise<{ id: string; data: Record<string, unknown> } | null> {
  const adminByUid = await getAdminByUid(uid);
  if (adminByUid) return { id: adminByUid.id, data: adminByUid as unknown as Record<string, unknown> };

  if (email) {
    const byEmail = await findDocByField(COLLECTIONS.admins, "email", email);
    if (byEmail) return byEmail;
  }

  for (const candidate of buildPhoneCandidates(phone)) {
    const byPhone = await findDocByField(COLLECTIONS.admins, "phone", candidate);
    if (byPhone) return byPhone;
  }

  return null;
}

async function findStaffMatch(
  uid: string,
  email: string | null,
  phone: string | null
): Promise<{ id: string; data: Record<string, unknown> } | null> {
  const staffByUid = await getStaffByUid(uid);
  if (staffByUid) return { id: staffByUid.id, data: staffByUid as unknown as Record<string, unknown> };

  if (email) {
    const byEmail = await getStaffByEmail(email);
    if (byEmail) return { id: byEmail.id, data: byEmail as unknown as Record<string, unknown> };
  }

  for (const candidate of buildPhoneCandidates(phone)) {
    const byPhone = await getStaffByPhone(candidate);
    if (byPhone) return { id: byPhone.id, data: byPhone as Record<string, unknown> };
  }

  return null;
}

async function findCustomerMatch(
  uid: string,
  email: string | null,
  phone: string | null
): Promise<{ id: string; data: Record<string, unknown> } | null> {
  const customerByUid = await getCustomerByFirebaseUid(uid);
  if (customerByUid) return { id: customerByUid.id, data: customerByUid as unknown as Record<string, unknown> };

  if (email) {
    const byAuthEmail = await findDocByField(COLLECTIONS.customers, "authEmail", email);
    if (byAuthEmail) return byAuthEmail;
    const byEmail = await findDocByField(COLLECTIONS.customers, "email", email);
    if (byEmail) return byEmail;
  }

  for (const candidate of buildPhoneCandidates(phone)) {
    const byPhone = await getCustomerByPhone(candidate);
    if (byPhone) return { id: byPhone.id, data: byPhone as unknown as Record<string, unknown> };
  }

  return null;
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
  const normalizedEmail = normalizeEmail(authData.email);
  const normalizedPhone = normalizePhone(authData.phone);

  const admin = await findAdminMatch(uid, normalizedEmail, normalizedPhone);
  if (admin) {
    if ((admin.data.firebaseUid as string | null) !== uid) {
      await updateDoc(doc(db, COLLECTIONS.admins, admin.id), {
        firebaseUid: uid,
        updatedAt: serverTimestamp(),
      });
    }

    if (existing) {
      await updateUserProfile(uid, {
        role: "admin",
        entityId: admin.data.adminId as string,
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
      entityId: admin.data.adminId as string,
      isLinked: true,
    });
  }

  const staff = await findStaffMatch(uid, normalizedEmail, normalizedPhone);
  if (staff) {
    if ((staff.data.firebaseUid as string | null) !== uid) {
      await updateDoc(doc(db, COLLECTIONS.staff, staff.id), {
        firebaseUid: uid,
        updatedAt: serverTimestamp(),
      });
    }

    if (existing) {
      await updateUserProfile(uid, {
        role: "staff",
        entityId: staff.data.staffId as string,
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
      entityId: staff.data.staffId as string,
      isLinked: true,
    });
  }

  const customer = await findCustomerMatch(uid, normalizedEmail, normalizedPhone);
  if (customer) {
    if ((customer.data.firebaseUid as string | null) !== uid) {
      await updateDoc(doc(db, COLLECTIONS.customers, customer.id), {
        firebaseUid: uid,
        updatedAt: serverTimestamp(),
      });
    }

    if (existing) {
      await updateUserProfile(uid, {
        role: "customer",
        entityId: customer.data.customerId as string,
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
  email: authData.email,
  phone: authData.phone,
  displayName: customer.data.name as string,
  photoURL: authData.photoURL,
  role: "customer",
  entityId: customer.data.customerId as string,
  isLinked: true,
});
  }

  if (existing) {
    await updateUserProfile(uid, {
      role: "pending",
      entityId: null,
      isLinked: false,
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
    role: "pending",
    entityId: null,
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
