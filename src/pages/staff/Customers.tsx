import { useEffect, useState } from "react";
import {
  Search,
  Users,
  Building2,
  Mail,
  Phone,
  FolderKanban,
  Eye,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  getStaffCustomers,
} from "@/services/staff-customer.service";

import { SkeletonCard } from "@/components/ui/Skeleton";

export default function StaffCustomers() {
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [customers, setCustomers] = useState<any[]>([]);

  async function loadCustomers() {
    try {
      const data = await getStaffCustomers();

      setCustomers(data.customers);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const value = search.toLowerCase();

    return (
      customer.name.toLowerCase().includes(value) ||
      customer.company.toLowerCase().includes(value) ||
      customer.customerId.toLowerCase().includes(value)
    );
  });

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  return (

    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">

            Assigned Customers

          </h1>

          <p className="text-[var(--portal-muted)] mt-1">

            Customers assigned to your account

          </p>

        </div>

        <div className="rounded-xl bg-[var(--portal-accent)]/10 p-4">

          <Users className="w-7 h-7 text-[var(--portal-accent)]" />

        </div>

      </div>

      <div className="relative">

        <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="w-full rounded-xl border border-[var(--portal-border)] bg-transparent py-3 pl-11 pr-4 outline-none"
        />

      </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        {filteredCustomers.length === 0 ? (

          <div className="col-span-full rounded-xl border border-[var(--portal-border)] p-8 text-center">

            <Users className="mx-auto mb-4 h-12 w-12 text-[var(--portal-muted)]" />

            <h2 className="text-xl font-semibold">

              No Customers Found

            </h2>

            <p className="mt-2 text-[var(--portal-muted)]">

              No assigned customers match your search.

            </p>

          </div>

        ) : (

          filteredCustomers.map((customer) => (

            <div
              key={customer.customerId}
              className="portal-card p-6 transition hover:scale-[1.02]"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-xl font-bold">

                    {customer.name}

                  </h2>

                  <p className="text-sm text-[var(--portal-muted)]">

                    {customer.customerId}

                  </p>

                </div>

                <Users className="h-8 w-8 text-[var(--portal-accent)]" />

              </div>

              <div className="mt-6 space-y-3">

                <div className="flex items-center gap-3">

                  <Building2 className="h-4 w-4 text-[var(--portal-accent)]" />

                  <span>{customer.company}</span>

                </div>

                <div className="flex items-center gap-3">

                  <Mail className="h-4 w-4 text-[var(--portal-accent)]" />

                  <span className="truncate">

                    {customer.email}

                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <Phone className="h-4 w-4 text-[var(--portal-accent)]" />

                  <span>{customer.phone}</span>

                </div>

                <div className="flex items-center gap-3">

                  <FolderKanban className="h-4 w-4 text-[var(--portal-accent)]" />

                  <span>

                    Active Projects :{" "}

                    <strong>

                      {customer.activeProjects}

                    </strong>

                  </span>

                </div>

              </div>

              <div className="mt-6">

                           <button
  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--portal-accent)] px-4 py-3 font-semibold text-white transition hover:opacity-90"
>
  <Eye className="h-4 w-4" />
  View Customer
</button>

              </div>

            </div>

          ))

        )}

      </div>

          </div>

  );

}