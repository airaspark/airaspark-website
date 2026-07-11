import { useEffect, useState } from "react";
import type { Staff } from "@/services/staff.service";

interface Props {
  open: boolean;
  staff: Staff | null;
  onClose: () => void;
  onSaved: () => void;
}
import { updateStaff } from "@/services/staff.service";

export default function EditStaffModal({
  open,
  staff,
  onClose,
  onSaved,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    if (!staff) return;

    setName(staff.name ?? "");
    setEmail(staff.email ?? "");
    setPhone((staff as any).phone ?? "");
    setStatus(staff.active ? "Active" : "Inactive");
  }, [staff]);

  if (!open || !staff) return null;

  async function handleSave() {
  if (!staff) return;

  try {
    await updateStaff(staff.id, {
      name,
      email,
      phone,
      active: status === "Active",
    });

    alert("Staff updated successfully.");

    onSaved();
    onClose();

  } catch (err) {
    console.error(err);
    alert("Failed to update staff.");
  }
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

      <div className="w-full max-w-xl rounded-2xl border border-gray-700 bg-gray-900 p-8">

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Edit Staff
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="space-y-5">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full rounded-xl border border-gray-700 bg-gray-800 p-3 outline-none"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-gray-700 bg-gray-800 p-3 outline-none"
          />

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            className="w-full rounded-xl border border-gray-700 bg-gray-800 p-3 outline-none"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-gray-700 bg-gray-800 p-3 outline-none"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border border-gray-700 px-6 py-3"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="rounded-xl bg-blue-600 px-6 py-3 hover:bg-blue-700"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}