import {
  FaHome,
  FaBook,
  FaCalendarAlt,
  FaVideo,
  FaCog,
  FaComments,
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaUser,
  FaClock,
} from "react-icons/fa";

/** Menu principal tuteur (navigation /tutor/*). */
export const tutorMenu = [
  { label: "Vue d'ensemble", icon: FaHome, path: "/tutor/dashboard" },
  { label: "Disponibilités", icon: FaClock, path: "/tutor/availability" },
  { label: "Cours", icon: FaBook, path: "/tutor/courses" },
  { label: "Messages", icon: FaComments, path: "/tutor/chat" },
  { label: "Mon centre", icon: FaMapMarkerAlt, path: "/tutor/center" },
  { label: "Visioconférence", icon: FaVideo, path: "/tutor/video" },
  { label: "Agenda", icon: FaCalendarAlt, path: "/tutor/calendar" },
];

/** Boutons d'action tuteur. */
export const tutorActions = [
  { labelKey: "settings.settingsTitle", icon: FaCog, path: "/tutor/settings" },
  { labelKey: "settings.logoutConfirmButton", icon: FaSignOutAlt, action: "logout" },
];
