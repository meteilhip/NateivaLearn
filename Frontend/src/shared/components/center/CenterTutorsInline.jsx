// src/shared/components/center/CenterTutorsInline.jsx
import { useTranslation } from "react-i18next";
import tutors from "../../../data/tutors";
import { motion, AnimatePresence } from "framer-motion";
import { StarRating } from "../../ui/StarRating";

/**
 * CenterTutorsInline
 * - Affiche les tuteurs du centre (avatar, nom, matières, expérience, langues, ratings)
 */
export const CenterTutorsInline = ({ centerName, isVisible }) => {
  const { t } = useTranslation();

  const centerTutors = tutors.filter(
    (tutor) => tutor.center === centerName
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="tutors"
          className="mt-2"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          <h3 className="font-semibold text-red-600">
            {t("center.centerTutors")}
          </h3>

          <ul className="mt-2 space-y-2 max-h-72 overflow-y-auto scrollbar-hide bg-gray-50 p-2 rounded">
            {centerTutors.length === 0 && (
              <li className="text-gray-500 p-2">
                {t("center.noTutors")}
              </li>
            )}

            {centerTutors.map((tutor) => (
              <li
                key={tutor.id}
                className="text-gray-700 border border-gray-200 p-3 rounded flex gap-3 items-start"
              >
                <img
                  src={tutor.avatar}
                  alt={tutor.name}
                  className="w-16 h-16 rounded-full object-cover"
                />

                <div className="flex-1">
                  <div className="font-medium text-lg">{tutor.name}</div>

                  <div className="text-sm text-gray-600 mt-1">
                    {t("tutor.subjects")} : {tutor.subjects.join(", ")}
                  </div>

                  <div className="text-sm text-gray-600 mt-1">
                    {t("tutor.experience")} : {tutor.experience}
                  </div>

                  <div className="text-sm text-gray-600 mt-1">
                    {t("tutor.languages")} : {tutor.languages.join(", ")}
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <StarRating score={tutor.ratings?.score || 0} size={16} />
                    <span className="text-gray-600 text-sm">
                      ({tutor.ratings?.reviews || 0} avis)
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
