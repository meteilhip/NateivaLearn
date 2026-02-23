/**
 * useActiveOrganization
 * ----------------------
 * Multi-tenant : retourne l'organisation active du user (center_owner).
 * isIndependent = !activeOrganization, isCenterContext = !!activeOrganization.
 */
import { useAuthStore } from "../../app/store/auth.store";
import { useOrganizationsStore } from "../../app/store/organizations.store";

export function useActiveOrganization() {
  const user = useAuthStore((s) => s.user);
  const getOrganizationById = useOrganizationsStore((s) => s.getOrganizationById);
  const activeId = user?.activeOrganizationId || null;
  const organization = activeId ? getOrganizationById(activeId) : null;
  return {
    activeOrganization: organization,
    activeOrganizationId: activeId,
    isIndependent: !activeId,
    isCenterContext: !!activeId,
  };
}
