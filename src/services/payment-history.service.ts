import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { timestampToIso } from "@/services/idGenerator.service";
import { COLLECTIONS } from "@/utils/constants";
import type { Payment } from "@/types";

function mapPayment(id: string, data: Record<string, unknown>): Payment {
  return {
    id,
    paymentId: data.paymentId as string,
    projectId: data.projectId as string,
    customerId: data.customerId as string,
    installmentId: data.installmentId as string,
    amount: data.amount as number,
    razorpayOrderId: (data.razorpayOrderId as string | null) ?? null,
    razorpayPaymentId: (data.razorpayPaymentId as string | null) ?? null,
    status: data.status as Payment["status"],
    method: (data.method as string | null) ?? null,
    paidAt: data.paidAt ? timestampToIso(data.paidAt as never) : null,
    createdAt: timestampToIso(data.createdAt as never),
    updatedAt: timestampToIso(data.updatedAt as never),
  };
}

export async function getPaymentHistory(): Promise<Payment[]> {
  const snapshot = await getDocs(query(collection(db, COLLECTIONS.payments), orderBy("paidAt", "desc")));
  return snapshot.docs.map((item) => mapPayment(item.id, item.data()));
}

export async function getPaymentsByCustomer(
  customerId: string
): Promise<Payment[]> {
  const payments = await getPaymentHistory();
  return payments.filter(
    (payment) => payment.customerId === customerId
  );
}
