import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  CreditCard,
  Receipt,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { SkeletonCard } from "@/components/ui/Skeleton";
import {
  getCustomerDashboard,
} from "@/services/dashboard.service";

export default function CustomerDashboard() {
  const { user, loading } = useAuth();

  const [dashboardLoading, setDashboardLoading] =
    useState(true);

  const [stats, setStats] = useState({
    activeProjects: 0,
    pendingInvoices: 0,
    paymentsDue: 0,
    totalReceipts: 0,
  });

  const [recentProjects, setRecentProjects] =
    useState<any[]>([]);

  const [recentReceipts, setRecentReceipts] =
    useState<any[]>([]);

  async function loadDashboard() {
    try {
      const data = await getCustomerDashboard();

      setStats(data.stats);

      setRecentProjects(data.recentProjects);

      setRecentReceipts(data.recentReceipts);
    } catch (error) {
      console.error(error);
    } finally {
      setDashboardLoading(false);
    }
  }

  useEffect(() => {
    if (!loading) {
      loadDashboard();
    }
  }, [loading]);

  if (loading || dashboardLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Active Projects",
      value: stats.activeProjects,
      href: "/customer/projects",
      icon: FolderKanban,
    },
    {
      label: "Pending Invoices",
      value: stats.pendingInvoices,
      href: "/customer/invoices",
      icon: FileText,
    },
    {
      label: "Payments Due",
      value: stats.paymentsDue,
      href: "/customer/payments",
      icon: CreditCard,
    },
    {
      label: "Receipts",
      value: stats.totalReceipts,
      href: "/customer/receipts",
      icon: Receipt,
    },
  ];

  return (

        <div className="space-y-8">

      {/* Welcome */}

      <div>

        <h1 className="text-3xl font-bold text-[var(--portal-text)]">
          Welcome back
          {user?.displayName
            ? `, ${user.displayName.split(" ")[0]}`
            : ""}
          👋
        </h1>

        <p className="mt-2 text-[var(--portal-muted)]">
          Customer ID : {user?.entityId}
        </p>

      </div>

      {/* Statistics */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {cards.map(
          ({ label, value, href, icon: Icon }) => (

            <Link
              key={label}
              to={href}
              className="portal-card p-6 transition hover:scale-[1.02] hover:border-[var(--portal-accent)]"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-[var(--portal-muted)]">
                    {label}
                  </p>

                  <h2 className="mt-3 text-4xl font-bold text-[var(--portal-accent)]">
                    {value}
                  </h2>

                </div>

                <div className="rounded-2xl bg-[var(--portal-accent)]/10 p-4">

                  <Icon className="h-7 w-7 text-[var(--portal-accent)]" />

                </div>

              </div>

            </Link>

          )
        )}

      </div>

      {/* Quick Actions */}

      <div className="portal-card p-6">

        <div className="mb-5 flex items-center gap-3">

          <LayoutDashboard className="h-6 w-6 text-[var(--portal-accent)]" />

          <h2 className="text-xl font-bold">
            Quick Actions
          </h2>

        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <Link
            to="/customer/projects"
            className="rounded-xl border border-[var(--portal-border)] p-5 transition hover:border-[var(--portal-accent)] hover:bg-[var(--portal-accent)]/5"
          >
            <FolderKanban className="mb-3 h-6 w-6 text-[var(--portal-accent)]" />

            <p className="font-semibold">
              View Projects
            </p>

          </Link>

          <Link
            to="/customer/payments"
            className="rounded-xl border border-[var(--portal-border)] p-5 transition hover:border-[var(--portal-accent)] hover:bg-[var(--portal-accent)]/5"
          >
            <CreditCard className="mb-3 h-6 w-6 text-[var(--portal-accent)]" />

            <p className="font-semibold">
              Make Payment
            </p>

          </Link>

          <Link
            to="/customer/invoices"
            className="rounded-xl border border-[var(--portal-border)] p-5 transition hover:border-[var(--portal-accent)] hover:bg-[var(--portal-accent)]/5"
          >
            <FileText className="mb-3 h-6 w-6 text-[var(--portal-accent)]" />

            <p className="font-semibold">
              View Invoices
            </p>

          </Link>

          <Link
            to="/customer/receipts"
            className="rounded-xl border border-[var(--portal-border)] p-5 transition hover:border-[var(--portal-accent)] hover:bg-[var(--portal-accent)]/5"
          >
            <Receipt className="mb-3 h-6 w-6 text-[var(--portal-accent)]" />

            <p className="font-semibold">
              View Receipts
            </p>

          </Link>

        </div>

      </div>

      {/* Recent Projects */}

      <div className="portal-card p-6">

        <h2 className="mb-5 text-2xl font-bold">
          Recent Projects
        </h2>

        {recentProjects.length === 0 ? (

          <p className="text-[var(--portal-muted)]">
            No projects found.
          </p>

        ) : (

          <div className="space-y-4">

            {recentProjects.map((project: any) => (

              <div
                key={project.id}
                className="flex items-center justify-between rounded-xl border border-[var(--portal-border)] p-4"
              >

                <div>

                  <h3 className="font-semibold">
                    {project.title}
                  </h3>

                  <p className="text-sm text-[var(--portal-muted)]">
                    {project.projectId}
                  </p>

                </div>

                <span className="rounded-full bg-blue-500/10 px-4 py-2 text-sm text-blue-400">

                  {project.status}

                </span>

              </div>

            ))}

          </div>

        )}

      </div>

            {/* Recent Receipts */}

      <div className="portal-card p-6">

        <h2 className="mb-5 text-2xl font-bold">
          Recent Receipts
        </h2>

        {recentReceipts.length === 0 ? (

          <p className="text-[var(--portal-muted)]">
            No receipts available.
          </p>

        ) : (

          <div className="space-y-4">

            {recentReceipts.map((receipt: any) => (

              <div
                key={receipt.id}
                className="flex flex-col gap-4 rounded-xl border border-[var(--portal-border)] p-4 md:flex-row md:items-center md:justify-between"
              >

                <div>

                  <h3 className="font-semibold">
                    {receipt.receiptNumber}
                  </h3>

                  <p className="text-sm text-[var(--portal-muted)]">
                    {receipt.projectName}
                  </p>

                </div>

                <div className="text-right">

                  <p className="font-semibold text-emerald-400">
                    ₹{Number(receipt.amount).toLocaleString("en-IN")}
                  </p>

                  <p className="text-xs text-[var(--portal-muted)]">
                    {receipt.paymentMethod ?? "Online Payment"}
                  </p>

                </div>

                {receipt.pdfUrl ? (

                  <a
                    href={receipt.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-blue-600 px-5 py-2 text-center font-semibold text-white transition hover:bg-blue-700"
                  >
                    View Receipt
                  </a>

                ) : (

                  <span className="rounded-xl bg-yellow-500/10 px-5 py-2 text-center text-sm font-semibold text-yellow-400">
                    Pending Approval
                  </span>

                )}

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );

}