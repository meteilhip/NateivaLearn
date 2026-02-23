import {
  FaHome,
  FaBook,
  FaUsers,
  FaUserGraduate,
  FaCog,
  FaSignOutAlt,
  FaComments,
  FaCalendarAlt,
  FaVideo,
} from "react-icons/fa";

/**
 * Menu center_owner (propriétaire d'organisation)
 */
export const centerOwnerMenu = [
  { label: "Vue d'ensemble", icon: FaHome, path: "/center_owner/dashboard" },
  { label: "Gestion tuteurs", icon: FaUsers, path: "/center_owner/tutors" },
  { label: "Gestion apprenants", icon: FaUserGraduate, path: "/center_owner/learners" },
  { label: "Messages", icon: FaComments, path: "/center_owner/chat" },
  { label: "Agenda", icon: FaCalendarAlt, path: "/center_owner/agenda" },
  { label: "Visioconférence", icon: FaVideo, path: "/center_owner/video" },
  { label: "Cours", icon: FaBook, path: "/center_owner/courses" },
];

export const centerOwnerActions = [
  { labelKey: "settings.settingsTitle", icon: FaCog, path: "/center_owner/settings" },
  { labelKey: "settings.logoutConfirmButton", icon: FaSignOutAlt, action: "logout" },
];
