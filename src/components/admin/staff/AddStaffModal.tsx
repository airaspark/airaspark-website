import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import {
  generateStaffId,
  generateTemporaryPassword,
} from "@/services/staffGenerator";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function AddStaffModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const [referenceName, setReferenceName] = useState("");
  const [status, setStatus] = useState("Active");
  const [loading, setLoading] = useState(false);

  async function handleCreateStaff() {
    try {
      setLoading(true);

      const staffId = await generateStaffId();
      const password = generateTemporaryPassword();

      await addDoc(collection(db, "staff"), {
        staffId,
        password,

        referenceName,

        active: status === "Active",

        firebaseUid: null,

        name: "",
        email: "",
        phone: "",
        photo: "",

        googleLinked: false,
        profileCompleted: false,

        createdAt: serverTimestamp(),
      });

      alert(`Staff Created Successfully!

Staff ID : ${staffId}

Password : ${password}`);

      onCreated?.();
      onClose();

      setReferenceName("");
      setStatus("Active");
    } catch (err) {
      console.error(err);
      alert("Failed to create staff.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-gray-700 bg-gray-900 p-8">

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Create Staff
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="space-y-5">

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Reference Name (Optional)
            </label>

            <input
              value={referenceName}
              onChange={(e) => setReferenceName(e.target.value)}
              placeholder="Ex : Ravi"
              className="w-full rounded-xl border border-gray-700 bg-gray-800 p-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 p-3 outline-none"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="rounded-xl border border-blue-700/40 bg-blue-500/10 p-4">

            <p className="text-sm text-blue-300">
              Staff ID and Temporary Password will be generated automatically when you click
              <span className="font-semibold"> Create Staff</span>.
            </p>

          </div>

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border border-gray-700 px-6 py-3"
          >
            Cancel
          </button>

          <button
            onClick={handleCreateStaff}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-6 py-3 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Staff"}
          </button>

        </div>

      </div>
    </div>
  );
}