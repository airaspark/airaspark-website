import { useEffect, useState } from "react";
import { Plus, Search, Users } from "lucide-react";

import AddStaffModal from "@/components/admin/staff/AddStaffModal";
import EditStaffModal from "@/components/admin/staff/EditStaffModal";
import ViewStaffModal from "@/components/admin/staff/ViewStaffModal";
import DeleteStaffModal from "@/components/admin/staff/DeleteStaffModal";
import StaffTable from "@/components/admin/staff/StaffTable";

import {
  getStaff,
  type Staff as StaffType,
} from "@/services/staff.service";

export default function Staff() {
  const [staff, setStaff] = useState<StaffType[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Modal
  const [openAddModal, setOpenAddModal] = useState(false);

  // Edit Modal
  const [editingStaff, setEditingStaff] = useState<StaffType | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  // View Modal
  const [viewStaff, setViewStaff] = useState<StaffType | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);

  // Delete Modal
  const [deleteStaffData, setDeleteStaffData] =
    useState<StaffType | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  async function loadStaff() {
    try {
      setLoading(true);

      const data = await getStaff();

      setStaff(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStaff();
  }, []);

  return (
    <>
      <div className="space-y-8">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-bold text-white">
              Staff Management
            </h1>

            <p className="mt-2 text-gray-400">
              Manage employees, assign work and monitor reports.
            </p>

          </div>

          <button
            onClick={() => setOpenAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Staff
          </button>

        </div>

        {/* Search */}

        <div className="relative">

          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            placeholder="Search Staff..."
            className="w-full rounded-2xl border border-gray-700 bg-gray-900 py-4 pl-12 pr-4 outline-none focus:border-blue-500"
          />

        </div>

        {/* Staff Table */}

        {loading ? (

          <div className="rounded-2xl border border-gray-700 bg-gray-900 py-20 text-center">

            <p className="text-gray-400">
              Loading Staff...
            </p>

          </div>

        ) : staff.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-gray-700 bg-gray-900 py-24">

            <div className="flex flex-col items-center">

              <Users
                size={70}
                className="text-blue-500"
              />

              <h2 className="mt-6 text-3xl font-bold">
                No Staff Added
              </h2>

              <p className="mt-3 max-w-lg text-center text-gray-400">
                Create your first employee account.
                Staff can later complete their own profile,
                connect Google Login,
                receive tasks,
                upload reports and manage assigned projects.
              </p>

              <button
                onClick={() => setOpenAddModal(true)}
                className="mt-8 rounded-xl bg-blue-600 px-8 py-3 font-medium transition hover:bg-blue-700"
              >
                + Add First Staff
              </button>

            </div>

          </div>

        ) : (

          <StaffTable
            staff={staff}
            onView={(member: StaffType) => {
              setViewStaff(member);
              setOpenViewModal(true);
            }}
            onEdit={(member: StaffType) => {
              setEditingStaff(member);
              setOpenEditModal(true);
            }}
            onDelete={(member: StaffType) => {
              setDeleteStaffData(member);
              setOpenDeleteModal(true);
            }}
          />

        )}

      </div>

      {/* Add Staff */}

      <AddStaffModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onCreated={loadStaff}
      />

      {/* Edit Staff */}

      <EditStaffModal
        open={openEditModal}
        staff={editingStaff}
        onClose={() => {
          setOpenEditModal(false);
          setEditingStaff(null);
        }}
        onSaved={loadStaff}
      />

      {/* View Staff */}

      <ViewStaffModal
        open={openViewModal}
        staff={viewStaff}
        onClose={() => {
          setOpenViewModal(false);
          setViewStaff(null);
        }}
      />

      {/* Delete Staff */}

      <DeleteStaffModal
        open={openDeleteModal}
        staff={deleteStaffData}
        onClose={() => {
          setOpenDeleteModal(false);
          setDeleteStaffData(null);
        }}
        onDeleted={loadStaff}
      />
    </>
  );
}