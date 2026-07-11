import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Lock,
  CheckCircle2,
  CircleDot,
  LockKeyhole,
  CreditCard,
  FileText,
  Building2,
  Briefcase,
  IndianRupee,
} from "lucide-react";

const MOCK_INVOICE = {
  invoiceNumber: "AS-2026-0001",
  client: "ABC Industries",
  project: "Enterprise Inventory Management System",
  projectStatus: "UI Development",
  totalCost: 50000,
  paidAmount: 15000,
  completionPercent: 45,
  currentPhase: "UI Development",
  nextMilestone: "Backend Integration",
  milestones: [
    {
      id: 1,
      label: "Milestone 1",
      title: "30% Advance",
      amount: 15000,
      status: "PAID" as const,
    },
    {
      id: 2,
      label: "Milestone 2",
      title: "40% Development",
      amount: 20000,
      status: "PAY_NOW" as const,
    },
    {
      id: 3,
      label: "Milestone 3",
      title: "30% Final Delivery",
      amount: 15000,
      status: "LOCKED" as const,
    },
  ],
};

const CURRENT_MILESTONE = MOCK_INVOICE.milestones.find(
  (m) => m.status === "PAY_NOW"
)!;

const REMAINING_BALANCE =
  MOCK_INVOICE.totalCost - MOCK_INVOICE.paidAmount;

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

const inputClass =
  "w-full px-4 py-3.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#4C8DFF] focus:ring-1 focus:ring-[#4C8DFF]/30 transition-all duration-300";

const cardClass =
  "bg-white border border-[#E5E7EB] rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)]";

