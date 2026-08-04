import { auth } from "@/firebase";

async function authorizationHeader(): Promise<string> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in.");
  }

  return `Bearer ${await user.getIdToken()}`;
}

export interface StaffDashboardStats {
  assignedCustomers: number;
  activeProjects: number;
  pendingUploads: number;
  dueMilestones: number;
}

export interface StaffProject {
  id: string;
  projectId: string;
  title: string;
  customerId: string;
  customerName: string;
  status: string;
  updatedAt: string;
}

export interface StaffPayment {
  id: string;
  paymentId: string;
  customerId: string;
  customerName: string;
  projectId: string;
  projectName: string;
  amount: number;
  paymentMethod: string | null;
  paidAt: string;
}

export interface StaffCustomer {
  id: string;
  customerId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
}

export interface StaffDashboardResponse {
  success: true;

  stats: StaffDashboardStats;

  recentProjects: StaffProject[];

  recentPayments: StaffPayment[];

  customers: StaffCustomer[];
}

async function api<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    method: "GET",
    headers: {
      Authorization: await authorizationHeader(),
    },
  });

  const data = (await response.json()) as {
    success: boolean;
    message?: string;
  } & T;

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ?? "Unable to load staff dashboard."
    );
  }

  return data;
}
export async function getStaffDashboard(): Promise<StaffDashboardResponse> {
  return api<StaffDashboardResponse>(
    "/api/dashboard/staff"
  );
}