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

import {
  auth,
  googleProvider,
  getRecaptchaVerifier,
  clearRecaptchaVerifier,
} from "@/firebase";

import {
  upsertUserFromAuth,
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  linkUserToCustomer,
} from "@/services/user.service";

import {
  getCustomerByCustomerId,
  verifyCustomerPassword,
  linkCustomerToFirebase,
  isValidCustomerIdFormat,
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

  return upsertUserFromAuth(uid, {
    email: result.user.email,
    phone,
    displayName: result.user.displayName,
    photoURL: result.user.photoURL,
  });
}

  export async function signInWithCustomerId(
    loginId: string,
    password: string,
    rememberMe = true
  ): Promise<UserProfile> {

    loginId = loginId.toUpperCase();

    // =========================
    // ADMIN
    // =========================
    if (loginId.startsWith("ADM-")) {

      const admin = await getAdminByAdminId(loginId);

      if (!admin)
        throw new Error("Admin not found.");

      const valid = await verifyAdminPassword(admin, password);

      if (!valid)
        throw new Error("Invalid Login ID or Password.");

      await setAuthPersistence(rememberMe);

      const result = await signInWithEmailAndPassword(
        auth,
        admin.email,
        password
      );

      return upsertUserFromAuth(result.user.uid, {
        email: result.user.email,
        phone: result.user.phoneNumber,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      });
    }

    // =========================
    // STAFF
    // =========================
    if (loginId.startsWith("STF-")) {

      const staff = await getStaffByStaffId(loginId);

      if (!staff)
        throw new Error("Staff ID not found.");

      const valid = await verifyStaffPassword(staff, password);

      if (!valid)
        throw new Error("Invalid Login ID or Password.");

      if (!staff.profileCompleted) {

        sessionStorage.setItem("staffDocId", staff.id);
        sessionStorage.setItem("staffId", staff.staffId);

        throw new Error("FIRST_LOGIN");
      }

      await setAuthPersistence(rememberMe);

      const result = await signInWithEmailAndPassword(
        auth,
        staff.email as string,
        password
      );

      return upsertUserFromAuth(result.user.uid, {
        email: result.user.email,
        phone: result.user.phoneNumber,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      });
    }

    // =========================
    // CUSTOMER
    // =========================

    if (!isValidCustomerIdFormat(loginId)) {
      throw new Error("Invalid Login ID.");
    }

    const customer = await getCustomerByCustomerId(loginId);

    if (!customer)
      throw new Error("Customer not found.");

    if (!customer.isActive)
      throw new Error("Customer account is inactive.");

    const valid = await verifyCustomerPassword(customer, password);

    if (!valid)
      throw new Error("Invalid Login ID or Password.");

    await setAuthPersistence(rememberMe);

    const result = await signInWithEmailAndPassword(
      auth,
      customer.authEmail,
      password
    );

    return upsertUserFromAuth(result.user.uid, {
      email: result.user.email ?? customer.email,
      phone: result.user.phoneNumber ?? customer.phone,
      displayName: result.user.displayName ?? customer.name,
      photoURL: result.user.photoURL,
    });
  }

  export async function linkCustomerAccount(
    uid: string,
    customerId: string,
    password: string
  ): Promise<UserProfile> {
    if (!isValidCustomerIdFormat(customerId)) {
      throw new Error("Invalid Customer ID format. Expected: ASC-2026-001");
    }

    const customer = await getCustomerByCustomerId(customerId);
    if (!customer) {
      throw new Error("Customer ID not found.");
    }
    if (customer.firebaseUid && customer.firebaseUid !== uid) {
      throw new Error("This Customer ID is already linked to another account.");
    }

    const valid = await verifyCustomerPassword(customer, password);
    if (!valid) {
      throw new Error("Invalid password for this Customer ID.");
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("You must be signed in to link your account.");
    }

    try {
      const credential = EmailAuthProvider.credential(
        customer.authEmail,
        password
      );
      await linkWithCredential(currentUser, credential);
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code !== "auth/credential-already-in-use" && code !== "auth/email-already-in-use") {
        // Linking optional — Firestore mapping is the source of truth for portal access
      }
    }

    await linkCustomerToFirebase(customer.id, uid);
    await linkUserToCustomer(uid, customer.customerId);

    const profile = await getUserProfile(uid);
    if (!profile) {
      throw new Error("Failed to load user profile after linking.");
    }
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
