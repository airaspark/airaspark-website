import { useEffect, useState } from "react";
import SearchSelect from "@/components/common/SearchSelect";
import { getCustomers } from "@/services/customer.service";
import type { Customer } from "@/types";

interface Props {
  value: Customer | null;
  onChange: (customer: Customer) => void;
}

export default function CustomerSelector({
  value,
  onChange,
}: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    async function loadCustomers() {
      const data = await getCustomers();
      setCustomers(data);
    }

    loadCustomers();
  }, []);

  return (
    <div className="space-y-3">

      <label className="text-sm font-medium">
        Customer
      </label>

      <SearchSelect
        items={customers}
        value={value}
        onChange={onChange}
        getLabel={(customer) => customer.company}
        getSubLabel={(customer) => customer.customerId}
      />

      {value && (
        <div className="rounded-xl border border-blue-600 bg-blue-600/10 p-4">

          <p>
            <strong>Customer ID:</strong> {value.customerId}
          </p>

          <p>
            <strong>Company:</strong> {value.company}
          </p>

          <p>
            <strong>Name:</strong> {value.name}
          </p>

          <p>
            <strong>Email:</strong> {value.email}
          </p>

          <p>
            <strong>Phone:</strong> {value.phone}
          </p>

        </div>
      )}

    </div>
  );
}