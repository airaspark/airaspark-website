import type { Staff } from "@/services/staff.service";

interface Props {
  open: boolean;
  staff: Staff | null;
  onClose: () => void;
}

export default function ViewStaffModal({
  open,
  staff,
  onClose,
}: Props) {
  if (!open || !staff) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

      <div className="w-full max-w-2xl rounded-3xl border border-gray-700 bg-gray-900 p-8">

        <div className="flex items-center justify-between mb-8">

          <h2 className="text-3xl font-bold">
            Staff Profile
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-white"
          >
            ×
          </button>

        </div>

        <div className="flex items-center gap-6 mb-8">

          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-4xl font-bold">
            {(staff.name || "S").charAt(0).toUpperCase()}
          </div>

          <div>

            <h3 className="text-2xl font-bold">
              {staff.name || "Profile Not Completed"}
            </h3>

            <p className="text-gray-400">
              {staff.staffId}
            </p>

          </div>

        </div>

        <div className="grid grid-cols-2 gap-5">

          <InfoCard
            title="Email"
            value={staff.email || "-"}
          />

          <InfoCard
            title="Phone"
            value={(staff as any).phone || "-"}
          />

          <InfoCard
            title="Status"
            value={staff.active ? "Active" : "Inactive"}
          />

          <InfoCard
            title="Role"
            value="Staff"
          />

        </div>

        <div className="mt-8 flex justify-end">

          <button
            onClick={onClose}
            className="rounded-xl bg-blue-600 px-8 py-3 hover:bg-blue-700"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800 p-5">

      <p className="text-sm text-gray-400">
        {title}
      </p>

      <p className="mt-2 text-lg font-semibold">
        {value}
      </p>

    </div>
  );
}