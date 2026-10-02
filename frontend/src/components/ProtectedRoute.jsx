import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

// Only logged-in users may see the children
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Only logged-out users may see the children (login, register)
export function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}