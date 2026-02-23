// src/shared/components/availability/DayAvailabilityRow.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TimeRangePicker } from "./TimeRangePicker";
import { Button } from "../../ui/Button";

/**
 * DayAvailabilityRow
 * ------------------
 * Ligne pour gérer les disponibilités d'un jour de la semaine.
 * Toggle actif/inactif + plages horaires multiples + ajouter/supprimer plages.
 */
export const DayAvailabilityRow = ({ day, dayName, timeRanges, isActive, onToggle, onChange, onCopyTo }) => {
  const { t } = useTranslation();

  const handleAddTimeRange = () => {
    const newRanges = [...timeRanges, { start: 9 * 60, end: 17 * 60 }]; // 9h-17h par défaut
    onChange(newRanges);
  };

  const handleRemoveTimeRange = (index) => {
    const newRanges = timeRanges.filter((_, i) => i !== index);
    onChange(newRanges);
  };

  const handleTimeRangeChange = (index, newStart, newEnd) => {
    const newRanges = [...timeRanges];
    newRanges[index] = { start: newStart, end: newEnd };
    onChange(newRanges);
  };

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Toggle actif/inactif */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => onToggle(e.target.checked)}
              className="w-5 h-5 text-primary rounded"
            />
            <span className="font-medium text-dark">{dayName}</span>
          </label>
        </div>

        {/* Bouton copier vers autres jours */}
        {isActive && timeRanges.length > 0 && (
          <Button
            variant="outline"
            className="rounded text-xs"
            onClick={() => onCopyTo(day, timeRanges)}
          >
            {t("availability.copyToOtherDays", "Copier vers autres jours")}
          </Button>
        )}
      </div>

      {/* Plages horaires */}
      {isActive && (
        <div className="ml-7 space-y-2">
          {timeRanges.map((range, index) => (
            <TimeRangePicker
              key={index}
              start={range.start}
              end={range.end}
              onChange={(newStart, newEnd) => handleTimeRangeChange(index, newStart, newEnd)}
              onRemove={timeRanges.length > 1 ? () => handleRemoveTimeRange(index) : null}
            />
          ))}

          {/* Bouton ajouter plage */}
          <button
            type="button"
            onClick={handleAddTimeRange}
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
          >
            + {t("availability.addTimeRange", "Ajouter une plage horaire")}
          </button>
        </div>
      )}

      {!isActive && (
        <p className="ml-7 text-sm text-gray-400">{t("availability.dayInactive", "Jour non disponible")}</p>
      )}
    </div>
  );
};
