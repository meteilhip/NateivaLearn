// src/shared/components/TutorVideoPreview.jsx
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getVideoEmbed } from "../utils/videoEmbed";

/**
 * Carte de prévisualisation vidéo du tuteur (présentation).
 * Utilisée au survol d'une TutorCard dans learner/courses.
 */
export const TutorVideoPreview = ({ tutor, className = "" }) => {
  const { t } = useTranslation();
  const embed = useMemo(() => getVideoEmbed(tutor?.videoUrl), [tutor?.videoUrl]);

  if (!tutor?.videoUrl) return null;
  if (!embed) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-lg shadow-lg overflow-hidden border border-black/10 ${className}`}
    >
      <p className="text-xs font-medium text-dark/70 px-3 py-2 border-b border-black/10">
        {t("tutor.presentationVideo", "Vidéo de présentation")} – {tutor.name}
      </p>
      <div className="aspect-video w-full min-h-[180px] bg-black/5 relative">
        <iframe
          title={t("tutor.presentationVideo", "Vidéo de présentation")}
          src={embed.url}
          className="w-full h-full min-h-[180px]"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </motion.div>
  );
};
