import { auth } from "@/firebase";
import { openRazorpayCheckout, type RazorpayOrder } from "@/services/razorpay.service";

async function authorizationHeader(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in before making a payment.");
  return `Bearer ${await user.getIdToken()}`;
}

async function api<T>(path: string, body: Record<string, string>): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: await authorizationHeader() },
    body: JSON.stringify(body),
  });
  const data: unknown = await response.json();
  if (!response.ok || !data || typeof data !== "object" || !("success" in data) || data.success !== true) {
    const message = data && typeof data === "object" && "message" in data && typeof data.message === "string" ? data.message : "Payment request failed.";
    throw new Error(message);
  }
  return data as T;
}

export async function startRazorpayPayment(input: { installmentId: string; customerName: string; email: string; phone: string }): Promise<{ paymentId: string; receiptNumber: string }> {
  const order = await api<RazorpayOrder & { success: true }>("/api/payments/create-order", { installmentId: input.installmentId });
  const checkoutResponse = await openRazorpayCheckout(order, { name: input.customerName, email: input.email, phone: input.phone });
  return api<{ success: true; paymentId: string; receiptNumber: string }>("/api/payments/verify", {
    installmentId: input.installmentId,
    razorpayOrderId: checkoutResponse.razorpay_order_id,
    razorpayPaymentId: checkoutResponse.razorpay_payment_id,
    razorpaySignature: checkoutResponse.razorpay_signature,
  });
}
