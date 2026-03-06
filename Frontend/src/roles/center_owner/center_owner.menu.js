import {
  FaHome,
  FaBook,
  FaCog,
  FaSignOutAlt,
  FaComments,
  FaCalendarAlt,
  FaVideo,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";

/**
 * Menu center_owner (propriétaire d'organisation)
 */
export const centerOwnerMenu = [
  { label: "Vue d'ensemble", icon: FaHome, path: "/center_owner/dashboard" },
  { label: "Mes disponibilités", icon: FaClock, path: "/center_owner/availability" },
  { label: "Cours", icon: FaBook, path: "/center_owner/courses" },
  { label: "Messages", icon: FaComments, path: "/center_owner/chat" },
  { label: "Mon centre", icon: FaMapMarkerAlt, path: "/center_owner/center" },
  { label: "Visioconférence", icon: FaVideo, path: "/center_owner/video" },
  { label: "Agenda", icon: FaCalendarAlt, path: "/center_owner/agenda" },
];

export const centerOwnerActions = [
  { labelKey: "settings.settingsTitle", icon: FaCog, path: "/center_owner/settings" },
  { labelKey: "settings.logoutConfirmButton", icon: FaSignOutAlt, action: "logout" },
];
