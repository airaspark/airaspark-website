import {
  Users,
  FolderKanban,
  FileUp,
  Clock,
  CreditCard,
  Receipt,
  Loader2,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";

import { SkeletonCard } from "@/components/ui/Skeleton";

import {
  getStaffDashboard,
} from "@/services/staff-dashboard.service";

export default function StaffDashboard() {
  const { user, loading } = useAuth();

  const [dashboardLoading, setDashboardLoading] =
    useState(true);

  const [stats, setStats] = useState({
    assignedCustomers: 0,
    activeProjects: 0,
    pendingUploads: 0,
    dueMilestones: 0,
  });

  const [recentProjects, setRecentProjects] =
    useState<any[]>([]);

  const [recentPayments, setRecentPayments] =
    useState<any[]>([]);

  const [customers, setCustomers] =
    useState<any[]>([]);

  async function loadDashboard() {
    try {
      const data = await getStaffDashboard();

      setStats(data.stats);

      setRecentProjects(data.recentProjects);

      setRecentPayments(data.recentPayments);

      setCustomers(data.customers);

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
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Assigned Customers",
      value: stats.assignedCustomers,
      icon: Users,
    },
    {
      label: "Active Projects",
      value: stats.activeProjects,
      icon: FolderKanban,
    },
    {
      label: "Pending Uploads",
      value: stats.pendingUploads,
      icon: Receipt,
    },
    {
      label: "Due Milestones",
      value: stats.dueMilestones,
      icon: Clock,
    },
  ];

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">

          Welcome back,
          {user?.displayName
            ? ` ${user.displayName.split(" ")[0]}`
            : ""} 👋

        </h1>

        <p className="mt-2 text-[var(--portal-muted)]">

          Staff ID : {user?.entityId}

        </p>

      </div>

            {/* Statistics */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        {cards.map(({ label, value, icon: Icon }) => (

          <div
            key={label}
            className="portal-card p-6 transition hover:scale-[1.02]"
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

          </div>

        ))}

      </div>

      {/* Quick Actions */}

      <div className="portal-card p-6">

        <h2 className="mb-5 text-2xl font-bold">

          Quick Actions

        </h2>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">

          <Link
            to="/staff/customers"
            className="rounded-xl bg-blue-600 px-5 py-4 text-center font-semibold text-white hover:bg-blue-700"
          >
            Customers
          </Link>

          <Link
            to="/staff/projects"
            className="rounded-xl bg-blue-600 px-5 py-4 text-center font-semibold text-white hover:bg-blue-700"
          >
            Projects
          </Link>

          <Link
            to="/staff/payments"
            className="rounded-xl bg-blue-600 px-5 py-4 text-center font-semibold text-white hover:bg-blue-700"
          >
            Payments
          </Link>

          <Link
            to="/staff/receipts"
            className="rounded-xl bg-blue-600 px-5 py-4 text-center font-semibold text-white hover:bg-blue-700"
          >
            Receipts
          </Link>

          <Link
            to="/staff/daily-reports"
            className="rounded-xl bg-blue-600 px-5 py-4 text-center font-semibold text-white hover:bg-blue-700"
          >
            Daily Reports
          </Link>

          <Link
            to="/staff/invoices"
            className="rounded-xl bg-blue-600 px-5 py-4 text-center font-semibold text-white hover:bg-blue-700"
          >
            Invoices
          </Link>

        </div>

      </div>

            {/* Recent Projects & Assigned Customers */}

      <div className="grid gap-6 xl:grid-cols-2">

        {/* Recent Projects */}

        <div className="portal-card p-6">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-xl font-bold">

              Recent Projects

            </h2>

            <Link
              to="/staff/projects"
              className="text-sm font-semibold text-blue-500 hover:underline"
            >
              View All →
            </Link>

          </div>

          {recentProjects.length === 0 ? (

            <p className="text-[var(--portal-muted)]">
              No projects assigned.
            </p>

          ) : (

            <div className="space-y-4">

              {recentProjects.map((project: any) => (

                <Link
                  key={project.id}
                  to={`/staff/projects/${project.id}`}
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

        {/* Assigned Customers */}

        <div className="portal-card p-6">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-xl font-bold">

              Assigned Customers

            </h2>

            <Link
              to="/staff/customers"
              className="text-sm font-semibold text-blue-500 hover:underline"
            >
              View All →
            </Link>

          </div>

          {customers.length === 0 ? (

            <p className="text-[var(--portal-muted)]">
              No assigned customers.
            </p>

          ) : (

            <div className="space-y-4">

              {customers.map((customer: any) => (

                <div
                  key={customer.customerId}
                  className="rounded-xl border border-[var(--portal-border)] p-4"
                >

                  <h3 className="font-semibold">

                    {customer.name}

                  </h3>

                  <p className="text-sm text-[var(--portal-muted)]">

                    {customer.company}

                  </p>

                  <p className="mt-1 text-xs text-[var(--portal-muted)]">

                    {customer.customerId}

                  </p>

                </div>

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
            to="/staff/payments"
            className="text-sm font-semibold text-blue-500 hover:underline"
          >
            View All →
          </Link>

        </div>

        {recentPayments.length === 0 ? (

          <p className="text-[var(--portal-muted)]">

            No payment history found.

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
