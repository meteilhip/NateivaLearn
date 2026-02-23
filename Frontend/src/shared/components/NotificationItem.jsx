// src/shared/components/NotificationItem.jsx
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaBook, FaComments, FaInfoCircle } from "react-icons/fa";

/**
 * NotificationItem
 * ----------------
 * Composant pour afficher une notification individuelle.
 */
export const NotificationItem = ({ notification, onRead }) => {
  const { t } = useTranslation();

  const getIcon = () => {
    switch (notification.type) {
      case "booking":
        return <FaBook className="text-primary" />;
      case "message":
        return <FaComments className="text-emerald-600" />;
      default:
        return <FaInfoCircle className="text-blue-600" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t("notifications.justNow", "À l'instant");
    if (diffMins < 60) return t("notifications.minutesAgo", "Il y a {{count}} min", { count: diffMins });
    if (diffHours < 24) return t("notifications.hoursAgo", "Il y a {{count}} h", { count: diffHours });
    return t("notifications.daysAgo", "Il y a {{count}} j", { count: diffDays });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => !notification.read && onRead(notification.id)}
      className={`
        p-4 border-b border-gray-200 cursor-pointer transition
        ${notification.read ? "bg-white" : "bg-blue-50"}
        hover:bg-gray-50
      `}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-dark text-sm">{notification.title}</h4>
          <p className="text-sm text-dark/70 mt-1">{notification.message}</p>
          <p className="text-xs text-dark/50 mt-2">{formatTime(notification.timestamp)}</p>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
        )}
      </div>
    </motion.div>
  );
};
