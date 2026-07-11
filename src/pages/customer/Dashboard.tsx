import { LayoutDashboard, FolderKanban, FileText, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function CustomerDashboard() {
  const { user, loading } = useAuth();

  const stats = [
    { label: "Active Projects", value: "—", href: "/customer/projects" },
    { label: "Pending Invoices", value: "—", href: "/customer/invoices" },
    { label: "Payments Due", value: "—", href: "/customer/payments" },
    { label: "Documents", value: "—", href: "/customer/documents" },
  ];

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--portal-text)]">
          Welcome back{user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}
        </h1>
        <p className="text-[var(--portal-muted)] text-sm mt-1">
          Customer ID: {user?.entityId ?? "—"}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, href }) => (
          <Link
            key={label}
            to={href}
            className="portal-card p-5 hover:border-[var(--portal-accent)]/40 transition-all group"
          >
            <p className="text-xs uppercase tracking-wider text-[var(--portal-muted)] mb-2">
              {label}
            </p>
            <p className="text-3xl font-bold text-[var(--portal-accent)] group-hover:scale-105 transition-transform">
              {value}
            </p>
          </Link>
        ))}
      </div>

      <div className="portal-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <LayoutDashboard className="w-5 h-5 text-[var(--portal-accent)]" />
          <h2 className="text-lg font-semibold text-[var(--portal-text)]">
            Quick Actions
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: "View Projects", icon: FolderKanban, href: "/customer/projects" },
            { label: "Pay Invoice", icon: CreditCard, href: "/customer/payments" },
            { label: "Documents", icon: FileText, href: "/customer/documents" },
          ].map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              to={href}
              className="flex items-center gap-3 p-4 rounded-xl border border-[var(--portal-border)] hover:border-[var(--portal-accent)]/40 hover:bg-[var(--portal-accent)]/5 transition-all text-sm font-medium text-[var(--portal-text)]"
            >
              <Icon className="w-4 h-4 text-[var(--portal-accent)]" />
              {label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-[var(--portal-muted)] mt-4">
          Full portal modules will be available in upcoming phases.
        </p>
      </div>
    </div>
  );
}
