import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Mail, ArrowLeft, ArrowRight } from "lucide-react";
import { sendForgotPasswordEmail } from "@/services/auth.service";
import { useToast } from "@/hooks/useToast";

export default function ForgotPassword() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await sendForgotPasswordEmail(email);
      setSent(true);
      toast.success("Password reset email sent");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send reset email"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="portal-card p-6 sm:p-8"
    >
      <Link
        to="/login"
        className="inline-flex items-center gap-1 text-sm text-[var(--portal-muted)] hover:text-[var(--portal-accent)] mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to login
      </Link>

      <h2 className="text-2xl font-display font-bold text-[var(--portal-text)] mb-1">
        Forgot Password
      </h2>
      <p className="text-sm text-[var(--portal-muted)] mb-6">
        Enter your email and we&apos;ll send a reset link.
      </p>

      {sent ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
          Check your inbox at <strong>{email}</strong> for password reset
          instructions.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="portal-label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--portal-muted)]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="portal-input pl-15"
                placeholder=""
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="portal-btn-primary w-full"
          >
            Send Reset Link
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}
    </motion.div>
  );
}
