import type { Project } from "@/types";
import {
  CalendarDays,
  CircleDollarSign,
  Flag,
  User,
} from "lucide-react";

interface Props {
  project: Project;
}

export default function ProjectOverview({
  project,
}: Props) {
  const remaining =
    project.totalCost - project.paidAmount;

  return (
    <div className="grid gap-6 md:grid-cols-2">

      {/* Customer */}
      <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6">

        <div className="mb-4 flex items-center gap-2">
          <User size={20} />
          <h2 className="text-xl font-bold">
            Customer
          </h2>
        </div>

        <p className="text-lg font-semibold">
          {project.customerName}
        </p>

        <p className="mt-2 text-gray-400">
          {project.customerId}
        </p>

      </div>

      {/* Financial */}
      <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6">

        <div className="mb-4 flex items-center gap-2">
          <CircleDollarSign size={20} />
          <h2 className="text-xl font-bold">
            Financial
          </h2>
        </div>

        <div className="space-y-3">

          <div className="flex justify-between">
            <span>Total Budget</span>
            <span>₹{project.totalCost.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span>Paid</span>
            <span className="text-green-400">
              ₹{project.paidAmount.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Remaining</span>
            <span className="text-yellow-400">
              ₹{remaining.toLocaleString()}
            </span>
          </div>

        </div>

      </div>

      {/* Dates */}
      <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6">

        <div className="mb-4 flex items-center gap-2">
          <CalendarDays size={20} />
          <h2 className="text-xl font-bold">
            Dates
          </h2>
        </div>

        <div className="space-y-3">

          <div className="flex justify-between">
            <span>Start Date</span>
            <span>{project.startDate}</span>
          </div>

          <div className="flex justify-between">
            <span>Deadline</span>
            <span>{project.deadline}</span>
          </div>

        </div>

      </div>

      {/* Progress */}
      <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6">

        <div className="mb-4 flex items-center gap-2">
          <Flag size={20} />
          <h2 className="text-xl font-bold">
            Progress
          </h2>
        </div>

        <div className="mb-3 flex justify-between">

          <span>{project.status}</span>

          <span>{project.progress}%</span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-gray-700">

          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{
              width: `${project.progress}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}