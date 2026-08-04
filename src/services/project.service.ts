import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  updateDoc,
  doc,
  orderBy,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/firebase";
import { COLLECTIONS } from "@/utils/constants";
import type { Installment, Project } from "@/types";
import { timestampToIso } from "@/services/idGenerator.service";

function mapProjectDoc(
  id: string,
  data: Record<string, unknown>
): Project {
  return {
    id,

    projectId: data.projectId as string,
    customerId: data.customerId as string,
    customerName: data.customerName as string,

    title: data.title as string,
    description: data.description as string,

    assignedStaffIds:
      (data.assignedStaffIds as string[]) ?? [],
   status: data.status as Project["status"],

    

    priority: data.priority as Project["priority"],

    progress: (data.progress as number) ?? 0,

    budget: (data.budget as number) ?? 0,

    totalCost: (data.totalCost as number) ?? 0,

    paidAmount: (data.paidAmount as number) ?? 0,

    startDate: data.startDate as string,

    deadline: data.deadline as string,

    paymentPlan: (data.paymentPlan as Project["paymentPlan"]) ?? "30_40_30",
    milestonePercentages: (data.milestonePercentages as number[]) ?? [30, 40, 30],

    createdAt: timestampToIso(data.createdAt as never),

    updatedAt: timestampToIso(data.updatedAt as never),
  };
}

export async function getProjects(): Promise<Project[]> {
  const q = query(
    collection(db, COLLECTIONS.projects),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) =>
    mapProjectDoc(docSnap.id, docSnap.data())
  );
}

export async function getProjectById(
  id: string
): Promise<Project | null> {
  const docRef = doc(db, COLLECTIONS.projects, id);

  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  return mapProjectDoc(snapshot.id, snapshot.data());
}

export async function createProject(
  project: Omit<Project, "id" | "createdAt" | "updatedAt">
): Promise<void> {
  const percentages = project.milestonePercentages;
  if (!percentages.length || percentages.some((value) => !Number.isFinite(value) || value <= 0) ||
      percentages.reduce((total, value) => total + value, 0) !== 100) {
    throw new Error("Installment percentages must be positive and total exactly 100%.");
  }

  const batch = writeBatch(db);
  const projectRef = doc(collection(db, COLLECTIONS.projects));
  const now = serverTimestamp();
  batch.set(projectRef, { ...project, createdAt: now, updatedAt: now });

  buildInstallments(project).forEach((installment) => {
    batch.set(doc(db, COLLECTIONS.installments, installment.installmentId), {
      ...installment,
      createdAt: now,
      updatedAt: now,
    });
  });
  await batch.commit();
}

function dateForInstallment(startDate: string, deadline: string, sequence: number, count: number): string | null {
  if (!startDate) return null;
  const start = new Date(`${startDate}T00:00:00.000Z`);
  const end = deadline ? new Date(`${deadline}T00:00:00.000Z`) : start;
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  const offset = count === 1 ? 0 : ((end.getTime() - start.getTime()) * (sequence - 1)) / (count - 1);
  return new Date(start.getTime() + offset).toISOString().slice(0, 10);
}

export function buildInstallments(
  project: Omit<Project, "id" | "createdAt" | "updatedAt">
): Omit<Installment, "id" | "createdAt" | "updatedAt">[] {
  const installments: Omit<
    Installment,
    "id" | "createdAt" | "updatedAt"
  >[] = project.milestonePercentages.map((percentage, index) => ({
    installmentId: `${project.projectId}-INS-${String(index + 1).padStart(2, "0")}`,

    projectId: project.projectId,
    customerId: project.customerId,

    sequence: index + 1,
    percentage,

    amount: Math.round(
      project.budget * (percentage / 100) * 100
    ) / 100,

    status: "pending",

    // Only the first installment is unlocked
    locked: index === 0 ? false : true,

    dueDate: dateForInstallment(
      project.startDate,
      project.deadline,
      index + 1,
      project.milestonePercentages.length
    ),

    paidAt: null,
    paymentId: null,
  }));

  const amountBeforeFinalInstallment = installments
    .slice(0, -1)
    .reduce((total, installment) => total + installment.amount, 0);

  installments[installments.length - 1].amount =
    Math.round(
      (project.budget - amountBeforeFinalInstallment) * 100
    ) / 100;

  return installments;
}

export async function updateProject(
  id: string,
  data: Partial<Project>
): Promise<void> {
  await updateDoc(
    doc(db, COLLECTIONS.projects, id),
    {
      ...data,
      updatedAt: new Date(),
    }
  );
}

export async function deleteProject(id: string): Promise<void> {
  // Get the project first
  const projectRef = doc(db, COLLECTIONS.projects, id);
  const projectSnap = await getDoc(projectRef);

  if (!projectSnap.exists()) {
    throw new Error("Project not found.");
  }

  const project = projectSnap.data() as Project;

  // Find all installments belonging to this project
  const installmentQuery = query(
    collection(db, COLLECTIONS.installments),
    where("projectId", "==", project.projectId)
  );

  const installmentSnapshot = await getDocs(installmentQuery);

  // Batch delete
  const batch = writeBatch(db);

  installmentSnapshot.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  batch.delete(projectRef);

  await batch.commit();
}
export async function getProjectsByCustomer(
  customerId: string
): Promise<Project[]> {
  const q = query(
    collection(db, COLLECTIONS.projects),
    where("customerId", "==", customerId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) =>
    mapProjectDoc(docSnap.id, docSnap.data())
  );
}
