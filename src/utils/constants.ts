import type { IdPrefix } from "@/types";

export const APP_NAME = "AiraSpark";
export const SUPPORT_EMAIL = "contact@airaspark.com";

export const ID_PREFIXES: Record<
  "admin" | "staff" | "customer" | "project" | "invoice" | "payment" | "review",
  IdPrefix
> = {
  admin: "ADM",
  staff: "STF",
  customer: "ASC",
  project: "PR",
  invoice: "INV",
  payment: "PAY",
  review: "REV",
};

export const COLLECTIONS = {
  users: "users",
  customers: "customers",
  staff: "staff",
  admins: "admins",
  projects: "projects",
  payments: "payments",
  installments: "installments",
  receipts: "receipts",
  paymentRequests: "paymentRequests",
  milestones: "milestones",
  documents: "documents",
  reviews: "reviews",
  activityLogs: "activityLogs",
  notifications: "notifications",
  settings: "settings",
  counters: "counters",
  dailyReports: "dailyReports",
} as const;

export const STORAGE_FOLDERS = {
  agreements: "agreements",
  quotations: "quotations",
  receipts: "receipts",
  completionCertificates: "completion-certificates",
  projectImages: "project-images",
  documents: "documents",
  profileImages: "profile-images",
} as const;

export const DEFAULT_MILESTONE_PERCENTAGES: [number, number, number] = [
  30, 40, 30,
];

export const ROLE_DASHBOARD_PATHS = {
  admin: "/admin/dashboard",
  staff: "/staff/dashboard",
  customer: "/customer/dashboard",
  pending: "/link-account",
} as const;

export const REMEMBER_ME_KEY = "airaspark_remember_me";
