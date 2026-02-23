// src/shared/hooks/useLearnerCenter.js
import { useMemo } from "react";
import { useAuthStore } from "../../app/store/auth.store";
import { useOrganizationsStore } from "../../app/store/organizations.store";

/**
 * useLearnerCenter
 * ----------------
 * Hook pour vérifier si un learner a rejoint un centre.
 * Retourne le centre du learner s'il en a un, sinon null.
 */
export const useLearnerCenter = () => {
  const user = useAuthStore((state) => state.user);
  const { organizations, memberships } = useOrganizationsStore();

  const learnerCenter = useMemo(() => {
    if (!user) return null;
    
    // Chercher un membership "learner" pour cet utilisateur
    const learnerMembership = (memberships || []).find(
      (m) => m.userId === (user.id || user.email) && m.role === "learner"
    );

    if (!learnerMembership) return null;

    // Retourner l'organisation correspondante
    return (organizations || []).find(
      (org) => org.id === learnerMembership.organizationId
    ) || null;
  }, [user, organizations, memberships]);

  return {
    hasCenter: !!learnerCenter,
    center: learnerCenter,
  };
};
