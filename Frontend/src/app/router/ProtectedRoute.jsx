// src/app/router/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";

/**
 * ProtectedRoute
 * - Bloque l'accès si non connecté
 * - Vérifie le rôle utilisateur
 * - Attends que l'état d'auth soit initialisé avant de décider
 */
export const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, isAuthReady } = useAuth();

  // Tant qu'on ne sait pas encore si l'utilisateur est connecté ou non,
  // on ne redirige pas (évite le flash / redirection au refresh).
  if (!isAuthReady) {
    return null;
  }

  if (!isAuthenticated) return <Navigate to="/" />;

  if (!allowedRoles.includes(user.role)) return <Navigate to="/signup" />;

  return children;
};
