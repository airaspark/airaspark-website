import {
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";

import type { Staff } from "@/services/staff.service";

interface Props {
  staff: Staff[];
  onView: (staff: Staff) => void;
  onEdit: (staff: Staff) => void;
  onDelete: (staff: Staff) => void;
}

export default function StaffTable({
  staff,
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-800 bg-gray-900">

      <table className="w-full">

        <thead className="border-b border-gray-800 bg-gray-950">

          <tr className="text-left text-gray-400">

            <th className="px-6 py-5">Staff ID</th>

            <th className="px-6 py-5">Name</th>

            <th className="px-6 py-5">Email</th>

            <th className="px-6 py-5">Status</th>

            <th className="px-6 py-5">Profile</th>

            <th className="px-6 py-5 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {staff.map((member) => (

            <tr
              key={member.id}
              className="border-b border-gray-800 hover:bg-gray-800/40 transition"
            >

              <td className="px-6 py-5 font-mono">
                {member.staffId}
              </td>

              <td className="px-6 py-5">
                {member.name || (
                  <span className="text-gray-500">
                    Not Completed
                  </span>
                )}
              </td>

              <td className="px-6 py-5">
                {member.email || (
                  <span className="text-gray-500">
                    --
                  </span>
                )}
              </td>

              <td className="px-6 py-5">

                {member.active ? (

                  <span className="rounded-full bg-green-500/20 px-4 py-1 text-sm text-green-400">
                    Active
                  </span>

                ) : (

                  <span className="rounded-full bg-red-500/20 px-4 py-1 text-sm text-red-400">
                    Inactive
                  </span>

                )}

              </td>

              <td className="px-6 py-5">

                {member.name ? (

                  <CheckCircle
                    size={20}
                    className="text-green-400"
                  />

                ) : (

                  <XCircle
                    size={20}
                    className="text-yellow-500"
                  />

                )}

              </td>

              <td className="px-6 py-5">

                <div className="flex items-center justify-center gap-5">

                  {/* View */}

                  <button
                    onClick={() => onView(member)}
                    className="text-blue-400 hover:text-blue-300 transition"
                  >
                    <Eye size={19} />
                  </button>

                  {/* Edit */}

                  <button
                    onClick={() => onEdit(member)}
                    className="text-yellow-400 hover:text-yellow-300 transition"
                  >
                    <Pencil size={19} />
                  </button>

                  {/* Delete */}

                 <button
                    onClick={() => onDelete(member)}
                    className="text-red-400 hover:text-red-300 transition"
                >
                <Trash2 size={19} />
                </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}