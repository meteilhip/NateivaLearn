import { ROLES } from "../utils/roles";
import { useAuthStore } from "../../app/store/auth.store";

/** useIsCenterOwner : true si user.role === center_owner */
export function useIsCenterOwner() {
  const user = useAuthStore((s) => s.user);
  return user?.role === ROLES.CenterOwner;
}
