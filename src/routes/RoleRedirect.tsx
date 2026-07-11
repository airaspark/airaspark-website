import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { ROLE_DASHBOARD_PATHS } from "@/utils/constants";

export default function RoleRedirect() {
  const { user, loading, initialized } = useAuth();

  if (!initialized || loading) {
    return <LoadingScreen message="Redirecting..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const path =
    ROLE_DASHBOARD_PATHS[user.role as keyof typeof ROLE_DASHBOARD_PATHS] ??
    "/login";

  return <Navigate to={path} replace />;
}
