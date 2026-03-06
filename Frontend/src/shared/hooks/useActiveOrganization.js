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
  // On force un re-render quand la liste des organisations change,
  // sans retourner d'objet instable (qui causait une boucle infinie).
  useOrganizationsStore((s) => s.organizations.length);
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
