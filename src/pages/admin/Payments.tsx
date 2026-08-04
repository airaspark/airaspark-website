import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getInstallmentsByCustomer } from "@/services/installment.service";
import { getProjects } from "@/services/project.service";
import {
  getPaymentHistory,
  getPaymentsByCustomer,
} from "@/services/payment-history.service";
import type { Installment, Payment, Project } from "@/types";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });

export default function AdminPayments() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId") ?? "";
  useEffect(() => { void (async () => {
    try { const projectData = await getProjects(); const [installmentData, paymentData] = await Promise.all([(await Promise.all(projectData.map((project) => getInstallmentsByCustomer(project.customerId)))).flat(), customerId ? getPaymentsByCustomer(customerId) : getPaymentHistory()]); setProjects(projectData); setInstallments(installmentData.filter((item, index, all) => all.findIndex((candidate) => candidate.installmentId === item.installmentId) === index)); setPayments(paymentData); }
    finally { setLoading(false); }
  })(); }, [customerId]);
  const totals = useMemo(() => ({ total: installments.reduce((sum, item) => sum + item.amount, 0), paid: installments.filter((item) => item.status === "paid").reduce((sum, item) => sum + item.amount, 0), overdue: installments.filter((item) => item.status === "pending" && item.dueDate !== null && item.dueDate < new Date().toISOString().slice(0, 10)) }), [installments]);
  const projectById = new Map(projects.map((project) => [project.projectId, project]));
  if (loading) return <div className="py-20 text-center text-gray-400">Loading payment dashboard...</div>;
  return <div className="space-y-6"><div><h1 className="text-4xl font-bold">Payments</h1><p className="text-gray-400">Project installment and collection overview.</p></div>
    <div className="grid gap-4 md:grid-cols-4">{[{ label: "Total Amount", value: totals.total }, { label: "Paid Amount", value: totals.paid }, { label: "Remaining Amount", value: totals.total - totals.paid }, { label: "Overdue", value: totals.overdue.reduce((sum, item) => sum + item.amount, 0) }].map((card) => <div key={card.label} className="rounded-2xl border border-gray-700 bg-gray-900 p-5"><p className="text-sm text-gray-400">{card.label}</p><p className="mt-2 text-2xl font-bold">{currency.format(card.value)}</p></div>)}</div>
    <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6"><h2 className="mb-4 text-xl font-bold">Upcoming Installments</h2><div className="space-y-3">{installments.filter((item) => item.status !== "paid").map((item) => <div key={item.installmentId} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-800/60 p-4"><div><p className="font-medium">{projectById.get(item.projectId)?.title ?? item.projectId} · Installment {item.sequence}</p><p className="text-sm text-gray-400">Due {item.dueDate ?? "—"}</p></div><div className="flex items-center gap-4"><span>{currency.format(item.amount)}</span><span className="text-amber-400">{item.status}</span></div></div>)}</div></div>
    <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6"><h2 className="mb-4 text-xl font-bold">Payment History</h2><div className="space-y-3">{payments.length === 0 ? <p className="text-gray-400">No verified payments yet.</p> : payments.map((payment) => <div key={payment.paymentId} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-800/60 p-4"><div><p className="font-medium">{projectById.get(payment.projectId)?.title ?? payment.projectId}</p><p className="text-sm text-gray-400">{payment.paymentId} · {payment.method ?? "Razorpay"} · {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString("en-IN") : "—"}</p></div><span className="font-semibold text-emerald-400">{currency.format(payment.amount)}</span></div>)}</div></div>
  </div>;
}
