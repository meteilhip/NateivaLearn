// src/auth/hooks/useAuth.jsx
import { useAuthStore } from "../../app/store/auth.store";

export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  return {
    user,
    isAuthenticated: !!user,
  };
};
