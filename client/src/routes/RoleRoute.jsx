
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function RoleRoute({ allowedRoles }) {
  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  // Auth loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // Login required
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RoleRoute;