export interface RazorpayOrder {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}

export interface RazorpayCheckoutResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayConstructor {
  new (options: Record<string, unknown>): { open: () => void };
}

declare global {
  interface Window { Razorpay?: RazorpayConstructor; }
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Razorpay Checkout."));
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout(order: RazorpayOrder, customer: { name: string; email: string; phone: string }): Promise<RazorpayCheckoutResponse> {
  await loadRazorpayScript();
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) return reject(new Error("Razorpay Checkout is unavailable."));
    const checkout = new window.Razorpay({
      key: order.key, amount: order.amount, currency: order.currency, order_id: order.orderId,
      name: "AiraSpark", description: "Project installment payment",
      prefill: { name: customer.name, email: customer.email, contact: customer.phone },
      handler: (response: RazorpayCheckoutResponse) => resolve(response),
      modal: { ondismiss: () => reject(new Error("Payment cancelled.")) },
      theme: { color: "#2563eb" },
    });
    checkout.open();
  });
}
