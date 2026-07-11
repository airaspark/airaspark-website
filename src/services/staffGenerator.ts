import {
  doc,
  runTransaction,
} from "firebase/firestore";

import { db } from "@/firebase";

function randomNumber(length: number) {
  let result = "";

  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }

  return result;
}

export function generateTemporaryPassword() {
  return `AS@${randomNumber(6)}`;
}

export async function generateStaffId() {
  const year = new Date().getFullYear().toString();

  const counterRef = doc(db, "counters", year);

  return await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(counterRef);

    if (!snap.exists()) {
      throw new Error("Counter document not found.");
    }

    const data = snap.data();

    const current = (data.staff ?? 0) + 1;

    transaction.update(counterRef, {
      staff: current,
    });

    return `STF-${year}-${String(current).padStart(3, "0")}`;
  });
}