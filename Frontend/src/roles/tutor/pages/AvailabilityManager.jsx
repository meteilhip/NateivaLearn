// src/roles/tutor/pages/AvailabilityManager.jsx
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useCoursesStore } from "../../../app/store/courses.store";
import { DayAvailabilityRow } from "../../../shared/components/availability/DayAvailabilityRow";
import { Button } from "../../../shared/ui/Button";

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
 * Gestionnaire de disponibilités style Preply pour tutor.
 * Permet de définir les créneaux hebdomadaires avec toggle actif/inactif,
 * plages horaires multiples, ajouter/supprimer plages, copier vers autres jours.
 */
export const AvailabilityManager = () => {
  const { t } = useTranslation();
  const { weeklyAvailability, setWeeklyAvailability } = useCoursesStore();

  // État local pour gérer les disponibilités par jour
  const [availability, setAvailability] = useState(() => {
    // Initialiser avec les disponibilités existantes ou valeurs par défaut
    const defaultAvailability = DAY_NAMES.map(({ day }) => ({
      day,
      isActive: false,
      timeRanges: [],
    }));

    // Remplir avec les disponibilités existantes
    if (weeklyAvailability && weeklyAvailability.length > 0) {
      weeklyAvailability.forEach((slot) => {
        const dayIndex = defaultAvailability.findIndex((a) => a.day === slot.day);
        if (dayIndex >= 0) {
          const existingRange = defaultAvailability[dayIndex].timeRanges.find(
            (r) => r.start === slot.start && r.end === slot.end
          );
          if (!existingRange) {
            defaultAvailability[dayIndex].timeRanges.push({
              start: slot.start,
              end: slot.end,
            });
          }
          defaultAvailability[dayIndex].isActive = true;
        }
      });
    }

    return defaultAvailability;
  });

  // Sauvegarder les changements
  const handleSave = () => {
    const slots = [];
    availability.forEach((dayAvail) => {
      if (dayAvail.isActive && dayAvail.timeRanges.length > 0) {
        dayAvail.timeRanges.forEach((range) => {
          slots.push({
            day: dayAvail.day,
            start: range.start,
            end: range.end,
          });
        });
      }
    });
    setWeeklyAvailability(slots);
    // TODO: Afficher un message de succès
  };

  // Mettre à jour les disponibilités d'un jour
  const handleDayChange = (day, updates) => {
    setAvailability((prev) =>
      prev.map((a) => (a.day === day ? { ...a, ...updates } : a))
    );
  };

  // Toggle actif/inactif pour un jour
  const handleToggle = (day, isActive) => {
    handleDayChange(day, { isActive });
  };

  // Changer les plages horaires d'un jour
  const handleTimeRangesChange = (day, timeRanges) => {
    handleDayChange(day, { timeRanges });
  };

  // Copier les plages vers d'autres jours
  const handleCopyTo = (sourceDay, timeRanges) => {
    const sourceDayName = DAY_NAMES.find((d) => d.day === sourceDay)?.name;
    // Demander confirmation (simplifié ici)
    const confirmCopy = window.confirm(
      t("availability.copyConfirm", "Copier ces plages vers tous les autres jours actifs ?")
    );
    if (confirmCopy) {
      setAvailability((prev) =>
        prev.map((a) =>
          a.day !== sourceDay && a.isActive
            ? { ...a, timeRanges: [...timeRanges] }
            : a
        )
      );
    }
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
        <Button variant="primary" className="rounded" onClick={handleSave}>
          {t("common.save", "Enregistrer")}
        </Button>
      </div>

      {/* Liste des jours */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-dark mb-4">
          {t("teacherPages.weeklySlots", "Créneaux hebdomadaires")}
        </h2>

        <div className="space-y-0">
          {DAY_NAMES.map(({ day, name }) => {
            const dayAvailability = availability.find((a) => a.day === day);
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
    </div>
  );
};
