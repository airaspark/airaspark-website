import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoadingScreen from "@/components/ui/LoadingScreen";
import type { UserRole } from "@/types";
import { ROLE_DASHBOARD_PATHS } from "@/utils/constants";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireLinked?: boolean;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  requireLinked = true,
}: ProtectedRouteProps) {
  const { user, loading, initialized } = useAuth();
  const location = useLocation();

  if (!initialized || loading) {
    return <LoadingScreen message="Authenticating..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (
    requireLinked &&
    user.role === "customer" &&
    !user.isLinked
  ) {
    return <Navigate to="/link-account" replace />;
  }

  if (
    requireLinked &&
    user.role === "pending" &&
    location.pathname !== "/link-account"
  ) {
    return <Navigate to="/link-account" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirect =
      ROLE_DASHBOARD_PATHS[user.role as keyof typeof ROLE_DASHBOARD_PATHS] ??
      "/unauthorized";
    return <Navigate to={redirect} replace />;
  }

  return <>{children}</>;
}
