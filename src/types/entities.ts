import type { UserRole } from "./auth";

export type IdPrefix =
  | "ADM"
  | "STF"
  | "ASC"
  | "PR"
  | "INV"
  | "PAY"
  | "DOC"
  | "MS"
  | "QUO"
  | "AGR"
  | "RCP"
  | "CER"
  | "REV";

export type ReviewStatus = "pending" | "approved" | "rejected";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentPlan = "100_advance" | "50_50" | "30_40_30" | "custom";
export type MilestoneStatus = "locked" | "pay_now" | "paid";
export type PaymentRequestStatus = "pending" | "approved" | "rejected";

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer extends BaseEntity {
  customerId: string;
  firebaseUid: string | null;
  authEmail: string;
  passwordHash: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  website?: string;
  gst?: string;
  industry?: string;
  assignedStaffIds: string[];
  isActive: boolean;
}

export interface StaffMember extends BaseEntity {
  staffId: string;
  firebaseUid: string | null;
  authEmail: string;
  passwordHash: string;
  name: string;
  email: string;
  phone: string;
  assignedCustomerIds: string[];
  isActive: boolean;
}

export interface Admin extends BaseEntity {
  adminId: string;
  firebaseUid: string | null;
  authEmail: string;
  passwordHash: string;
  name: string;
  email: string;
  isActive: boolean;
}

export interface Project extends BaseEntity {
  projectId: string;
  customerId: string;
  customerName: string;

  title: string;
  description: string;

  // Reserved for future Staff module
  assignedStaffIds: string[];

  status:
    | "Planning"
    | "In Progress"
    | "On Hold"
    | "Completed";

  priority:
    | "Low"
    | "Medium"
    | "High"
    | "Critical";

  progress: number;

  budget: number;
  totalCost: number;
  paidAmount: number;

  startDate: string;
  deadline: string;

  paymentPlan: PaymentPlan;
  milestonePercentages: number[];
}

export interface Invoice extends BaseEntity {
  invoiceId: string;
  projectId: string;
  customerId: string;
  amount: number;
  status: string;
  dueDate: string | null;
}

export interface Payment extends BaseEntity {
  paymentId: string;
  projectId: string;
  customerId: string;
  installmentId: string;
  amount: number;
  status: PaymentStatus;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  method: string | null;
  paidAt: string | null;
}

export interface Installment extends BaseEntity {
  installmentId: string;
  projectId: string;
  customerId: string;

  sequence: number;
  percentage: number;
  amount: number;

  status: PaymentStatus;

  locked: boolean;

  dueDate: string | null;

  paidAt: string | null;
  paymentId: string | null;
}

export interface Receipt extends BaseEntity {
  receiptId: string;
  receiptNumber: string;

  installmentId: string;

  invoiceNumber?: string;

  paymentId: string;

  projectId: string;
  customerId: string;

  customerName: string;
  projectName: string;

  amount: number;

  paymentMethod: string | null;

  razorpayPaymentId: string;

  paymentDate: string;

  pdfUrl: string | null;
}

export interface PaymentRequest extends BaseEntity {
  requestId: string;
  customerId: string;
  projectId: string;
  invoiceId: string;
  amount: number;
  status: PaymentRequestStatus;
  reason: string;
}

export interface Milestone extends BaseEntity {
  milestoneId: string;
  projectId: string;
  index: number;
  title: string;
  percentage: number;
  amount: number;
  status: MilestoneStatus;
}

export interface DocumentRecord extends BaseEntity {
  documentId: string;
  projectId: string;
  customerId: string;
  name: string;
  type: string;
  storagePath: string;
  uploadedBy: string;
  downloadUrl: string;
}

export interface Review extends BaseEntity {
  reviewId: string;
  name: string;
  company: string;
  email: string;
  content: string;
  rating: number | null;
  status: ReviewStatus;
  customerId: string | null;
  isPublic: boolean;
}

export interface ActivityLog extends BaseEntity {
  logId: string;
  userId: string;
  userRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, unknown>;
}

export interface Notification extends BaseEntity {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: string;
  link: string | null;
}

export interface AppSettings extends BaseEntity {
  defaultMilestonePercentages: [number, number, number];
  supportEmail: string;
  companyName: string;
}

export interface IdCounter {
  admin: number;
  staff: number;
  customer: number;
  project: number;
  invoice: number;
  payment: number;
  review: number;
}
