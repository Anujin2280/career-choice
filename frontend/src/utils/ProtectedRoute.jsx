import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { token, user } = useSelector((state) => state.auth);

  if (!token || !user) return <Navigate to="/login" replace />;

  if (adminOnly && user?.role_id !== 1) {
    return <Navigate to="/" replace />;
  }

  return children;
}
