import {
  Building2,
  Mail,
  Phone,
  Globe,
  BadgeCheck,
  Calendar,
  Clock3,
  FileText,
} from "lucide-react";

import type { Customer } from "@/types";

interface Props {
  customer: Customer;
}

export default function CustomerInfo({ customer }: Props) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-gray-900 p-8">

      <div className="grid grid-cols-2 gap-10">

        {/* LEFT */}

        <div>

          <div className="flex items-center gap-6">

            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-5xl font-bold text-white">

              {customer.name.substring(0,2).toUpperCase()}

            </div>

            <div>

              <h2 className="text-4xl font-bold">

                {customer.name}

              </h2>

              <span
                className={`mt-2 inline-block rounded-full px-4 py-1 ${
                  customer.isActive
                    ? "bg-green-600/20 text-green-400"
                    : "bg-red-600/20 text-red-400"
                }`}
              >
                {customer.isActive ? "Active" : "Inactive"}
              </span>

              <div className="mt-4">

                <span className="rounded-lg border border-blue-600 px-3 py-2 text-blue-400">

                  {customer.customerId}

                </span>

              </div>

              <p className="mt-3 text-gray-400">
                Customer ID
              </p>

            </div>

          </div>

          <div className="mt-10 flex gap-10 border-t border-gray-700 pt-6">

            <div className="flex items-center gap-2 text-gray-400">

              <Calendar size={18} />

              Joined Recently

            </div>

            <div className="flex items-center gap-2 text-gray-400">

              <Clock3 size={18} />

              Last Updated Recently

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="grid grid-cols-2 gap-8">

          <Info
            icon={<Building2 />}
            title="Company"
            value={customer.company}
          />

          <Info
            icon={<BadgeCheck />}
            title="Industry"
            value="Technology"
          />

          <Info
            icon={<Mail />}
            title="Email"
            value={customer.email}
          />

          <Info
            icon={<Globe />}
            title="Website"
            value="—"
          />

          <Info
            icon={<Phone />}
            title="Phone"
            value={customer.phone}
          />

          <Info
            icon={<FileText />}
            title="GST"
            value="—"
          />

        </div>

      </div>

    </div>
  );
}

function Info({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex gap-4">

      <div className="text-gray-400">

        {icon}

      </div>

      <div>

        <p className="text-sm text-gray-400">

          {title}

        </p>

        <p className="mt-1 text-lg font-semibold">

          {value}

        </p>

      </div>

    </div>
  );
}