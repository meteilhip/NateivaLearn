// src/shared/hooks/useLearnerCenter.js
import { useMemo } from "react";
import { useAuthStore } from "../../app/store/auth.store";
import { useOrganizationsStore } from "../../app/store/organizations.store";

/**
 * useLearnerCenter
 * ----------------
 * Version branchée sur les données réelles :
 * - utilise l'organization active de l'utilisateur (activeOrganizationId)
 * - retourne l'organisation correspondante si elle est connue côté frontend.
 */
export const useLearnerCenter = () => {
  const user = useAuthStore((state) => state.user);
  const { organizations } = useOrganizationsStore();

  const learnerCenter = useMemo(() => {
    if (!user) return null;
    const activeOrgId = user.activeOrganizationId ?? user.active_organization_id;
    if (!activeOrgId) return null;
    return (
      (organizations || []).find(
        (org) => String(org.id) === String(activeOrgId)
      ) || null
    );
  }, [user, organizations]);

  return {
    hasCenter: !!learnerCenter,
    center: learnerCenter,
  };
};
