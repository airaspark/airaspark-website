import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { addCustomer } from "@/services/customer.service";
import { hashPassword , updateCustomer,} from "@/services/customer.service";
import type { Customer } from "@/types";

interface AddCustomerModalProps {
  onClose: () => void;
  customer?: Customer | null;
  isEdit?: boolean;
}

export default function AddCustomerModal({
  onClose,
  customer,
  isEdit = false,
}: AddCustomerModalProps) {

    const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [saving, setSaving] = useState(false);
  useEffect(() => {
  if (!customer) return;

  setName(customer.name);
  setCompany(customer.company);
  setEmail(customer.email);
  setPhone(customer.phone);
}, [customer]);
  async function handleSave() {
    console.log("HANDLE SAVE STARTED");
   if (!name || !company || !email || !phone) {
  alert("Please fill all required fields.");
  return;
}

if (!isEdit && !password) {
  alert("Please enter a temporary password.");
  return;
}

    try {
  setSaving(true);

  if (isEdit && customer) {
    await updateCustomer(customer.id, {
      name,
      company,
      email,
      phone,
      authEmail: email,
    });
  } else {
    const passwordHash = await hashPassword(password);

    const customerId = `ASC-${new Date().getFullYear()}-${Date.now()
      .toString()
      .slice(-3)}`;

    await addCustomer({
      customerId,
      name,
      company,
      email,
      phone,
      passwordHash,
    });
  }

  console.log("CUSTOMER ADDED");

  alert("Customer saved successfully.");
  onClose();
} catch (error) {
  console.error(error);
  alert("Failed to save customer.");
} finally {
  setSaving(false);
}
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[var(--portal-border)] bg-[var(--portal-card)] p-8">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-[var(--portal-muted)] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="mb-6 text-2xl font-bold text-[var(--portal-text)]">
  {isEdit ? "Edit Customer" : "Add Customer"}
</h2>

        <div className="grid grid-cols-2 gap-4">
         <input
  className="portal-input"
  placeholder="Customer Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
         <input
  className="portal-input"
  placeholder="Company Name"
  value={company}
  onChange={(e) => setCompany(e.target.value)}
/>
          <input
  className="portal-input"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
          <input
  className="portal-input"
  placeholder="Phone Number"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
/>
          <input
  className="portal-input"
  placeholder="temproary password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="portal-btn-secondary">
            Cancel
          </button>
         <button
  type="button"
  onClick={() => {
    console.log("SAVE BUTTON CLICKED");
    handleSave();
  }}
  disabled={saving}
  className="portal-btn-primary"
>
 {saving
  ? "Saving..."
  : isEdit
  ? "Update Customer"
  : "Save Customer"}
</button>
        </div>
      </div>
    </div>
  );
}
