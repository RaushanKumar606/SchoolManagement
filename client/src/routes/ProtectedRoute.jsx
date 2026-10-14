
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute() {
  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  // Auth state load hone tak
  if (loading) {
    return <div>Loading...</div>;
  }

  // Login nahi hai
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // User authenticated hai
  return <Outlet />;
}

export default ProtectedRoute;