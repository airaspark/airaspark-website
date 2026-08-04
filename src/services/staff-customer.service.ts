import { auth } from "@/firebase";

async function authorizationHeader(): Promise<string> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in.");
  }

  return `Bearer ${await user.getIdToken()}`;
}

export interface StaffCustomer {
  id: string;

  customerId: string;

  name: string;

  company: string;

  email: string;

  phone: string;

  activeProjects: number;
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
      data.message ?? "Unable to load customers."
    );
  }

  return data;
}

export interface StaffCustomersResponse {
  success: true;

  customers: StaffCustomer[];
}
export async function getStaffCustomers(): Promise<StaffCustomersResponse> {
  return api<StaffCustomersResponse>(
    "/api/staff/customers"
  );
}