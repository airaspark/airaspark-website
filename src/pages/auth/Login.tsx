import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import {
  Mail,
  Lock,
  Phone,
  UserCircle,
  Chrome,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import type { ConfirmationResult } from "firebase/auth";
import {
  signInWithGoogle,
  signInWithEmail,
  signInWithCustomerId,
  sendPhoneOtp,
  verifyPhoneOtp,
} from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { ROLE_DASHBOARD_PATHS } from "@/utils/constants";
import LoadingScreen from "@/components/ui/LoadingScreen";

type LoginTab = "email" | "phone" | "login";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, initialized, loading } = useAuth();
  const toast = useToast();

  const [tab, setTab] = useState<LoginTab>("email");
  const [submitting, setSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(
    null
  );

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    null;

  useEffect(() => {
    if (!initialized || loading) return;

    if (user && user.role !== "pending") {
      const dest =
        from ??
        ROLE_DASHBOARD_PATHS[user.role as keyof typeof ROLE_DASHBOARD_PATHS];
      navigate(dest, { replace: true });
      return;
    }

    if (user && user.role === "pending") {
      navigate("/link-account", { replace: true });
    }
  }, [user, initialized, loading, from, navigate]);

  if (!initialized || loading) {
    return <LoadingScreen message="Loading portal..." />;
  }

  if (user) {
    return <LoadingScreen message="Redirecting..." />;
  }

  function redirectAfterLogin(role: string) {
    const dest =
      from ??
      ROLE_DASHBOARD_PATHS[role as keyof typeof ROLE_DASHBOARD_PATHS] ??
      "/portal";
    navigate(dest, { replace: true });
  }

  async function handleGoogleLogin() {
    setSubmitting(true);
    try {
      const profile = await signInWithGoogle(rememberMe);
      toast.success("Signed in with Google");
      if (profile.role === "pending" || (profile.role === "customer" && !profile.isLinked)) {
        navigate("/link-account", { replace: true });
      } else {
        redirectAfterLogin(profile.role);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEmailLogin(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const profile = await signInWithEmail(email, password, rememberMe);
      toast.success("Welcome back!");
      if (profile.role === "pending" || (profile.role === "customer" && !profile.isLinked)) {
        navigate("/link-account", { replace: true });
      } else {
        redirectAfterLogin(profile.role);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLoginId(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const profile = await signInWithCustomerId(
        loginId,
        loginPassword,
        rememberMe
      );
      toast.success("Welcome back!");
      redirectAfterLogin(profile.role);
    } catch (err) {
  console.log("LOGIN ERROR:", err);

  if (err instanceof Error) {
    console.log("MESSAGE:", err.message);
  }

  if (err instanceof Error && err.message === "FIRST_LOGIN") {
    console.log("GOING TO COMPLETE PROFILE...");
    navigate("/staff/complete-profile");
    return;
  }

  toast.error(err instanceof Error ? err.message : "Login failed");
}finally {
      setSubmitting(false);
    }
  }

  async function handleSendOtp(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formatted = phone.startsWith("+") ? phone : `+91${phone}`;
      const result = await sendPhoneOtp(formatted, "recaptcha-container");
      setConfirmation(result);
      setOtpSent(true);
      toast.success("OTP sent to your phone");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    if (!confirmation) return;
    setSubmitting(true);
    try {
      const profile = await verifyPhoneOtp(confirmation, otp, rememberMe);
      toast.success("Phone verified!");
      if (profile.role === "pending" || (profile.role === "customer" && !profile.isLinked)) {
        navigate("/link-account", { replace: true });
      } else {
        redirectAfterLogin(profile.role);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setSubmitting(false);
    }
  }

  const tabClass = (t: LoginTab) =>
    `flex-1 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
      tab === t
        ? "bg-[var(--portal-accent)] text-white shadow-lg"
        : "text-[var(--portal-muted)] hover:text-[var(--portal-text)]"
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="portal-card p-6 sm:p-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-[var(--portal-text)]">
          Sign In
        </h2>
        <p className="text-sm text-[var(--portal-muted)] mt-1">
          Access your AiraSpark portal account
        </p>
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={submitting}
        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-[var(--portal-border)] text-[var(--portal-text)] hover:border-[var(--portal-accent)]/50 hover:bg-[var(--portal-accent)]/5 transition-all mb-6 disabled:opacity-50"
      >
        <Chrome className="w-5 h-5" />
        Continue with Google
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--portal-border)]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-[var(--portal-card)] text-[var(--portal-muted)]">
            or sign in with
          </span>
        </div>
      </div>

      <div className="flex gap-1 p-1 rounded-xl bg-white/5 mb-6">
        <button className={tabClass("email")} onClick={() => setTab("email")}>
          <Mail className="w-3.5 h-3.5 inline mr-1" />
          Email
        </button>
        <button className={tabClass("phone")} onClick={() => setTab("phone")}>
          <Phone className="w-3.5 h-3.5 inline mr-1" />
          Phone
        </button>
        <button
          className={tabClass("login")}
          onClick={() => setTab("login")}
        >
          <UserCircle className="w-3.5 h-3.5 inline mr-1" />
          Login ID
        </button>
      </div>

      <label className="flex items-center gap-2 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="rounded accent-[#4C8DFF]"
        />
        <span className="text-sm text-[var(--portal-muted)]">Remember me</span>
      </label>

      {tab === "email" && (
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="portal-label">Email</label>
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
          <div>
            <label className="portal-label">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--portal-muted)]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="portal-input pl-20"
                placeholder="     ••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--portal-muted)]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-[var(--portal-accent)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <button type="submit" disabled={submitting} className="portal-btn-primary w-full">
            Sign In
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {tab === "phone" && (
        <form
          onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
          className="space-y-4"
        >
          {!otpSent ? (
            <div>
              <label className="portal-label">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--portal-muted)]" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="portal-input pl-15"
                  placeholder=""
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="portal-label">Enter OTP</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="portal-input text-center text-2xl tracking-[0.5em]"
                placeholder="000000"
              />
            </div>
          )}
          <div id="recaptcha-container" />
          
          <button type="submit" disabled={submitting} className="portal-btn-primary w-full">
            {otpSent ? "Verify OTP" : "Send OTP"}
            

            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {tab === "login" && (
        <form onSubmit={handleLoginId} className="space-y-4">
          <div>
            <label className="portal-label">Login ID</label>
            <input
              type="text"
              required
              value={loginId}
              onChange={(e) => setLoginId(e.target.value.toUpperCase())}
              className="portal-input font-mono"
              placeholder="login ID"
            />
          </div>
         <div>
  <label className="portal-label">Password</label>

  <div className="relative">
    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--portal-muted)]" />

    <input
      type={showLoginPassword ? "text" : "password"}
      required
      value={loginPassword}
      onChange={(e) => setLoginPassword(e.target.value)}
      className="portal-input pl-15 pr-15"
      placeholder="••••••••"
    />

    <button
      type="button"
      onClick={() => setShowLoginPassword(!showLoginPassword)}
      className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--portal-muted)] hover:text-white"
    >
      {showLoginPassword ? (
        <EyeOff className="w-5 h-5" />
      ) : (
        <Eye className="w-5 h-5" />
      )}
    </button>
  </div>
</div>
          <button type="submit" disabled={submitting} className="portal-btn-primary w-full">
            Sign In
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-[var(--portal-muted)]">
        Need help?{" "}
        <a
          href="mailto:contact@airaspark.com"
          className="text-[var(--portal-accent)] hover:underline"
        >
          contact@airaspark.com
        </a>
      </p>
    </motion.div>
  );
}
