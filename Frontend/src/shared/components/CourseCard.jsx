// src/components/courses/CourseCard.jsx
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';
import { CourseDetailModal } from './CourseDetailModal';

/**
 * CourseCard
 * - Carte simple pour afficher un cours
 * - Affiche une grande icône parlante
 * - Contient :
 *    - titre
 *    - résumé
 *    - deux boutons : "Voir" et "Commencer à apprendre"
 * - Les textes sont traduits via i18next
 */
export const CourseCard = ({ course, centers = [] }) => {
  const { t } = useTranslation();
  const Icon = course.icon;
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <article
      className="bg-white shadow-md rounded overflow-hidden flex flex-col h-full"
      role="article"
      aria-label={t(course.titleKey)}
    >
      {/* Icône parlante */}
      <div className="flex items-center justify-center h-40 w-full text-red-600 text-6xl">
        {Icon && <Icon />}
      </div>

      {/* Contenu texte */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-gray-900 font-semibold text-lg md:text-base">
            {(course.title)}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-3">
            {(course.summary)}
          </p>
        </div>

        {/* Boutons */}
        <div className="mt-4 flex justify-between">
          <Button
            variant="primary"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 text-sm rounded"
            disabled={!centers.length}
          >
            {t("seeDetails")}
          </Button>

          <Button
            variant="outline"
            onClick={() => window.location.href='http://localhost:5174/'}
            className="px-4 py-2 text-sm rounded"
          >
            {t("startLearning")}
          </Button>
        </div>
      </div>

      {/* Modal */}
      <CourseDetailModal
        course={course}
        centers={centers}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </article>
  );
};
