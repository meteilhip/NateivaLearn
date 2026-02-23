/**
 * usePermissions
 * ---------------
 * Retourne les permissions selon le rôle (learner, tutor, center_owner).
 * Réutilisable pour afficher/masquer des blocs UI.
 */
import { ROLES } from "../utils/roles";
import { useAuthStore } from "../../app/store/auth.store";
import { useActiveOrganization } from "./useActiveOrganization";

export function usePermissions() {
  const user = useAuthStore((s) => s.user);
  const { isCenterContext } = useActiveOrganization();
  const role = user?.role;

  return {
    isLearner: role === ROLES.Learner,
    isTutor: role === ROLES.Tutor || role === ROLES.CenterOwner,
    isCenterOwner: role === ROLES.CenterOwner,
    canManageOrganization: role === ROLES.CenterOwner && isCenterContext,
    canManageTutors: role === ROLES.CenterOwner,
    canManageLearners: role === ROLES.CenterOwner,
  };
}
