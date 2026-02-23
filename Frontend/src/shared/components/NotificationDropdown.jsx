// src/shared/components/NotificationDropdown.jsx
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell } from "react-icons/fa";
import { useNotificationsStore } from "../../app/store/notifications.store";
import { NotificationItem } from "./NotificationItem";
import { Button } from "../ui/Button";

/**
 * NotificationDropdown
 * --------------------
 * Dropdown pour afficher les notifications avec badge compteur.
 * Badge disparaît quand toutes les notifications sont lues.
 */
export const NotificationDropdown = () => {
  const { t } = useTranslation();
  const { notifications, markAsRead, markAllAsRead, getUnreadCount } = useNotificationsStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = getUnreadCount();

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (notificationId) => {
    markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton avec badge */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-dark hover:text-primary transition"
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col"
          >
            {/* En-tête */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-dark">
                {t("notifications.title", "Notifications")}
              </h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  className="text-xs rounded"
                  onClick={handleMarkAllAsRead}
                >
                  {t("notifications.markAllRead", "Tout marquer comme lu")}
                </Button>
              )}
            </div>

            {/* Liste des notifications */}
            <div className="overflow-y-auto max-h-80">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  {t("notifications.noNotifications", "Aucune notification")}
                </div>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={handleNotificationClick}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
