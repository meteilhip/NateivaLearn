import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../app/store/auth.store";
import {
  FaUser,
  FaCog,
  FaLock,
  FaPalette,
  FaVideo,
  FaBell,
  FaKeyboard,
  FaGlobe,
} from "react-icons/fa";

const SETTINGS_SECTIONS = [
  { key: "general", icon: FaCog },
  { key: "privacy", icon: FaLock },
  { key: "theme", icon: FaPalette },
  { key: "videoAudio", icon: FaVideo },
  { key: "notifications", icon: FaBell },
  { key: "keyboardShortcuts", icon: FaKeyboard },
  { key: "changeLanguage", icon: FaGlobe },
];

export const TutorSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark">{t("settings.settingsTitle")}</h1>

      <motion.button
        type="button"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => navigate("/tutor/profile")}
        className="w-full bg-white rounded-lg shadow-sm p-4 flex items-center gap-4 text-left hover:bg-black/5 transition"
      >
        <img src={user?.avatar || "/9581121.png"} alt="" className="w-14 h-14 rounded-full object-cover" />
        <div>
          <p className="font-semibold text-dark">{user?.name || "—"}</p>
          <p className="text-sm text-dark/60">{t("settings.profile")} →</p>
        </div>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm divide-y divide-black/10"
      >
        {SETTINGS_SECTIONS.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => section.path && navigate(section.path)}
            className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-black/5 transition"
          >
            <section.icon className="text-primary w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-dark">{t(`settings.${section.key}`)}</span>
            {section.path && <span className="ml-auto text-dark/50">→</span>}
          </button>
        ))}
      </motion.div>
    </div>
  );
};
