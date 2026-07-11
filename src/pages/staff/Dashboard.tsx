import { Users, FolderKanban, FileUp, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function StaffDashboard() {
  const { user, loading } = useAuth();

  const stats = [
    { label: "Assigned Customers", value: "—", icon: Users },
    { label: "Active Projects", value: "—", icon: FolderKanban },
    { label: "Pending Uploads", value: "—", icon: FileUp },
    { label: "Due Milestones", value: "—", icon: Clock },
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
          Staff Dashboard
        </h1>
        <p className="text-[var(--portal-muted)] text-sm mt-1">
          Staff ID: {user?.entityId ?? "—"}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          Staff Portal
        </h2>
        <p className="text-sm text-[var(--portal-muted)]">
          Manage assigned customers, projects, milestones, and documents.
          Full staff modules coming in Phase 3.
        </p>
      </div>
    </div>
  );
}
