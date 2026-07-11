import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Lock, UserCircle, ArrowRight, ShieldCheck } from "lucide-react";
import {
  linkCustomerAccount,
  signOut,
} from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { ROLE_DASHBOARD_PATHS } from "@/utils/constants";

export default function LinkCustomerAccount() {
  const { user, loading, initialized, refreshProfile, setUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [customerId, setCustomerId] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!initialized || loading) {
    return <LoadingScreen message="Loading..." />;
  }

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  if (user.isLinked && user.role !== "pending") {
    const dest =
      ROLE_DASHBOARD_PATHS[user.role as keyof typeof ROLE_DASHBOARD_PATHS];
    navigate(dest, { replace: true });
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      const profile = await linkCustomerAccount(
        user.uid,
        customerId,
        password
      );
      setUser(profile);
      await refreshProfile();
      toast.success("Account linked successfully!");
      navigate("/customer/dashboard", { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to link account");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="portal-card p-6 sm:p-8 max-w-lg mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-[var(--portal-accent)]/15 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-[var(--portal-accent)]" />
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-[var(--portal-text)]">
            Link Your Account
          </h2>
          <p className="text-sm text-[var(--portal-muted)]">
            First-time setup — verify your Customer ID
          </p>
        </div>
      </div>

      <p className="text-sm text-[var(--portal-muted)] mb-6 leading-relaxed">
        You&apos;re signed in as{" "}
        <strong className="text-[var(--portal-text)]">
          {user.email ?? user.phone ?? "your account"}
        </strong>
        . Enter the Customer ID and password provided by AiraSpark to complete
        portal access.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="portal-label">Customer ID</label>
          <div className="relative">
            <UserCircle className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--portal-muted)]" />
            <input
              type="text"
              required
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value.toUpperCase())}
              className="portal-input pl-10 font-mono"
              placeholder="ASC-2026-001"
            />
          </div>
        </div>
        <div>
          <label className="portal-label">Portal Password</label>
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--portal-muted)]" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="portal-input pl-15"
              placeholder="••••••••"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="portal-btn-primary w-full"
        >
          Verify & Link Account
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

    <p className="mt-4 text-xs text-[var(--portal-muted)] text-center">
  Don't have credentials? Contact{" "}
  <a
    href="mailto:contact@airaspark.com"
    className="text-[var(--portal-accent)]"
  >
    contact@airaspark.com
  </a>
</p>

<button
  onClick={async () => {
    await signOut();
    window.location.href = "/login";
  }}
  className="mt-6 w-full rounded-lg bg-red-600 py-3 text-white"
>
  Logout
</button>

</motion.div>
  );
}
