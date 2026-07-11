import {
  Users,
  UserCog,
  FolderKanban,
  CreditCard,
  BarChart3,
  Activity,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function AdminDashboard() {
  const { user, loading } = useAuth();

  const stats = [
    { label: "Customers", value: "—", icon: Users },
    { label: "Staff", value: "—", icon: UserCog },
    { label: "Projects", value: "—", icon: FolderKanban },
    { label: "Revenue", value: "—", icon: CreditCard },
    { label: "Pending Reviews", value: "—", icon: BarChart3 },
    { label: "Activity Today", value: "—", icon: Activity },
  ];

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--portal-text)]">
          Admin Dashboard
        </h1>
        <p className="text-[var(--portal-muted)] text-sm mt-1">
          Admin ID: {user?.entityId ?? "—"}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="portal-card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-wider text-[var(--portal-muted)]">
                {label}
              </p>
              <Icon className="w-4 h-4 text-[var(--portal-accent)]" />
            </div>
            <p className="text-3xl font-bold text-[var(--portal-accent)]">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="portal-card p-6">
        <h2 className="text-lg font-semibold text-[var(--portal-text)] mb-2">
          Admin Control Panel
        </h2>
        <p className="text-sm text-[var(--portal-muted)]">
          Full management of customers, staff, projects, payments, reviews,
          analytics, and settings will be available in Phase 3.
        </p>
      </div>
    </div>
  );
}
