import fs from "fs";
import generateInvoicePDF from "./utils/invoice/index.js";

const invoice = {
  invoiceNumber: "INV-2026-001",
  issueDate: new Date(),
  paymentDate: new Date(),
  status: "PAID",

  customer: {
    name: "John Doe",
    customerId: "ASC-2026-001",
    email: "john@example.com",
  },

  project: {
    name: "AiraSpark Website",
    projectId: "PRJ-001",
    service: "Web Development",
  },

  payment: {
    method: "UPI",
    status: "Paid",
    paymentId: "pay_test123",
    orderId: "order_test123",
    transactionId: "txn_test123",
  },

  items: [
    {
      description: "Website Development",
      quantity: 1,
      unitPrice: 50001,
      total: 50000,
    },
  ],
};

async function test() {
  const pdf = await generateInvoicePDF(invoice);

  fs.writeFileSync("test-invoice.pdf", pdf);

  console.log("✅ Invoice generated successfully!");
}

test().catch(console.error);