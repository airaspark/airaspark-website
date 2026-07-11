export interface Staff {
  id: string;

  staffId: string;

  firebaseUid: string | null;

  authEmail: string;

  passwordHash: string;

  name: string;

  email: string;

  phone: string;

  photo: string;

  department: string;

  designation: string;

  status: "Active" | "Inactive";

  googleLinked: boolean;

  profileCompleted: boolean;

  assignedProjects: string[];

  skills: string[];

  totalProjects: number;

  completedProjects: number;

  totalHours: number;

  createdAt: string;

  updatedAt: string;
}