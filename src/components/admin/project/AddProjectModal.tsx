import { useState } from "react";
import { createProject } from "@/services/project.service";
import { generateProjectId } from "@/services/idGenerator.service";
import CustomerSelector from "@/components/admin/customer/CustomerSelector";
import type { Customer, PaymentPlan } from "@/types";

const PAYMENT_PLAN_PERCENTAGES: Record<Exclude<PaymentPlan, "custom">, number[]> = {
  "100_advance": [100],
  "50_50": [50, 50],
  "30_40_30": [30, 40, 30],
};

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
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>("30_40_30");
  const [customPercentages, setCustomPercentages] = useState<string[]>(["30", "40", "30"]);

  const percentages = paymentPlan === "custom"
    ? customPercentages.map((value) => Number(value))
    : PAYMENT_PLAN_PERCENTAGES[paymentPlan];
  const percentageTotal = percentages.reduce((total, value) => total + value, 0);

  function updateCustomPercentage(index: number, value: string) {
    setCustomPercentages((current) => current.map((percentage, position) => position === index ? value : percentage));
  }

  function addCustomInstallment() {
    setCustomPercentages((current) => [...current, ""]);
  }

  function removeCustomInstallment(index: number) {
    setCustomPercentages((current) => current.length > 1 ? current.filter((_, position) => position !== index) : current);
  }

  async function handleCreateProject() {
    if (!title || !selectedCustomer || !budget || Number(budget) <= 0) {
      alert("Please fill all required fields.");
      return;
    }

    if (!percentages.length || percentages.some((value) => !Number.isFinite(value) || value <= 0) || percentageTotal !== 100) {
      alert("Installment percentages must be positive and total exactly 100%.");
      return;
    }

    try {
      const customerId = selectedCustomer.customerId;

      const projectId = await generateProjectId(customerId);

      console.log("Creating Project...");
console.log({
  startDate,
  deadline,
  paymentPlan,
  percentages,
});

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

        paymentPlan,
        milestonePercentages: percentages,
      });

    

      onCreated?.();
      onClose();

      setTitle("");
      setSelectedCustomer(null);
      setBudget("");
      setStartDate("");
      setDeadline("");
      setDescription("");
      setPaymentPlan("30_40_30");
      setCustomPercentages(["30", "40", "30"]);
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

          <select
            value={paymentPlan}
            onChange={(event) => setPaymentPlan(event.target.value as PaymentPlan)}
            className="rounded-xl border border-gray-700 bg-gray-800 p-3 outline-none"
            aria-label="Payment plan"
          >
            <option value="100_advance">100% Advance</option>
            <option value="50_50">50 / 50</option>
            <option value="30_40_30">30 / 40 / 30</option>
            <option value="custom">Custom</option>
          </select>

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

        {paymentPlan === "custom" && (
          <div className="mt-5 rounded-xl border border-gray-700 bg-gray-800/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-medium">Custom installment percentages</p>
              <span className={percentageTotal === 100 ? "text-emerald-400" : "text-red-400"}>Total: {percentageTotal}%</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {customPercentages.map((percentage, index) => (
                <div key={index} className="flex gap-2"><input type="number" min="1" max="100" value={percentage}
                  onChange={(event) => updateCustomPercentage(index, event.target.value)}
                  placeholder={`Installment ${index + 1} %`}
                  className="min-w-0 flex-1 rounded-xl border border-gray-700 bg-gray-900 p-3 outline-none" />
                  {customPercentages.length > 1 && <button type="button" onClick={() => removeCustomInstallment(index)} className="rounded-xl border border-gray-700 px-3 text-gray-400 hover:text-white" aria-label={`Remove installment ${index + 1}`}>×</button>}
                </div>
              ))}
            </div>
            <button type="button" onClick={addCustomInstallment} className="mt-3 text-sm text-blue-400 hover:text-blue-300">+ Add installment</button>
          </div>
        )}

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
