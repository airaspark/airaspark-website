import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import type { Project } from "@/types";

import { getProjectById } from "@/services/project.service";

import ProjectHeader from "@/components/admin/project/ProjectHeader";
import ProjectTabs from "@/components/admin/project/ProjectTabs";

import ProjectOverview from "@/components/admin/project/details/ProjectOverview";
import ProjectMilestones from "@/components/admin/project/details/ProjectMilestones";
import ProjectDocuments from "@/components/admin/project/details/ProjectDocuments";
import ProjectInvoices from "@/components/admin/project/details/ProjectInvoices";
import ProjectPayments from "@/components/admin/project/details/ProjectPayments";
import ProjectTimeline from "@/components/admin/project/details/ProjectTimeline";
import ProjectNotes from "@/components/admin/project/details/ProjectNotes";

export default function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] =
    useState("Overview");

  useEffect(() => {
    async function loadProject() {
      if (!id) return;

      try {
        const data = await getProjectById(id);

        setProject(data);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center text-gray-400">
        Loading Project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-24 text-center text-red-400">
        Project not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <ProjectHeader
        project={project}
      />

      <ProjectTabs
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "Overview" && (
        <ProjectOverview
          project={project}
        />
      )}

      {activeTab === "Milestones" && (
        <ProjectMilestones />
      )}

      {activeTab === "Documents" && (
        <ProjectDocuments />
      )}

      {activeTab === "Invoices" && (
        <ProjectInvoices />
      )}

      {activeTab === "Payments" && (
        <ProjectPayments />
      )}

      {activeTab === "Timeline" && (
        <ProjectTimeline />
      )}

      {activeTab === "Notes" && (
        <ProjectNotes />
      )}

    </div>
  );
}