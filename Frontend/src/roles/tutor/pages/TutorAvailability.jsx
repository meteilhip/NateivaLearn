// src/roles/tutor/pages/TutorAvailability.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCoursesStore } from "../../../app/store/courses.store";
import { Button } from "../../../shared/ui/Button";

const DAYS = [
  { key: 0, labelKey: "teacherPages.daySun" },
  { key: 1, labelKey: "teacherPages.dayMon" },
  { key: 2, labelKey: "teacherPages.dayTue" },
  { key: 3, labelKey: "teacherPages.dayWed" },
  { key: 4, labelKey: "teacherPages.dayThu" },
  { key: 5, labelKey: "teacherPages.dayFri" },
  { key: 6, labelKey: "teacherPages.daySat" },
];

/**
 * TutorAvailability
 * -------------------
 * Gestion des disponibilités hebdomadaires (mock).
 *
 * 👨🏽‍🏫 Enseignant peut :
 * - Définir horaires par jour
 * - Bloquer des dates spécifiques
 * - Buffer simulé (commentaire)
 *
 * Données dans courses.store (weeklyAvailability, blockedDates).
 */
export const TutorAvailability = () => {
  const { t } = useTranslation();
  const { weeklyAvailability, blockedDates, addBlockedDate, removeBlockedDate } = useCoursesStore();

  const [newBlockedDate, setNewBlockedDate] = useState("");

  const handleAddBlocked = () => {
    if (newBlockedDate) {
      addBlockedDate(newBlockedDate);
      setNewBlockedDate("");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark">{t("teacherPages.availabilityTitle")}</h1>
      <p className="text-dark/60 text-sm">{t("teacherPages.availabilitySubtitle")}</p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6 space-y-6"
      >
        <h2 className="text-lg font-semibold text-dark">{t("teacherPages.weeklySlots")}</h2>
        <ul className="space-y-2">
          {weeklyAvailability.map((slot, i) => (
            <li key={i} className="flex items-center gap-4 text-sm">
              <span className="font-medium w-24">{t(DAYS[slot.day].labelKey)}</span>
              <span className="text-dark/70">
                {Math.floor(slot.start / 60)}h – {Math.floor(slot.end / 60)}h
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-dark/50">{t("teacherPages.bufferNote")}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6 space-y-4"
      >
        <h2 className="text-lg font-semibold text-dark">{t("teacherPages.blockedDates")}</h2>
        <div className="flex gap-2">
          <input
            type="date"
            value={newBlockedDate}
            onChange={(e) => setNewBlockedDate(e.target.value)}
            className="border border-black/20 rounded-lg px-4 py-2 text-sm"
          />
          <Button variant="outline" className="rounded" onClick={handleAddBlocked}>
            {t("teacherPages.addBlocked")}
          </Button>
        </div>
        <ul className="flex flex-wrap gap-2">
          {blockedDates.map((d) => (
            <li key={d} className="flex items-center gap-1 bg-red-50 text-red-700 rounded px-2 py-1 text-sm">
              {d}
              <button type="button" onClick={() => removeBlockedDate(d)} className="hover:underline">
                ×
              </button>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};
