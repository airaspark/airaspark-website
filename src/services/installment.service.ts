import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { timestampToIso } from "@/services/idGenerator.service";
import { COLLECTIONS } from "@/utils/constants";
import type { Installment } from "@/types";

function mapInstallment(id: string, data: Record<string, unknown>): Installment {
 return {
  id,
  installmentId: data.installmentId as string,
  projectId: data.projectId as string,
  customerId: data.customerId as string,
  sequence: data.sequence as number,
  percentage: data.percentage as number,
  amount: data.amount as number,
  status: data.status as Installment["status"],

  // ✅ ADD THIS
  locked: Boolean(data.locked),

  dueDate: (data.dueDate as string | null) ?? null,
  paidAt: data.paidAt ? timestampToIso(data.paidAt as never) : null,
  paymentId: (data.paymentId as string | null) ?? null,
  createdAt: timestampToIso(data.createdAt as never),
  updatedAt: timestampToIso(data.updatedAt as never),
};
}

export async function getInstallmentsByProject(projectId: string): Promise<Installment[]> {
  const snapshot = await getDocs(query(collection(db, COLLECTIONS.installments), where("projectId", "==", projectId), orderBy("sequence", "asc")));
  return snapshot.docs.map((item) => mapInstallment(item.id, item.data()));
}

export async function getInstallmentsByCustomer(customerId: string): Promise<Installment[]> {
  const snapshot = await getDocs(query(collection(db, COLLECTIONS.installments), where("customerId", "==", customerId), orderBy("dueDate", "asc")));
  return snapshot.docs.map((item) => mapInstallment(item.id, item.data()));
}
