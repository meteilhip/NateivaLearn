// src/app/router/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";

/**
 * ProtectedRoute
 * - Bloque l'accès si non connecté
 * - Vérifie le rôle utilisateur
 */
export const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/" />;

  if (!allowedRoles.includes(user.role))
    return <Navigate to="/signup" />;

  return children;
};
