import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  getDoc,
} from "firebase/firestore";

import { db } from "@/firebase";
import { COLLECTIONS } from "@/utils/constants";
import type { Project } from "@/types";
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

    milestonePercentages:
      (data.milestonePercentages as [
        number,
        number,
        number
      ]) ?? [40, 30, 30],

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
) {
  return await addDoc(
    collection(db, COLLECTIONS.projects),
    {
      ...project,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );
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

export async function deleteProject(
  id: string
): Promise<void> {
  await deleteDoc(
    doc(db, COLLECTIONS.projects, id)
  );
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