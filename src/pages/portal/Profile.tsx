import { useAuth } from "@/hooks/useAuth";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function PortalProfile() {
  const { user } = useAuth();

  const fields = [
    { label: "Display Name", value: user?.displayName ?? "—" },
    { label: "Email", value: user?.email ?? "—" },
    { label: "Phone", value: user?.phone ?? "—" },
    { label: "Role", value: user?.role ?? "—" },
    { label: "Entity ID", value: user?.entityId ?? "—" },
    { label: "Account Status", value: user?.isLinked ? "Linked" : "Pending Link" },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/portal" },
          { label: "Profile" },
        ]}
      />
      <h1 className="text-2xl font-display font-bold text-[var(--portal-text)]">
        Profile
      </h1>
      <div className="portal-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-[var(--portal-accent)]/20 flex items-center justify-center text-2xl font-bold text-[var(--portal-accent)]">
            {(user?.displayName ?? user?.email ?? "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-[var(--portal-text)]">
              {user?.displayName ?? "Portal User"}
            </p>
            <p className="text-sm text-[var(--portal-muted)]">{user?.entityId}</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {fields.map(({ label, value }) => (
            <div
              key={label}
              className="p-4 rounded-xl bg-white/5 border border-[var(--portal-border)]"
            >
              <p className="text-xs uppercase tracking-wider text-[var(--portal-muted)] mb-1">
                {label}
              </p>
              <p className="text-sm font-medium text-[var(--portal-text)] capitalize">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
