import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { changeUserPassword } from "@/services/auth.service";
import { useToast } from "@/hooks/useToast";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function ChangePassword() {
  const toast = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSubmitting(true);
    try {
      await changeUserPassword(currentPassword, newPassword);
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to change password"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/portal" },
          { label: "Change Password" },
        ]}
      />
      <h1 className="text-2xl font-display font-bold text-[var(--portal-text)]">
        Change Password
      </h1>

      <form onSubmit={handleSubmit} className="portal-card p-6 space-y-4">
        <div>
          <label className="portal-label">Current Password</label>
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--portal-muted)]" />
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="portal-input pl-15"
            />
          </div>
        </div>
        <div>
          <label className="portal-label">New Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="portal-input"
          />
        </div>
        <div>
          <label className="portal-label">Confirm New Password</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="portal-input"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="portal-btn-primary"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
