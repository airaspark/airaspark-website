import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  getProjectsByCustomer,
} from "@/services/project.service";
import type { Project } from "@/types";
import ProjectCard from "@/components/admin/project/ProjectCard";

export default function CustomerProjects() {
  const { user } = useAuthContext();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadProjects() {
    if (!user || !user.entityId) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
       


      const data = await getProjectsByCustomer(user.entityId);
      
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">
          My Projects
        </h1>

        <p className="text-gray-400">
          Track the progress of your projects.
        </p>
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
            You don't have any active projects.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>
      )}
    </div>
  );
}