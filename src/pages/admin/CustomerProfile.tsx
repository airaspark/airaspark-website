import {  useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCustomerById } from "@/services/customer.service";
import type { Customer } from "@/types";
import CustomerHeader from "@/components/admin/customer/CustomerHeader";
import CustomerInfo from "@/components/admin/customer/CustomerInfo";
import CustomerActions from "@/components/admin/customer/CustomerActions";
import CustomerStats from "@/components/admin/customer/CustomerStats";
import CustomerProjects from "@/components/admin/customer/CustomerProjects";
import CustomerInvoices from "@/components/admin/customer/CustomerInvoices";
import CustomerPayments from "@/components/admin/customer/CustomerPayments";
import CustomerDocuments from "@/components/admin/customer/CustomerDocuments";
import CustomerTimeline from "@/components/admin/customer/CustomerTimeline";


export default function CustomerProfile() {
  
const { id } = useParams();

const [customer, setCustomer] = useState<Customer | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadCustomer() {
    if (!id) return;

    try {
      const data = await getCustomerById(id);

      setCustomer(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  loadCustomer();
}, [id]);
if (loading) {
  return (
    <div className="flex h-96 items-center justify-center">
      <p className="text-gray-400 text-xl">
        Loading customer...
      </p>
    </div>
  );
}

if (!customer) {
  return (
    <div className="flex h-96 items-center justify-center">
      <p className="text-red-400 text-xl">
        Customer not found.
      </p>
    </div>
  );
}

  return (
    <div className="space-y-6">

      {/* Header */}

      <CustomerHeader />

      <div className="grid grid-cols-12 gap-6">

        {/* LEFT CARD */}

        <div className="col-span-9">
          <CustomerInfo customer={customer} />
        </div>

        {/* ACTIONS */}

       

        <div className="col-span-3">
          <CustomerActions customer={customer} />
        </div>

      </div>

      <CustomerStats />
      
      
      <div className="grid grid-cols-3 gap-6">
  <CustomerProjects />

  <CustomerInvoices />

  <CustomerPayments />
</div>

<div className="grid grid-cols-3 gap-6">
  <CustomerDocuments />

  <div className="col-span-2">
    <CustomerTimeline />
  </div>
</div>

    </div>
  );
}

 

