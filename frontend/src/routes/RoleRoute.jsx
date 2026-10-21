import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

function RoleRoute({ allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Case-insensitive comparison
  const userRole = user.role?.toLowerCase();
  const isAllowed = allowedRoles.some(
    (role) => role.toLowerCase() === userRole
  );

  if (!isAllowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default RoleRoute;