import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  where,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/firebase";
import { COLLECTIONS } from "@/utils/constants";

import type {
  DailyReport,
  CreateDailyReport,
} from "@/types/dailyReport";

function mapReport(
  id: string,
  data: Record<string, unknown>
): DailyReport {
  return {
    id,

    reportId: data.reportId as string,

    staffId: data.staffId as string,

    staffName: data.staffName as string,

    work: data.work as string,

    hoursWorked: data.hoursWorked as number,

    status: data.status as
      | "Completed"
      | "In Progress"
      | "Pending",

    achievement: data.achievement as string,

    problems: data.problems as string,

    tomorrowPlan: data.tomorrowPlan as string,

    reportDate: data.reportDate as string,

    submittedAt:
      data.submittedAt instanceof Timestamp
        ? data.submittedAt.toDate().toISOString()
        : String(data.submittedAt),
  };
}

export async function createDailyReport(
  report: CreateDailyReport
) {
  const docRef = await addDoc(
    collection(db, COLLECTIONS.dailyReports),
    {
      reportId: "",

      staffId: report.staffId,

      staffName: report.staffName,

      work: report.work,

      hoursWorked: report.hoursWorked,

      status: report.status,

      achievement: report.achievement,

      problems: report.problems,
      
      tomorrowPlan: report.tomorrowPlan,

      reportDate: new Date()
        .toISOString()
        .split("T")[0],

      submittedAt: new Date(),
    }
  );

  await updateDoc(docRef, {
    reportId: docRef.id,
  });

  return docRef.id;
}

export async function getDailyReports() {
  const q = query(
    collection(db, COLLECTIONS.dailyReports),
    orderBy("submittedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) =>
    mapReport(docSnap.id, docSnap.data())
  );
}

export async function getDailyReportsByStaff(
  staffId: string
) {
  const q = query(
    collection(db, COLLECTIONS.dailyReports),
    where("staffId", "==", staffId),
    orderBy("submittedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) =>
    mapReport(docSnap.id, docSnap.data())
  );
}

export async function getTodayReport(
  staffId: string
) {
  const today = new Date()
    .toISOString()
    .split("T")[0];

  const q = query(
    collection(db, COLLECTIONS.dailyReports),
    where("staffId", "==", staffId),
    where("reportDate", "==", today)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  return mapReport(
    snapshot.docs[0].id,
    snapshot.docs[0].data()
  );
}

export async function updateDailyReport(
  id: string,
  data: Partial<CreateDailyReport>
) {
  await updateDoc(
    doc(db, COLLECTIONS.dailyReports, id),
    {
      ...data,
    }
  );
}

export async function deleteDailyReport(
  id: string
) {
  await deleteDoc(
    doc(db, COLLECTIONS.dailyReports, id)
  );
}