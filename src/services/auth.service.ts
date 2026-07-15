  import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signInWithPhoneNumber,
  linkWithCredential,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  type User,
  type ConfirmationResult,
} from "firebase/auth";

import { doc, updateDoc } from "firebase/firestore";

import {
  auth,
  googleProvider,
  getRecaptchaVerifier,
  clearRecaptchaVerifier,
  db,
} from "@/firebase";

import {
  upsertUserFromAuth,
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  linkUserToCustomer,
  linkUserToStaff,
  linkUserToAdmin,
} from "@/services/user.service";

import { COLLECTIONS } from "@/utils/constants";

import {
  getCustomerByCustomerId,
  verifyCustomerPassword,
  linkCustomerToFirebase,
  getCustomerByPhone,
} from "@/services/customer.service";

import {
  getStaffByStaffId,
  verifyStaffPassword,
  getStaffByPhone,
} from "@/services/staff.service";

import {
  getAdminByAdminId,
  verifyAdminPassword,
  getAdminByPhone,
} from "@/services/admin.service";

import { setRememberMePreference } from "@/utils/session";

import type { UserProfile } from "@/types";

  export async function setAuthPersistence(rememberMe: boolean): Promise<void> {
    setRememberMePreference(rememberMe);
    await setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence
    );
  }

  const PORTAL_ID_PATTERNS = {
    admin: /^ADM-\d{4}-\d{3}$/i,
    staff: /^STF-\d{4}-\d{3}$/i,
    customer: /^ASC-\d{4}-\d{3}$/i,
  } as const;

  function getPortalRoleFromId(loginId: string): "admin" | "staff" | "customer" | null {
    const normalized = loginId.trim().toUpperCase();
    if (PORTAL_ID_PATTERNS.admin.test(normalized)) return "admin";
    if (PORTAL_ID_PATTERNS.staff.test(normalized)) return "staff";
    if (PORTAL_ID_PATTERNS.customer.test(normalized)) return "customer";
    return null;
  }

  function isPortalAccountActive(account: any): boolean {
    const status = typeof account?.status === "string" ? account.status.toLowerCase() : undefined;
    if (status) {
      return status === "active";
    }
    if (typeof account?.isActive === "boolean") {
      return account.isActive;
    }
    if (typeof account?.active === "boolean") {
      return account.active;
    }
    return true;
  }

  async function linkPortalRecordToFirebase(
    collectionName: string,
    recordId: string,
    uid: string
  ): Promise<void> {
    await updateDoc(doc(db, collectionName, recordId), {
      firebaseUid: uid,
      updatedAt: new Date().toISOString(),
    });
  }

  export async function signInWithGoogle(
    rememberMe = true
  ): Promise<UserProfile> {
    await setAuthPersistence(rememberMe);
    const result = await signInWithPopup(auth, googleProvider);
    return upsertUserFromAuth(result.user.uid, {
      email: result.user.email,
      phone: result.user.phoneNumber,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
    });
  }

  export async function signInWithEmail(
    email: string,
    password: string,
    rememberMe = true
  ): Promise<UserProfile> {
    await setAuthPersistence(rememberMe);
    const result = await signInWithEmailAndPassword(auth, email, password);
    return upsertUserFromAuth(result.user.uid, {
      email: result.user.email,
      phone: result.user.phoneNumber,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
    });
  }

  export async function signUpWithEmail(
    email: string,
    password: string
  ): Promise<UserProfile> {
    await setAuthPersistence(true);
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return upsertUserFromAuth(result.user.uid, {
      email: result.user.email,
      phone: result.user.phoneNumber,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
    });
  }

  export async function sendPhoneOtp(
    phoneNumber: string,
    recaptchaContainerId: string
  ): Promise<ConfirmationResult> {

    const verifier = getRecaptchaVerifier(recaptchaContainerId);

    let formattedPhone = phoneNumber.trim();

    // Remove spaces and dashes
    formattedPhone = formattedPhone.replace(/[\s-]/g, "");

    // Convert Indian number to E.164
    if (!formattedPhone.startsWith("+")) {
      if (formattedPhone.startsWith("91") && formattedPhone.length === 12) {
        formattedPhone = `+${formattedPhone}`;
      } else {
        formattedPhone = `+91${formattedPhone}`;
      }
    }

    return signInWithPhoneNumber(
      auth,
      formattedPhone,
      verifier
    );
  }

  export async function verifyPhoneOtp(
  confirmationResult: ConfirmationResult,
  otp: string,
  rememberMe = true
): Promise<UserProfile> {

  await setAuthPersistence(rememberMe);

  const result = await confirmationResult.confirm(otp);

  clearRecaptchaVerifier();

  const uid = result.user.uid;
const phone = result.user.phoneNumber;

if (!phone) {
  throw new Error("Phone number not found.");
}

// Remove +91 before searching Firestore
const normalizedPhone = phone.replace("+91", "");

console.log("Firebase Phone:", phone);
console.log("Normalized Phone:", normalizedPhone);

  // ---------------------------------
  // ADMIN
  // ---------------------------------

  const admin = await getAdminByPhone(normalizedPhone);

console.log("Admin:", admin);

  if (admin) {
    await linkPortalRecordToFirebase(COLLECTIONS.admins, admin.id, uid);

    let profile = await getUserProfile(uid);

    if (!profile) {
      profile = await createUserProfile(uid, {
        email: admin.email,
        phone,
        displayName: admin.name,
        photoURL: result.user.photoURL,
        role: "admin",
        entityId: admin.adminId,
        isLinked: true,
      });
    } else {
      await updateUserProfile(uid, {
        role: "admin",
        entityId: admin.adminId,
        phone,
        isLinked: true,
      });
      profile = (await getUserProfile(uid))!;
    }

    return profile;
  }

  // ---------------------------------
  // STAFF
  // ---------------------------------

  const staff = await getStaffByPhone(normalizedPhone);

console.log("Staff:", staff);

  if (staff) {
    await linkPortalRecordToFirebase(COLLECTIONS.staff, staff.id, uid);

    let profile = await getUserProfile(uid);

    if (!profile) {
      profile = await createUserProfile(uid, {
        email: staff.email,
        phone,
        displayName: staff.name,
        photoURL: result.user.photoURL,
        role: "staff",
        entityId: staff.staffId,
        isLinked: true,
      });
    } else {
      await updateUserProfile(uid, {
        role: "staff",
        entityId: staff.staffId,
        phone,
        isLinked: true,
      });
      profile = (await getUserProfile(uid))!;
    }

    return profile;
  }

  // ---------------------------------
  // CUSTOMER
  // ---------------------------------

  const customer = await getCustomerByPhone(normalizedPhone);

console.log("Customer:", customer);
  if (customer) {

    await linkCustomerToFirebase(customer.id, uid);

    let profile = await getUserProfile(uid);

    if (!profile) {

      profile = await createUserProfile(uid, {
        email: customer.email,
        phone,
        displayName: customer.name,
        photoURL: result.user.photoURL,
        role: "customer",
        entityId: customer.customerId,
        isLinked: true,
      });

    } else {

      await updateUserProfile(uid, {
        role: "customer",
        entityId: customer.customerId,
        phone,
        isLinked: true,
      });

      profile = (await getUserProfile(uid))!;
    }

    return profile;
  }

  // ---------------------------------
  // UNKNOWN PHONE
  // ---------------------------------

  throw new Error("This account is not linked to any portal.");
}

  export async function signInWithPortalId(
    loginId: string,
    password: string,
    rememberMe = true
  ): Promise<UserProfile> {
    loginId = loginId.trim().toUpperCase();

    const role = getPortalRoleFromId(loginId);
    if (!role) {
      throw new Error("Invalid Portal ID.");
    }

    if (role === "admin") {
      const admin = await getAdminByAdminId(loginId);
      if (!admin) throw new Error("Account not found.");
      if (!isPortalAccountActive(admin)) throw new Error("Inactive account.");
      const valid = await verifyAdminPassword(admin, password);
      if (!valid) throw new Error("Incorrect password.");
      await setAuthPersistence(rememberMe);
      const result = await signInWithEmailAndPassword(auth, admin.email, password);
      await linkPortalRecordToFirebase(COLLECTIONS.admins, admin.id, result.user.uid);
      return upsertUserFromAuth(result.user.uid, {
        email: result.user.email,
        phone: result.user.phoneNumber,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      });
    }

    if (role === "staff") {
      const staff = await getStaffByStaffId(loginId);
      if (!staff) throw new Error("Account not found.");
      if (!isPortalAccountActive(staff)) throw new Error("Inactive account.");
      const valid = await verifyStaffPassword(staff, password);
      if (!valid) throw new Error("Incorrect password.");
      if (!staff.profileCompleted) {
        sessionStorage.setItem("staffDocId", staff.id);
        sessionStorage.setItem("staffId", staff.staffId);
        throw new Error("FIRST_LOGIN");
      }
      await setAuthPersistence(rememberMe);
      const result = await signInWithEmailAndPassword(auth, staff.email as string, password);
      await linkPortalRecordToFirebase(COLLECTIONS.staff, staff.id, result.user.uid);
      return upsertUserFromAuth(result.user.uid, {
        email: result.user.email,
        phone: result.user.phoneNumber,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      });
    }

    const customer = await getCustomerByCustomerId(loginId);
    if (!customer) throw new Error("Account not found.");
    if (!isPortalAccountActive(customer)) throw new Error("Inactive account.");
    const valid = await verifyCustomerPassword(customer, password);
    if (!valid) throw new Error("Incorrect password.");
    await setAuthPersistence(rememberMe);
    const result = await signInWithEmailAndPassword(auth, customer.authEmail, password);
    await linkCustomerToFirebase(customer.id, result.user.uid);
    return upsertUserFromAuth(result.user.uid, {
      email: result.user.email ?? customer.email,
      phone: result.user.phoneNumber ?? customer.phone,
      displayName: result.user.displayName ?? customer.name,
      photoURL: result.user.photoURL,
    });
  }

  export async function linkPortalAccount(
    uid: string,
    portalId: string,
    password: string
  ): Promise<UserProfile> {
    const loginId = portalId.trim().toUpperCase();
    const role = getPortalRoleFromId(loginId);

    if (!role) {
      throw new Error("Invalid Portal ID. Expected: ADM-2026-001, STF-2026-001 or ASC-2026-001.");
    }

    if (role === "admin") {
      const admin = await getAdminByAdminId(loginId);
      if (!admin) throw new Error("Admin not found.");
      if (!isPortalAccountActive(admin)) throw new Error("Inactive account.");
      if (admin.firebaseUid && admin.firebaseUid !== uid) {
        throw new Error("This portal account is already linked to another user.");
      }
      const valid = await verifyAdminPassword(admin, password);
      if (!valid) throw new Error("Incorrect password.");
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("You must be signed in to link your account.");
      try {
        const credential = EmailAuthProvider.credential(admin.email, password);
        await linkWithCredential(currentUser, credential);
      } catch (err) {
        const code = (err as { code?: string }).code;
        if (code !== "auth/credential-already-in-use" && code !== "auth/email-already-in-use") {
          // Linking optional — Firestore mapping is the source of truth for portal access
        }
      }
      await linkPortalRecordToFirebase(COLLECTIONS.admins, admin.id, uid);
      await linkUserToAdmin(uid, admin.adminId);
      const profile = await getUserProfile(uid);
      if (!profile) throw new Error("Failed to load user profile after linking.");
      return profile;
    }

    if (role === "staff") {
      const staff = await getStaffByStaffId(loginId);
      if (!staff) throw new Error("Staff not found.");
      if (!isPortalAccountActive(staff)) throw new Error("Inactive account.");
      if (staff.firebaseUid && staff.firebaseUid !== uid) {
        throw new Error("This portal account is already linked to another user.");
      }
      const valid = await verifyStaffPassword(staff, password);
      if (!valid) throw new Error("Incorrect password.");
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("You must be signed in to link your account.");
      try {
        const credential = EmailAuthProvider.credential(staff.email as string, password);
        await linkWithCredential(currentUser, credential);
      } catch (err) {
        const code = (err as { code?: string }).code;
        if (code !== "auth/credential-already-in-use" && code !== "auth/email-already-in-use") {
          // Linking optional — Firestore mapping is the source of truth for portal access
        }
      }
      await linkPortalRecordToFirebase(COLLECTIONS.staff, staff.id, uid);
      await linkUserToStaff(uid, staff.staffId);
      const profile = await getUserProfile(uid);
      if (!profile) throw new Error("Failed to load user profile after linking.");
      return profile;
    }

    const customer = await getCustomerByCustomerId(loginId);
    if (!customer) throw new Error("Portal ID not found.");
    if (!isPortalAccountActive(customer)) throw new Error("Inactive account.");
    if (customer.firebaseUid && customer.firebaseUid !== uid) {
      throw new Error("This portal account is already linked to another user.");
    }
    const valid = await verifyCustomerPassword(customer, password);
    if (!valid) throw new Error("Incorrect password.");
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("You must be signed in to link your account.");
    try {
      const credential = EmailAuthProvider.credential(customer.authEmail, password);
      await linkWithCredential(currentUser, credential);
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code !== "auth/credential-already-in-use" && code !== "auth/email-already-in-use") {
        // Linking optional — Firestore mapping is the source of truth for portal access
      }
    }
    await linkPortalRecordToFirebase(COLLECTIONS.customers, customer.id, uid);
    await linkUserToCustomer(uid, customer.customerId);
    const profile = await getUserProfile(uid);
    if (!profile) throw new Error("Failed to load user profile after linking.");
    return profile;
  }

  export async function sendForgotPasswordEmail(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  export async function changeUserPassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error("No authenticated user found.");
    }

    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  }

  export async function signOut(): Promise<void> {
    clearRecaptchaVerifier();
    await firebaseSignOut(auth);
  }

  export function getCurrentFirebaseUser(): User | null {
    return auth.currentUser;
  }

  export { auth };
