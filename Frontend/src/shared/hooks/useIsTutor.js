import { ROLES } from "../utils/roles";
import { useAuthStore } from "../../app/store/auth.store";

/** useIsTutor : true si user.role === tutor ou center_owner (center_owner a les capacités Tutor) */
export function useIsTutor() {
  const user = useAuthStore((s) => s.user);
  return user?.role === ROLES.Tutor || user?.role === ROLES.CenterOwner;
}
