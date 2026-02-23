// src/app/layouts/AppTopbar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { ROLES } from "../../shared/utils/roles";
import { NotificationDropdown } from "../../shared/components/NotificationDropdown";

/** AppTopbar - Clic sur avatar/nom → page Profil du rôle courant. */
export const AppTopbar = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const getProfilePath = () => {
    if (pathname.startsWith("/learner")) return "/learner/profile";
    if (pathname.startsWith("/tutor")) return "/tutor/profile";
    if (pathname.startsWith("/center_owner")) return "/center_owner/profile";
    if (user?.role === ROLES.Learner) return "/learner/profile";
    if (user?.role === ROLES.Tutor || user?.role === ROLES.CenterOwner) return "/tutor/profile";
    if (user?.role === ROLES.CenterOwner) return "/center_owner/profile";
    return "/learner/profile";
  };

  return (
    <header className="h-16 bg-white px-6 flex items-center justify-between">
      <div className="flex items-center gap-6 justify-end flex-1">
        <NotificationDropdown />
        <button
          type="button"
          onClick={() => navigate(getProfilePath())}
          className="flex items-center gap-3 hover:opacity-90 transition"
        >
          <img
            src={user?.avatar || "/9581121.png"}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          {/** afficher le nom de l'utilisateur 
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-dark">{user?.name || "Profil"}</p>
          </div>
          */}
        </button>
      </div>
    </header>
  );
};