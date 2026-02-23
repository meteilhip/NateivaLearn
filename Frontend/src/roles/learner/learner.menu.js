import {
  FaHome,
  FaBook,
  FaCalendarAlt,
  FaVideo,
  FaCog,
  FaComments,
  FaSignOutAlt,
  FaBuilding,
  FaBrain,
} from "react-icons/fa";

/**
 * Menu principal learner (apprenant)
 * ----------------------------------
 * Navigation classique (pages)
 */
export const learnerMenu = [
  { label: "Vue d'ensemble", icon: FaHome, path: "/learner/dashboard" },
  { label: "Cours", icon: FaBook, path: "/learner/courses" },
  { label: "Mon centre", icon: FaBuilding, path: "/learner/center" },
  { label: "Quiz", icon: FaBrain, path: "/learner/quiz" },
  { label: "Messages", icon: FaComments, path: "/learner/chat" },
  { label: "Agenda", icon: FaCalendarAlt, path: "/learner/calendar" },
  { label: "Visioconférence", icon: FaVideo, path: "/learner/video" },
];

export const learnerActions = [
  { labelKey: "settings.settingsTitle", icon: FaCog, path: "/learner/settings" },
  { labelKey: "settings.logoutConfirmButton", icon: FaSignOutAlt, action: "logout" },
];
