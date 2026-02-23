// src/shared/components/ChatIconButton.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { FaComments } from "react-icons/fa";
import { useUnreadCount } from "../hooks/useUnreadCount";
import { useAuthStore } from "../../app/store/auth.store";
import { ROLES } from "../utils/roles";

/**
 * ChatIconButton
 * --------------
 * Bouton icône messages dans la topbar avec badge de messages non lus.
 * Navigue vers la page chat appropriée selon le rôle de l'utilisateur.
 */
export const ChatIconButton = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuthStore();
  const unreadCount = useUnreadCount();

  const getChatPath = () => {
    if (pathname.startsWith("/learner")) return "/learner/chat";
    if (pathname.startsWith("/tutor")) return "/tutor/chat";
    if (pathname.startsWith("/center_owner")) return "/center_owner/chat";
    if (user?.role === ROLES.Learner) return "/learner/chat";
    if (user?.role === ROLES.Tutor) return "/tutor/chat";
    if (user?.role === ROLES.CenterOwner) return "/center_owner/chat";
    return "/learner/chat";
  };

  return (
    <button
      type="button"
      onClick={() => navigate(getChatPath())}
      className="relative p-2 text-gray-600 hover:text-primary transition-colors"
      aria-label="Messages"
    >
      <FaComments size={20} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5 py-0.5 min-w-[20px] text-center flex items-center justify-center">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
};
