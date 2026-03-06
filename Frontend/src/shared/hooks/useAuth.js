// src/auth/hooks/useAuth.jsx
import { useAuthStore } from "../../app/store/auth.store";

export const useAuth = () => {
  // On sélectionne séparément pour éviter de recréer un nouvel objet à chaque rendu,
  // ce qui peut déclencher des warnings avec useSyncExternalStore.
  const user = useAuthStore((s) => s.user);
  const authReady = useAuthStore((s) => s.authReady);

  return {
    user,
    isAuthenticated: !!user,
    isAuthReady: authReady,
  };
};
