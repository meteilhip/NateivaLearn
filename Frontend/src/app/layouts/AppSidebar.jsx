import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../store/auth.store";
import { ConfirmModal } from "../../shared/components/ConfirmModal";
import { useUnreadCount } from "../../shared/hooks/useUnreadCount";
import { FaComments } from "react-icons/fa";

/**
 * AppSidebar
 * ----------
 * Sidebar verticale (icônes only)
 * - Menu (navigation)
 * - Actions : Paramètres (path) + Logout (modale de confirmation)
 */
export const AppSidebar = ({ menu = [], actions = [] }) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { t } = useTranslation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate("/");
  };

  return (
    <aside className="max-w-20 p-3 bg-white text-dark flex flex-col items-center shadow-sm">
      <div className="h-10 flex items-center justify-center">
        <span className="font-bold text-primary text-lg">NL</span>
      </div>

      <nav className="flex-1 flex flex-col items-center justify-between py-4 w-full">
        <div className="flex flex-col gap-4">
          {menu.map((item) => (
            <SidebarItem key={item.path} {...item} />
          ))}
        </div>

        {actions.length > 0 && <div className="w-8 h-px bg-primary/50" />}

        <div className="flex flex-col gap-4">
          {actions.map((item, index) => (
            <SidebarItem
              key={index}
              {...item}
              onLogoutClick={item.action === "logout" ? () => setShowLogoutConfirm(true) : undefined}
            />
          ))}
        </div>
      </nav>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title={t("settings.logoutConfirmTitle")}
        message={t("settings.logoutConfirmMessage")}
        confirmLabel={t("settings.logoutConfirmButton")}
        cancelLabel={t("common.cancel")}
        variant="danger"
      />
    </aside>
  );
};

/* ------------------------------------------------------------------ */
/**
 * SidebarItem
 * -----------
 * Élément unique de la sidebar
 * - Icône toujours visible
 * - Label affiché UNIQUEMENT au hover
 * - Gère :
 *   - navigation (path)
 *   - action logique (action)
 */
const SidebarItem = ({ icon: Icon, label, labelKey, path, action, onLogoutClick }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const displayLabel = labelKey ? t(labelKey) : label;
  const unreadCount = useUnreadCount();
  // Détecter si c'est l'icône chat (vérifier le path ou l'icône)
  const isChatIcon = path?.includes("/chat") || Icon === FaComments;

  const handleClick = () => {
    if (path) {
      navigate(path);
      return;
    }
    if (action === "logout" && onLogoutClick) {
      onLogoutClick();
    }
  };

  /* -------------------------------------------------- */
  /* CAS 1 : NAVIGATION */
  /* -------------------------------------------------- */
  if (path) {
    return (
      <NavLink to={path} className="relative">
        {({ isActive }) => (
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative flex justify-center"
          >
            <div
              className={`
                w-8 h-8 flex items-center justify-center rounded-full
                transition-colors duration-200
                relative
                ${
                  isActive
                    ? "bg-red-100 text-primary shadow"
                    : "text-dark/70 hover:bg-dark/5"
                }
              `}
            >
              <Icon size={18} />
              {isChatIcon && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5 min-w-[18px] text-center flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>

            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                  className="
                    pointer-events-none
                    absolute left-10 top-1/2 -translate-y-1/2
                    bg-dark text-white text-xs
                    px-3 py-1 rounded-md shadow-lg
                    whitespace-nowrap
                  "
                >
                  {displayLabel}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </NavLink>
    );
  }

  /* -------------------------------------------------- */
  /* CAS 2 : ACTION */
  /* -------------------------------------------------- */
  return (
    <button
      onClick={handleClick}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative flex justify-center">
        <div
          className={`
            w-8 h-8 flex items-center justify-center rounded
            transition-colors duration-200
            ${
              action === "logout"
                ? "text-red-600 hover:bg-red-50"
                : "text-dark/70 hover:bg-dark/5"
            }
          `}
        >
          <Icon size={18} />
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.15 }}
              className="
                pointer-events-none
                absolute left-10 top-1/2 -translate-y-1/2
                bg-dark text-white text-xs
                px-3 py-1 rounded-md shadow-lg
                whitespace-nowrap
              "
            >
              {displayLabel}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </button>
  );
};

