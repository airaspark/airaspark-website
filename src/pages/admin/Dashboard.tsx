import {
  Users,
  UserCog,
  FolderKanban,
  CreditCard,
  Receipt,
  Star,
  CheckCircle,
} from "lucide-react";

import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { SkeletonCard } from "@/components/ui/Skeleton";

import {
  getAdminDashboard,
} from "@/services/admin-dashboard.service";

export default function AdminDashboard() {
  const { user, loading } = useAuth();

  const [dashboardLoading, setDashboardLoading] =
    useState(true);

  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalStaff: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalRevenue: 0,
    totalPayments: 0,
    pendingReceipts: 0,
    totalReviews: 0,
  });

  const [recentProjects, setRecentProjects] =
    useState<any[]>([]);

  const [recentPayments, setRecentPayments] =
    useState<any[]>([]);

  const [pendingReceipts, setPendingReceipts] =
    useState<any[]>([]);

  async function loadDashboard() {
    try {
      const data = await getAdminDashboard();
      setStats(data.stats);

setRecentProjects(data.recentProjects);

setRecentPayments(data.recentPayments);

setPendingReceipts(data.pendingReceipts);

      setStats(data.stats);

      setRecentProjects(data.recentProjects);

      setRecentPayments(data.recentPayments);

      setPendingReceipts(data.pendingReceipts);
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Customers",
      value: stats.totalCustomers,
      icon: Users,
      link: "/admin/customers",
    },
    {
      label: "Staff",
      value: stats.totalStaff,
      icon: UserCog,
      link: "/admin/staff",
    },
    {
      label: "Active Projects",
      value: stats.activeProjects,
      icon: FolderKanban,
      link: "/admin/projects",
    },
    {
      label: "Completed",
      value: stats.completedProjects,
      icon: CheckCircle,
      link: "/admin/projects",
    },
    {
      label: "Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      icon: CreditCard,
      link: "/admin/payments",
    },
    {
      label: "Payments",
      value: stats.totalPayments,
      icon: CreditCard,
      link: "/admin/payments",
    },
    {
      label: "Pending Receipts",
      value: stats.pendingReceipts,
      icon: Receipt,
      link: "/admin/receipts",
    },
    {
      label: "Reviews",
      value: stats.totalReviews,
      icon: Star,
      link: "/admin/reviews",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold text-[var(--portal-text)]">
          Welcome back,
          {user?.displayName
            ? ` ${user.displayName.split(" ")[0]}`
            : " Admin"} 👋
        </h1>

        <p className="mt-2 text-[var(--portal-muted)]">
          Admin ID : {user?.entityId}
        </p>

      </div>

      {/* Statistics */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        {cards.map(({ label, value, icon: Icon, link }) => (

          <Link
            key={label}
            to={link}
            className="portal-card p-6 transition hover:scale-[1.03] hover:border-blue-500"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-[var(--portal-muted)]">
                  {label}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-[var(--portal-accent)]">
                  {value}
                </h2>

              </div>

              <div className="rounded-2xl bg-[var(--portal-accent)]/10 p-4">

                <Icon className="h-7 w-7 text-[var(--portal-accent)]" />

              </div>

            </div>

          </Link>

        ))}

      </div>

            {/* Revenue Overview */}

      <div className="portal-card p-6">

        <h2 className="mb-6 text-2xl font-bold">
          Revenue Overview
        </h2>

        <div className="grid gap-5 md:grid-cols-3">

          <Link
            to="/admin/payments"
            className="rounded-xl border border-[var(--portal-border)] p-5 transition hover:border-emerald-500 hover:bg-emerald-500/5"
          >

            <p className="text-sm text-[var(--portal-muted)]">
              Total Revenue
            </p>

            <h2 className="mt-2 text-3xl font-bold text-emerald-400">
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </h2>

          </Link>

          <Link
            to="/admin/payments"
            className="rounded-xl border border-[var(--portal-border)] p-5 transition hover:border-blue-500 hover:bg-blue-500/5"
          >

            <p className="text-sm text-[var(--portal-muted)]">
              Payments Received
            </p>

            <h2 className="mt-2 text-3xl font-bold text-blue-400">
              {stats.totalPayments}
            </h2>

          </Link>

          <Link
            to="/admin/receipts"
            className="rounded-xl border border-[var(--portal-border)] p-5 transition hover:border-yellow-500 hover:bg-yellow-500/5"
          >

            <p className="text-sm text-[var(--portal-muted)]">
              Pending Receipts
            </p>

            <h2 className="mt-2 text-3xl font-bold text-yellow-400">
              {stats.pendingReceipts}
            </h2>

          </Link>

        </div>

      </div>

      {/* Quick Actions */}

      <div className="portal-card p-6">

        <h2 className="mb-5 text-2xl font-bold">
          Quick Actions
        </h2>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">

          <Link
            to="/admin/customers"
            className="rounded-xl bg-blue-600 px-5 py-4 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            Add Customer
          </Link>

          <Link
            to="/admin/staff"
            className="rounded-xl bg-blue-600 px-5 py-4 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            Add Staff
          </Link>

          <Link
            to="/admin/projects"
            className="rounded-xl bg-blue-600 px-5 py-4 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            Create Project
          </Link>

          <Link
            to="/admin/invoices"
            className="rounded-xl bg-blue-600 px-5 py-4 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            Generate Invoice
          </Link>

          <Link
            to="/admin/payments"
            className="rounded-xl bg-blue-600 px-5 py-4 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            Payments
          </Link>

          <Link
            to="/admin/receipts"
            className="rounded-xl bg-blue-600 px-5 py-4 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            Receipts
          </Link>

        </div>

      </div>

            {/* Recent Projects & Pending Receipts */}

      <div className="grid gap-6 xl:grid-cols-2">

        {/* Recent Projects */}

        <div className="portal-card p-6">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-xl font-bold">
              Recent Projects
            </h2>

            <Link
              to="/admin/projects"
              className="text-sm font-semibold text-blue-500 hover:underline"
            >
              View All →
            </Link>

          </div>

          {recentProjects.length === 0 ? (

            <p className="text-[var(--portal-muted)]">
              No projects found.
            </p>

          ) : (

            <div className="space-y-4">

              {recentProjects.map((project: any) => (

                <Link
                  key={project.id}
                  to={`/admin/projects/${project.id}`}
                  className="flex items-center justify-between rounded-xl border border-[var(--portal-border)] p-4 transition hover:border-blue-500 hover:bg-blue-500/5"
                >

                  <div>

                    <h3 className="font-semibold">
                      {project.title}
                    </h3>

                    <p className="text-sm text-[var(--portal-muted)]">
                      {project.customerName}
                    </p>

                  </div>

                  <span className="rounded-full bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-400">

                    {project.status}

                  </span>

                </Link>

              ))}

            </div>

          )}

        </div>

        {/* Pending Receipts */}

        <div className="portal-card p-6">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-xl font-bold">
              Pending Receipt Approvals
            </h2>

            <Link
              to="/admin/receipts"
              className="text-sm font-semibold text-blue-500 hover:underline"
            >
              View All →
            </Link>

          </div>

          {pendingReceipts.length === 0 ? (

            <p className="text-[var(--portal-muted)]">
              No pending receipts.
            </p>

          ) : (

            <div className="space-y-4">

              {pendingReceipts.map((receipt: any) => (

                <Link
                  key={receipt.receiptId}
                  to="/admin/receipts"
                  className="flex items-center justify-between rounded-xl border border-[var(--portal-border)] p-4 transition hover:border-yellow-500 hover:bg-yellow-500/5"
                >

                  <div>

                    <h3 className="font-semibold">
                      {receipt.customerName}
                    </h3>

                    <p className="text-sm text-[var(--portal-muted)]">
                      {receipt.receiptNumber}
                    </p>

                  </div>

                  <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">

                    Pending

                  </span>

                </Link>

              ))}

            </div>

          )}

        </div>

      </div>

            {/* Recent Payments */}

      <div className="portal-card p-6">

        <div className="mb-5 flex items-center justify-between">

          <h2 className="text-xl font-bold">
            Recent Payments
          </h2>

          <Link
            to="/admin/payments"
            className="text-sm font-semibold text-blue-500 hover:underline"
          >
            View All →
          </Link>

        </div>

        {recentPayments.length === 0 ? (

          <p className="text-[var(--portal-muted)]">
            No recent payments found.
          </p>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-[var(--portal-border)]">

                  <th className="py-3 text-left text-sm font-semibold">
                    Customer
                  </th>

                  <th className="py-3 text-left text-sm font-semibold">
                    Project
                  </th>

                  <th className="py-3 text-left text-sm font-semibold">
                    Amount
                  </th>

                  <th className="py-3 text-left text-sm font-semibold">
                    Method
                  </th>

                  <th className="py-3 text-left text-sm font-semibold">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {recentPayments.map((payment: any) => (

                  <tr
                    key={payment.paymentId}
                    className="border-b border-[var(--portal-border)] hover:bg-white/5"
                  >

                    <td className="py-4">

                      {payment.customerName}

                    </td>

                    <td className="py-4">

                      {payment.projectName}

                    </td>

                    <td className="py-4 font-semibold text-emerald-400">

                      ₹{Number(payment.amount).toLocaleString("en-IN")}

                    </td>

                    <td className="py-4">

                      {payment.paymentMethod ?? "-"}

                    </td>

                    <td className="py-4">

                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">

                        Paid

                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );

}