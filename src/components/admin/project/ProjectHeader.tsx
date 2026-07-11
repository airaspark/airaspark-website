import type { Project } from "@/types";

interface Props {
  project: Project;
}

export default function ProjectHeader({ project }: Props) {
  const remainingAmount =
    project.totalCost - project.paidAmount;

  return (
    <div className="rounded-2xl border border-gray-700 bg-gray-900 p-8">

      <div className="flex items-start justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            {project.title}
          </h1>

          <p className="mt-2 text-gray-400">
            {project.projectId}
          </p>

          <div className="mt-4 inline-flex rounded-full bg-blue-600/20 px-4 py-2 text-blue-400">
            {project.status}
          </div>

        </div>

      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">

        <div>

          <p className="text-sm text-gray-500">
            Customer
          </p>

          <h3 className="mt-1 text-xl font-semibold">
            {project.customerName}
          </h3>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Budget
          </p>

          <h3 className="mt-1 text-xl font-semibold">
            ₹{project.totalCost.toLocaleString()}
          </h3>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Paid
          </p>

          <h3 className="mt-1 text-xl font-semibold text-green-400">
            ₹{project.paidAmount.toLocaleString()}
          </h3>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Remaining
          </p>

          <h3 className="mt-1 text-xl font-semibold text-yellow-400">
            ₹{remainingAmount.toLocaleString()}
          </h3>

        </div>

      </div>

    </div>
  );
}