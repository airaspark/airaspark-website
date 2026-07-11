import { useEffect, useState } from "react";
import {
  getProjects,
  deleteProject,
} from "@/services/project.service";
import type { Project } from "@/types";
import ProjectCard from "@/components/admin/project/ProjectCard";
import AddProjectModal from "@/components/admin/project/AddProjectModal";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  async function loadProjects() {
    try {
      setLoading(true);

      const data = await getProjects();

      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProject(id);

      await loadProjects();
    } catch (error) {
      console.error(error);
      alert("Failed to delete project.");
    }
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Projects
          </h1>

          <p className="text-gray-400">
            Manage all customer projects
          </p>

        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          + New Project
        </button>

      </div>

      {loading ? (

        <div className="py-20 text-center text-gray-400">
          Loading Projects...
        </div>

      ) : projects.length === 0 ? (

        <div className="rounded-3xl border border-dashed border-gray-700 py-20 text-center">

          <h2 className="text-2xl font-bold">
            No Projects Found
          </h2>

          <p className="mt-2 text-gray-400">
            Create your first project.
          </p>

        </div>

      ) : (

        <div className="space-y-6">

          {projects.map((project) => (

            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDelete}
            />

          ))}

        </div>

      )}

      <AddProjectModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreated={loadProjects}
      />

    </div>
  );
}