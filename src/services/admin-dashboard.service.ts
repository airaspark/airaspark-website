import { auth } from "@/firebase";

async function authorizationHeader(): Promise<string> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in.");
  }

  return `Bearer ${await user.getIdToken()}`;
}

export interface AdminDashboardStats {
  totalCustomers: number;
  totalStaff: number;
  activeProjects: number;
  completedProjects: number;
  totalRevenue: number;
  totalPayments: number;
  pendingReceipts: number;
  totalReviews: number;
}

export interface AdminDashboardResponse {
  success: boolean;

  stats: AdminDashboardStats;

  recentProjects: any[];

  recentPayments: any[];

  pendingReceipts: any[];
}

export async function getAdminDashboard(): Promise<AdminDashboardResponse> {
  const response = await fetch(
    "/api/dashboard/admin",
    {
      method: "GET",

      headers: {
        Authorization:
          await authorizationHeader(),
      },
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ??
        "Unable to load admin dashboard."
    );
  }

  return data;
}