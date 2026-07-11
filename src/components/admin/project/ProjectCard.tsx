import type { Project } from "@/types";
import {
  Calendar,
  FolderKanban,
  User,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  project: Project;
  onDelete?: (id: string) => void;
}

export default function ProjectCard({
  project,
  onDelete,
}: Props) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/admin/projects/${project.id}`)}
      className="cursor-pointer rounded-3xl border border-gray-700 bg-gray-900 p-6 transition hover:border-blue-500"
    >

      {/* Header */}
      <div className="flex items-start justify-between">

        <div className="flex items-center gap-4">

          <div className="rounded-2xl bg-blue-600 p-4">
            <FolderKanban className="text-white" size={24} />
          </div>

          <div>

            <h2 className="text-3xl font-bold">
              {project.title}
            </h2>

            <p className="text-lg text-gray-400">
              {project.customerName}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {project.projectId}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <span className="rounded-full bg-blue-600/20 px-4 py-2 text-sm font-medium text-blue-400">
            {project.status}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm("Delete this project permanently?")) {
                onDelete?.(project.id);
              }
            }}
            className="rounded-xl p-2 text-red-400 transition hover:bg-red-500/20"
          >
            <Trash2 size={18} />
          </button>

        </div>

      </div>

      {/* Progress */}
      <div className="mt-6">

        <div className="mb-2 flex justify-between">

          <span className="font-medium">
            Progress
          </span>

          <span>
            {project.progress}%
          </span>

        </div>

        <div className="h-2 overflow-hidden rounded-full bg-gray-700">

          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{
              width: `${project.progress}%`,
            }}
          />

        </div>

      </div>

      {/* Footer */}
      <div className="mt-8 grid grid-cols-3 gap-6">

        <div>

          <p className="text-sm text-gray-500">
            Budget
          </p>

          <h3 className="text-3xl font-bold">
            ₹{project.budget.toLocaleString()}
          </h3>

        </div>

        <div className="flex items-center gap-2">

          <Calendar
            size={18}
            className="text-gray-400"
          />

          <span>
            {project.deadline}
          </span>

        </div>

        <div className="flex items-center gap-2">

          <User
            size={18}
            className="text-gray-400"
          />

          <span className="text-gray-400">
            Not Assigned
          </span>

        </div>

      </div>

    </div>
  );
}