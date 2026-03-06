// src/roles/tutor/pages/AvailabilityManager.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useCoursesStore } from "../../../app/store/courses.store";
import { DayAvailabilityRow } from "../../../shared/components/availability/DayAvailabilityRow";
import { Button } from "../../../shared/ui/Button";
import { ConfirmModal } from "../../../shared/components/ConfirmModal";

const DAY_NAMES = [
  { day: 0, name: "Dimanche" },
  { day: 1, name: "Lundi" },
  { day: 2, name: "Mardi" },
  { day: 3, name: "Mercredi" },
  { day: 4, name: "Jeudi" },
  { day: 5, name: "Vendredi" },
  { day: 6, name: "Samedi" },
];

/**
 * AvailabilityManager
 * --------------------
 * Gestionnaire de disponibilités hebdomadaires pour tuteur.
 * Branché sur l'API de disponibilités :
 * - lecture des créneaux depuis la BD
 * - mise à jour automatique à chaque modification (sans bouton "Enregistrer")
 * - copie de plages vers les autres jours actifs avec confirmation en modal.
 */
export const AvailabilityManager = () => {
  const { t } = useTranslation();
  const { weeklyAvailability, setWeeklyAvailability, fetchAvailability } = useCoursesStore();

  // Config pour la copie vers autres jours (modal)
  const [copySourceDay, setCopySourceDay] = useState(null);
  const [copyRanges, setCopyRanges] = useState([]);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

  // Charger les disponibilités depuis la BD au montage
  useState(() => {
    fetchAvailability?.();
  });

  const getDayAvailability = (day) => {
    const ranges = (weeklyAvailability || [])
      .filter((slot) => slot.day === day)
      .map((slot) => ({ start: slot.start, end: slot.end }));
    return {
      isActive: ranges.length > 0,
      timeRanges: ranges,
    };
  };

  const buildSlotsWithDay = (day, timeRanges) => {
    const base = weeklyAvailability || [];
    const withoutDay = base.filter((slot) => slot.day !== day);
    const newSlots =
      (timeRanges || []).length > 0
        ? timeRanges.map((range) => ({
            day,
            start: range.start,
            end: range.end,
          }))
        : [];
    return [...withoutDay, ...newSlots];
  };

  const handleToggle = (day, isActive) => {
    const current = getDayAvailability(day);
    let ranges = current.timeRanges;

    if (!isActive) {
      ranges = [];
    } else if (ranges.length === 0) {
      ranges = [{ start: 9 * 60, end: 17 * 60 }];
    }

    const slots = buildSlotsWithDay(day, ranges);
    setWeeklyAvailability(slots);
  };

  const handleTimeRangesChange = (day, timeRanges) => {
    const slots = buildSlotsWithDay(day, timeRanges);
    setWeeklyAvailability(slots);
  };

  const handleCopyTo = (sourceDay, timeRanges) => {
    setCopySourceDay(sourceDay);
    setCopyRanges(timeRanges);
    setIsCopyModalOpen(true);
  };

  const handleConfirmCopy = () => {
    if (copySourceDay == null || !copyRanges.length) return;
    const base = weeklyAvailability || [];

    // Jours actifs (avec au moins une plage), hors jour source
    const activeOtherDays = DAY_NAMES.filter(
      ({ day }) =>
        day !== copySourceDay &&
        base.some((slot) => slot.day === day)
    ).map(({ day }) => day);

    if (activeOtherDays.length === 0) return;

    // Supprimer les créneaux des jours cibles puis appliquer les plages copiées
    let nextSlots = base.filter((slot) => !activeOtherDays.includes(slot.day));
    activeOtherDays.forEach((day) => {
      nextSlots = [
        ...nextSlots,
        ...copyRanges.map((range) => ({
          day,
          start: range.start,
          end: range.end,
        })),
      ];
    });

    setWeeklyAvailability(nextSlots);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">
            {t("teacherPages.availabilityTitle", "Disponibilités")}
          </h1>
          <p className="text-sm text-dark/60 mt-1">
            {t("teacherPages.availabilitySubtitle", "Définissez vos créneaux hebdomadaires et dates bloquées.")}
          </p>
        </div>
      </div>

      {/* Liste des jours */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-dark mb-4">
          {t("teacherPages.weeklySlots", "Créneaux hebdomadaires")}
        </h2>

        <div className="space-y-0">
          {DAY_NAMES.map(({ day, name }) => {
            const dayAvailability = getDayAvailability(day);
            return (
              <DayAvailabilityRow
                key={day}
                day={day}
                dayName={name}
                timeRanges={dayAvailability?.timeRanges || []}
                isActive={dayAvailability?.isActive || false}
                onToggle={(isActive) => handleToggle(day, isActive)}
                onChange={(timeRanges) => handleTimeRangesChange(day, timeRanges)}
                onCopyTo={(sourceDay, timeRanges) => handleCopyTo(sourceDay, timeRanges)}
              />
            );
          })}
        </div>
      </div>

      {/* Note sur le buffer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          {t("teacherPages.bufferNote", "Un buffer entre cours pourra être ajouté plus tard (ex. 15 min).")}
        </p>
      </div>

      <ConfirmModal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        onConfirm={handleConfirmCopy}
        title={t("availability.copyTitle", "Copier les plages horaires")}
        message={t(
          "availability.copyConfirm",
          "Copier ces plages vers tous les autres jours actifs ?"
        )}
        confirmLabel={t("common.confirm", "Confirmer")}
        cancelLabel={t("common.cancel", "Annuler")}
        variant="primary"
      />
    </div>
  );
};