export default function Payment() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    invoiceNumber: "",
  });
  const [invoiceRetrieved, setInvoiceRetrieved] = useState(false);
  const [paymentOption, setPaymentOption] = useState<"milestone" | "custom">(
    "milestone"
  );
  const [customAmount, setCustomAmount] = useState("");

  const selectedAmount =
    paymentOption === "milestone"
      ? CURRENT_MILESTONE.amount
      : Math.min(
          Math.max(0, Number(customAmount) || 0),
          REMAINING_BALANCE
        );

  const selectedPaymentLabel =
    paymentOption === "milestone"
      ? "Development Milestone"
      : "Custom Payment";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleRetrieve(e: React.FormEvent) {
    e.preventDefault();
    setInvoiceRetrieved(true);
  }

  function handleCustomAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^\d]/g, "");
    const num = raw === "" ? "" : String(Math.min(Number(raw), REMAINING_BALANCE));
    setCustomAmount(num);
  }

  function handleProceed() {
    alert("Razorpay integration coming soon.");
  }

  return (
    <div className="min-h-screen">
      {/* Dark Hero Section */}
      <section className="relative bg-[#07111F] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4C8DFF]/30 to-transparent" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#4C8DFF]/12 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] bg-[#4C8DFF]/8 rounded-full blur-[80px]" />
          <div className="absolute top-1/3 -left-24 w-[300px] h-[300px] bg-[#2563EB]/10 rounded-full blur-[70px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-14 sm:pt-16 pb-28 sm:pb-32 text-center min-h-[260px] sm:min-h-[280px] flex flex-col justify-center"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#4C8DFF]/30 bg-[#4C8DFF]/10 text-[#4C8DFF] uppercase tracking-[0.25em] text-[10px] sm:text-xs font-semibold mb-6 mx-auto shadow-[0_0_24px_rgba(76,141,255,0.15)]">
            <Lock className="w-3 h-3" />
            Secure Payments
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold font-display uppercase tracking-tight text-white"
            style={{ textShadow: "0 0 48px rgba(76,141,255,0.25)" }}
          >
            Secure Payments
          </h1>

          <p className="mt-4 sm:mt-5 text-[#94A3B8] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Enter the invoice number provided by AiraSpark to retrieve your
            project payment details.
          </p>
        </motion.div>

        {/* Curved transition into white section */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent via-[#07111F]/40 to-[#F8FAFC]" />
          <svg
            className="relative w-full h-[72px] sm:h-[88px] block"
            viewBox="0 0 1440 88"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 44C240 88 480 0 720 44C960 88 1200 0 1440 44V88H0V44Z"
              fill="#F8FAFC"
            />
          </svg>
        </div>
      </section>

      {/* Premium White Content Area */}
      <div className="relative bg-[#F8FAFC] text-[#374151] -mt-px">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#4C8DFF]/[0.03] rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-16 sm:pb-24">
          {/* Section 1 — Customer Details */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`${cardClass} p-6 sm:p-8 mb-6`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center">
                <FileText className="w-4 h-4 text-[#4C8DFF]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-[#111827]">
                Customer Details
              </h2>
            </div>

            <form onSubmit={handleRetrieve} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  required
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                />
                <input
                  required
                  name="company"
                  placeholder="Company Name"
                  value={form.company}
                  onChange={handleChange}
                  className={inputClass}
                />
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                />
                <input
                  required
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <input
                  required
                  name="invoiceNumber"
                  placeholder="Invoice Number — e.g. AS-2026-0001"
                  value={form.invoiceNumber}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-[#4C8DFF] hover:bg-[#2563EB] text-white font-semibold text-base transition-all duration-300 shadow-[0_1px_3px_rgba(76,141,255,0.2),0_4px_16px_rgba(76,141,255,0.15)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.25)]"
              >
                <Search className="w-5 h-5" />
                Retrieve Invoice
              </button>
            </form>
          </motion.section>

          <AnimatePresence>
            {invoiceRetrieved && (
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Section 2 — Invoice Summary */}
                <section className={`${cardClass} p-6 sm:p-8`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-[#4C8DFF]" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold font-display text-[#111827]">
                      Invoice Summary
                    </h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    {[
                      { label: "Invoice Number", value: MOCK_INVOICE.invoiceNumber },
                      { label: "Client", value: MOCK_INVOICE.client },
                      { label: "Project", value: MOCK_INVOICE.project, wide: true },
                      { label: "Project Status", value: MOCK_INVOICE.projectStatus },
                      {
                        label: "Total Project Cost",
                        value: formatCurrency(MOCK_INVOICE.totalCost),
                        highlight: true,
                      },
                    ].map(({ label, value, wide, highlight }) => (
                      <div
                        key={label}
                        className={`${wide ? "sm:col-span-2" : ""} p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]`}
                      >
                        <p className="text-xs uppercase tracking-wider text-[#6B7280] mb-1">
                          {label}
                        </p>
                        <p
                          className={`text-base sm:text-lg font-semibold ${
                            highlight ? "text-[#4C8DFF] text-xl sm:text-2xl" : "text-[#111827]"
                          }`}
                        >
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Project Completion Progress */}
                <section className={`${cardClass} p-6 sm:p-8`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm uppercase tracking-wider text-[#6B7280] font-semibold">
                      Project Completion
                    </h3>
                    <span className="text-2xl font-bold text-[#4C8DFF] font-display">
                      {MOCK_INVOICE.completionPercent}%
                    </span>
                  </div>

                  <div className="h-3 rounded-full bg-[#E5E7EB] overflow-hidden mb-6">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${MOCK_INVOICE.completionPercent}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                      className="h-full rounded-full bg-[#4C8DFF]"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                      <p className="text-xs uppercase tracking-wider text-[#6B7280] mb-1">
                        Current Phase
                      </p>
                      <p className="text-base font-semibold text-[#111827]">
                        {MOCK_INVOICE.currentPhase}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                      <p className="text-xs uppercase tracking-wider text-[#6B7280] mb-1">
                        Estimated Next Milestone
                      </p>
                      <p className="text-base font-semibold text-[#111827]">
                        {MOCK_INVOICE.nextMilestone}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 3 — Payment Timeline */}
                <section className={`${cardClass} p-6 sm:p-8`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-[#4C8DFF]" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold font-display text-[#111827]">
                      Payment Milestones
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {MOCK_INVOICE.milestones.map((milestone, index) => (
                      <motion.div
                        key={milestone.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className={`relative p-5 rounded-xl border transition-all duration-300 ${
                          milestone.status === "PAY_NOW"
                            ? "bg-[#EFF6FF] border-[#BFDBFE] shadow-[0_1px_3px_rgba(76,141,255,0.1)]"
                            : milestone.status === "PAID"
                              ? "bg-emerald-50 border-emerald-200"
                              : "bg-[#F9FAFB] border-[#E5E7EB]"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-wider text-[#6B7280] mb-0.5">
                              {milestone.label}
                            </p>
                            <p className="text-lg font-semibold text-[#111827]">
                              {milestone.title}
                            </p>
                            <p className="text-xl font-bold text-[#4C8DFF] mt-1">
                              {formatCurrency(milestone.amount)}
                            </p>
                          </div>

                          <div className="shrink-0">
                            {milestone.status === "PAID" && (
                              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Paid
                              </span>
                            )}
                            {milestone.status === "PAY_NOW" && (
                              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#4C8DFF] border border-[#BFDBFE]">
                                <CircleDot className="w-3.5 h-3.5" />
                                Pay Now
                              </span>
                            )}
                            {milestone.status === "LOCKED" && (
                              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]">
                                <LockKeyhole className="w-3.5 h-3.5" />
                                Locked
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Section 4 — Payment Options */}
                <section className={`${cardClass} p-6 sm:p-8`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-[#4C8DFF]" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold font-display text-[#111827]">
                      Payment Options
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <label
                      className={`flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all duration-300 ${
                        paymentOption === "milestone"
                          ? "bg-[#EFF6FF] border-[#BFDBFE]"
                          : "bg-[#F9FAFB] border-[#E5E7EB] hover:border-[#D1D5DB]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentOption"
                        checked={paymentOption === "milestone"}
                        onChange={() => setPaymentOption("milestone")}
                        className="mt-1 accent-[#4C8DFF]"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-[#111827]">
                          Pay Current Milestone
                        </p>
                        <p className="text-2xl font-bold text-[#4C8DFF] mt-1">
                          {formatCurrency(CURRENT_MILESTONE.amount)}
                        </p>
                      </div>
                    </label>

                    <label
                      className={`flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all duration-300 ${
                        paymentOption === "custom"
                          ? "bg-[#EFF6FF] border-[#BFDBFE]"
                          : "bg-[#F9FAFB] border-[#E5E7EB] hover:border-[#D1D5DB]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentOption"
                        checked={paymentOption === "custom"}
                        onChange={() => setPaymentOption("custom")}
                        className="mt-1 accent-[#4C8DFF]"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-[#111827] mb-3">
                          Custom Payment
                        </p>
                        {paymentOption === "custom" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                          >
                            <label className="block text-xs uppercase tracking-wider text-[#6B7280] mb-2">
                              Enter Custom Amount
                            </label>
                            <div className="relative">
                              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                              <input
                                type="text"
                                inputMode="numeric"
                                placeholder="0"
                                value={customAmount}
                                onChange={handleCustomAmountChange}
                                className={`${inputClass} pl-10`}
                              />
                            </div>
                            <p className="text-xs text-[#6B7280] mt-2">
                              Maximum: {formatCurrency(REMAINING_BALANCE)} (remaining
                              balance)
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </label>
                  </div>
                </section>

                {/* Section 5 — Payment Summary */}
                <section className={`${cardClass} p-6 sm:p-8`}>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-[#111827] mb-6">
                    Payment Summary
                  </h2>

                  <div className="space-y-4">
                    {[
                      { label: "Invoice", value: MOCK_INVOICE.invoiceNumber },
                      { label: "Selected Payment", value: selectedPaymentLabel },
                      {
                        label: "Amount",
                        value: formatCurrency(selectedAmount),
                        highlight: true,
                      },
                      { label: "Platform", value: "Razorpay Secure Checkout" },
                    ].map(({ label, value, highlight }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between py-3 border-b border-[#E5E7EB] last:border-0"
                      >
                        <span className="text-sm text-[#6B7280]">{label}</span>
                        <span
                          className={`font-semibold ${
                            highlight
                              ? "text-[#4C8DFF] text-xl"
                              : "text-[#111827]"
                          }`}
                        >
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section 6 — Proceed to Razorpay */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleProceed}
                  disabled={
                    paymentOption === "custom" &&
                    (!customAmount || Number(customAmount) <= 0)
                  }
                  className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-[#4C8DFF] hover:bg-[#2563EB] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base sm:text-lg uppercase tracking-wider transition-all duration-300 shadow-[0_1px_3px_rgba(76,141,255,0.2),0_8px_24px_rgba(76,141,255,0.2)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.3)] font-display"
                >
                  <Lock className="w-5 h-5" />
                  Proceed to Razorpay
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
