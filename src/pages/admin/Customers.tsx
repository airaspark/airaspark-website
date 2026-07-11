import { useEffect, useState } from "react";
import AddCustomerModal from "@/components/admin/AddCustomerModal";
import {
  getCustomers,
  deleteCustomer,
} from "@/services/customer.service";
import type { Customer } from "@/types";
import { useNavigate } from "react-router-dom";


export default function Customers() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const navigate = useNavigate();

async function loadCustomers() {
  try {
    setLoading(true);

    const data = await getCustomers();

    setCustomers(data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  loadCustomers();
}, []);
function handleEdit(customer: Customer) {
  alert("Edit clicked!");

  console.log("Edit clicked:", customer);

  setSelectedCustomer(customer);
  setIsEditMode(true);
  setIsAddModalOpen(true);
}
async function handleDelete(id: string)
 {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this customer?"
  );

  if (!confirmDelete) return;

  try {
    await deleteCustomer(id);

    await loadCustomers();

    alert("Customer deleted successfully.");
  } catch (error) {
    console.error(error);

    alert("Failed to delete customer.");
  }
}
const filteredCustomers = customers.filter((customer) => {
  const keyword = search.toLowerCase();

  return (
    customer.customerId.toLowerCase().includes(keyword) ||
    customer.name.toLowerCase().includes(keyword) ||
    customer.company.toLowerCase().includes(keyword) ||
    customer.email.toLowerCase().includes(keyword) ||
    customer.phone.toLowerCase().includes(keyword)
  );
});
const totalCustomers = customers.length;

const activeCustomers = customers.filter(
  (customer) => customer.isActive
).length;

const inactiveCustomers = customers.filter(
  (customer) => !customer.isActive
).length;

  return (
    <div>
    <h1 className="text-3xl font-bold mb-6">Customers</h1>

<button

  className="portal-btn-primary mb-4"

  onClick={() => setIsAddModalOpen(true)}

>

  Add Customer

</button>

{/* Search Box */}

<div className="mb-6">

  <input

    type="text"

    placeholder="Search customers..."

    value={search}

    onChange={(e) => setSearch(e.target.value)}

    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"

  />

</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  <div className="rounded-xl bg-gray-800 p-5 border border-gray-700">
    <p className="text-gray-400 text-sm">Total Customers</p>
    <h2 className="text-3xl font-bold text-white">{totalCustomers}</h2>
  </div>

  <div className="rounded-xl bg-gray-800 p-5 border border-gray-700">
    <p className="text-gray-400 text-sm">Active Customers</p>
    <h2 className="text-3xl font-bold text-green-400">
      {activeCustomers}
    </h2>
  </div>

  <div className="rounded-xl bg-gray-800 p-5 border border-gray-700">
    <p className="text-gray-400 text-sm">Inactive Customers</p>
    <h2 className="text-3xl font-bold text-red-400">
      {inactiveCustomers}
    </h2>
  </div>
</div>

{isAddModalOpen && (

  <AddCustomerModal
    onClose={() => {
      setIsAddModalOpen(false);
      setSelectedCustomer(null);
      setIsEditMode(false);
      loadCustomers();
    }}
    customer={selectedCustomer}
    isEdit={isEditMode}
  />
)}

     {loading ? (
  <p className="text-gray-400">Loading customers...</p>
) : customers.length === 0 ? (
  <p className="text-gray-400">No customers found.</p>
) : (
  <div className="overflow-x-auto">
    <table className="min-w-full border border-gray-700 rounded-lg">
      <thead>
        <tr className="bg-gray-800 text-white">
          <th className="p-3 text-left">Customer ID</th>
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-left">Company</th>
          <th className="p-3 text-left">Email</th>
          <th className="p-3 text-left">Phone</th>
          <th className="p-3 text-left">Status</th>
          <th className="p-3 text-left">Actions</th>
        </tr>
      </thead>

      <tbody>
        {filteredCustomers.map((customer) => (
          <tr
            key={customer.id}
            className="border-t border-gray-700 hover:bg-gray-800"
          >
            <td className="p-3">{customer.customerId}</td>
            <td className="p-3">
  <button
    onClick={() => navigate(`/admin/customers/${customer.id}`)}
    className="text-blue-400 hover:underline"
  >
    {customer.name}
  </button>
</td>
            <td className="p-3">{customer.company}</td>
            <td className="p-3">{customer.email}</td>
            <td className="p-3">{customer.phone}</td>
            <td className="p-3">
              {customer.isActive ? "🟢 Active" : "🔴 Inactive"}
            </td>
            <td className="p-3 flex gap-2">
  <button
    onClick={() => handleEdit(customer)}
    className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
  >
    Edit
  </button>

  <button
    onClick={() => handleDelete(customer.id)}
    className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
  >
    Delete
  </button>
</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
    </div>
  );
}