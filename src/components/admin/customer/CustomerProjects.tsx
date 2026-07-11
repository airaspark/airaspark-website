import { FolderKanban, CalendarDays, User } from "lucide-react";

export default function CustomerProjects() {
  return (
    <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6">

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Projects</h2>

        <button className="rounded-lg border border-gray-700 px-3 py-1 text-sm hover:bg-gray-800">
          View All
        </button>
      </div>

      <div className="rounded-xl border border-gray-700 p-4">

        <div className="flex items-center gap-3">

          <div className="rounded-lg bg-blue-600 p-3">
            <FolderKanban size={20} />
          </div>

          <div className="flex-1">

            <h3 className="font-semibold">
              Website Development
            </h3>

            <p className="text-sm text-gray-400">
              Project #PR-0001
            </p>

          </div>

          <span className="rounded bg-blue-600/20 px-2 py-1 text-xs text-blue-400">
            In Progress
          </span>

        </div>

        <div className="mt-5 flex items-center justify-between text-sm text-gray-400">

          <div className="flex items-center gap-2">
            <User size={16} />
            Ravi Kumar
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays size={16} />
            20 Aug 2026
          </div>

        </div>

        <div className="mt-5">

          <div className="mb-2 flex justify-between text-sm">
            <span>Progress</span>
            <span>45%</span>
          </div>

          <div className="h-2 rounded-full bg-gray-800">
            <div className="h-2 w-[45%] rounded-full bg-blue-500"></div>
          </div>

        </div>

      </div>

    </div>
  );
}