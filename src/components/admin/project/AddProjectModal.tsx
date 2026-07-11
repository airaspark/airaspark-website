import { useState } from "react";
import { createProject } from "@/services/project.service";
import { generateProjectId } from "@/services/idGenerator.service";
import CustomerSelector from "@/components/admin/customer/CustomerSelector";
import type { Customer } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function AddProjectModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const [title, setTitle] = useState("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");

  async function handleCreateProject() {
    if (!title || !selectedCustomer || !budget) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const customerId = selectedCustomer.customerId;

      const projectId = await generateProjectId(customerId);

      await createProject({
        projectId,

        customerId,
        customerName: selectedCustomer.company,

        title,
        description,

        assignedStaffIds: [],

        status: "Planning",
        priority: "Medium",

        progress: 0,

        budget: Number(budget),

        totalCost: Number(budget),
        paidAmount: 0,

        startDate,
        deadline,

        milestonePercentages: [40, 30, 30],
      });

    

      onCreated?.();
      onClose();

      setTitle("");
      setSelectedCustomer(null);
      setBudget("");
      setStartDate("");
      setDeadline("");
      setDescription("");
    } catch (error) {
      console.error(error);
      alert("Failed to create project.");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl border border-gray-700 bg-gray-900 p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Create New Project
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project Title"
            className="rounded-xl border border-gray-700 bg-gray-800 p-3 outline-none"
          />

          <CustomerSelector
            value={selectedCustomer}
            onChange={setSelectedCustomer}
          />

          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Budget"
            className="rounded-xl border border-gray-700 bg-gray-800 p-3 outline-none"
          />

          <div />

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-xl border border-gray-700 bg-gray-800 p-3 outline-none"
          />

          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="rounded-xl border border-gray-700 bg-gray-800 p-3 outline-none"
          />
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project Description"
          className="mt-5 h-32 w-full rounded-xl border border-gray-700 bg-gray-800 p-3 outline-none"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-700 px-6 py-3"
          >
            Cancel
          </button>

          <button
            onClick={handleCreateProject}
            className="rounded-xl bg-blue-600 px-6 py-3 hover:bg-blue-700"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}