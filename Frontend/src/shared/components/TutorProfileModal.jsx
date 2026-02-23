import React, { useEffect } from "react";
import { FiX, FiUsers, FiBookOpen, FiMapPin } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { TutorProfileCard } from "./TutorProfileCard";
import { Tag } from "../ui/Tag";
import { useTranslation } from "react-i18next";
import { useLearnerCenter } from "../hooks/useLearnerCenter";
import { Button } from "../ui/Button";

/**
 * TutorProfileModal
 * - Affiche le détail complet du tuteur
 * - Bloque le scroll du body quand ouvert
 * - Affiche boutons conditionnels selon si learner a un centre
 */
export const TutorProfileModal = ({ tutor, isOpen, onClose, onBook }) => {
  const { t } = useTranslation();
  const { hasCenter } = useLearnerCenter();

  if (!tutor) return null;

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto scrollbar-hide"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
            >
              <FiX size={20} />
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <TutorProfileCard
                  tutor={tutor}
                  showPrice={!!tutor.pricePerHour}
                  showRating={!!tutor.rating}
                  onBook={typeof onBook === "function" ? onBook : undefined}
                  onJoinCenter={() => {
                    // TODO: Implémenter la logique pour rejoindre le centre du tutor
                    console.log("Rejoindre le centre du tutor:", tutor.center);
                  }}
                />
              </motion.div>

              <motion.div
                className="flex-1 space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <h3 className="text-xl font-semibold text-gray-900">
                  {t("tutor.aboutTutor")}
                </h3>

                <p className="text-gray-600 text-sm">
                  {tutor.bio ||
                    t("tutor.tutorDefaultBio", "Un tuteur passionné, engagé dans la réussite des apprenants.")}
                </p>

                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Tag icon={FiBookOpen}>{tutor.subjects.join(", ")}</Tag>
                  <Tag icon={FiMapPin}>{tutor.center}</Tag>
                  <Tag icon={FiUsers}>
                    {tutor.studentsCount || 120} {t("tutor.learnersTrained")}
                  </Tag>
                  <Tag>
                    {t("tutor.experience")}: {tutor.experience || "5+ years"}
                  </Tag>
                </motion.div>

                {tutor.pricePerHour != null && (
                  <p className="text-primary font-semibold">
                    {tutor.pricePerHour.toLocaleString()} $ / {t("courses.hour")}
                  </p>
                )}

                {tutor.availabilitySlots && tutor.availabilitySlots.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">{t("courses.availability")}</h4>
                    <p className="text-sm text-gray-600">
                      {tutor.availabilitySlots.map((s) => {
                        const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
                        const start = `${Math.floor(s.start / 60)}h${s.start % 60 ? (s.start % 60) : "00"}`;
                        const end = `${Math.floor(s.end / 60)}h${s.end % 60 ? (s.end % 60) : "00"}`;
                        return `${dayNames[s.day]} ${start}-${end}`;
                      }).join(", ")}
                    </p>
                  </div>
                )}

                <motion.div
                  className="bg-gray-100 rounded p-4 text-sm text-gray-700"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  {t(
                    "tutor.tutorMotivation",
                    "Ce tuteur est reconnu pour sa pédagogie claire et un accompagnement personnalisé."
                  )}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
