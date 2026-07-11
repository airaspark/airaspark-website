import {
  UserPlus,
  Pencil,
  FolderPlus,
  FileText,
  Archive,
} from "lucide-react";

import type { Customer } from "@/types";

export default function CustomerActions({ customer }: { customer: Customer }) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6">

      <h2 className="mb-5 text-xl font-bold">
        Actions for {customer.name}
      </h2>

      <div className="space-y-3">

        <ActionButton
          icon={<Pencil size={18} />}
          text="Edit Customer"
          color="bg-blue-600"
        />

        <ActionButton
          icon={<UserPlus size={18} />}
          text="Assign Staff"
          color="bg-purple-600"
        />

        <ActionButton
          icon={<FolderPlus size={18} />}
          text="Create Project"
          color="bg-green-600"
        />

        <ActionButton
          icon={<FileText size={18} />}
          text="Generate Invoice"
          color="bg-yellow-500"
        />

        <button className="w-full rounded-xl border border-red-500 py-3 text-red-400 hover:bg-red-500/10">
          <div className="flex items-center justify-center gap-2">
            <Archive size={18} />
            Archive Customer
          </div>
        </button>

      </div>

    </div>
  );
}

function ActionButton({
  icon,
  text,
  color,
}: {
  icon: React.ReactNode;
  text: string;
  color: string;
}) {
  return (
    <button
      className={`${color} w-full rounded-xl py-3 font-medium transition hover:opacity-90`}
    >
      <div className="flex items-center justify-center gap-2">
        {icon}
        {text}
      </div>
    </button>
  );
}