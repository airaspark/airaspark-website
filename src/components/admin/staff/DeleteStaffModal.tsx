import { deleteStaff, type Staff } from "@/services/staff.service";

interface Props {
  open: boolean;
  staff: Staff | null;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteStaffModal({
  open,
  staff,
  onClose,
  onDeleted,
}: Props) {
  if (!open || !staff) return null;

 async function handleDelete() {
  if (!staff) return;

  try {
    await deleteStaff(staff.id);

    alert("Staff deleted successfully.");

    onDeleted();
    onClose();
  } catch (err) {
    console.error(err);
    alert("Failed to delete staff.");
  }
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-2xl border border-red-800 bg-gray-900 p-8">

        <h2 className="text-2xl font-bold text-red-500">
          Delete Staff
        </h2>

        <p className="mt-4 text-gray-300">
          Are you sure you want to delete
        </p>

        <p className="mt-2 text-lg font-semibold">
          {staff.staffId}
        </p>

        <p className="text-gray-400">
          {staff.name || "Unnamed Staff"}
        </p>

        <p className="mt-6 text-sm text-red-400">
          This action cannot be undone.
        </p>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border border-gray-700 px-6 py-3"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="rounded-xl bg-red-600 px-6 py-3 hover:bg-red-700"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}