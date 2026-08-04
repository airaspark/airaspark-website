import { Navigate } from "react-router-dom";

// Payments require an authenticated customer session so the server can verify
// the ownership and amount of an installment before creating a Razorpay order.
export default function Payment() {
  return <Navigate to="/customer/payments" replace />;
}
