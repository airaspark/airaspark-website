import { auth } from "@/firebase";

async function authorizationHeader(): Promise<string> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in.");
  }

  return `Bearer ${await user.getIdToken()}`;
}

export interface DashboardStats {
  activeProjects: number;
  pendingInvoices: number;
  paymentsDue: number;
  totalReceipts: number;
}

export interface DashboardResponse {
  success: boolean;
  stats: DashboardStats;
  recentProjects: any[];
  recentReceipts: any[];
}

export async function getCustomerDashboard(): Promise<DashboardResponse> {
  const response = await fetch("/api/dashboard/customer", {
    headers: {
      Authorization: await authorizationHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ?? "Unable to load dashboard."
    );
  }

  return data;
}