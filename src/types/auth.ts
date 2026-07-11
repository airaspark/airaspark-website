export type UserRole = "admin" | "staff" | "customer" | "pending";

export interface UserProfile {
  uid: string;
  email: string | null;
  phone: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  entityId: string | null;
  isLinked: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  initialized: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface CustomerLoginCredentials {
  customerId: string;
  password: string;
  rememberMe?: boolean;
}

export interface LinkCustomerCredentials {
  customerId: string;
  password: string;
}
