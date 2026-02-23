// src/shared/components/booking/BookingCalendar.jsx
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { TimeSlotButton } from "./TimeSlotButton";

const DAY_NAMES = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

/**
 * BookingCalendar
 * ---------------
 * Colonne centrale de la page de réservation.
 * Affiche un calendrier mensuel avec navigation, jours disponibles/pleins,
 * sélection d'un jour et affichage des créneaux horaires.
 */
export const BookingCalendar = ({ tutor, selectedDate, onDateSelect, selectedSlot, onSlotSelect }) => {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Générer les jours du mois
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Jours du mois précédent pour compléter la première semaine
    const startDay = firstDay.getDay();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false });
    }

    // Jours du mois courant
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }

    // Jours du mois suivant pour compléter la dernière semaine
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  }, [currentMonth]);

  // Vérifier si un jour est disponible (a des créneaux)
  const isDayAvailable = (date) => {
    if (!tutor?.availabilitySlots) return false;
    const dayOfWeek = date.getDay();
    return tutor.availabilitySlots.some((slot) => slot.day === dayOfWeek);
  };

  // Vérifier si un jour est dans le passé
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Générer les créneaux horaires pour le jour sélectionné
  const timeSlots = useMemo(() => {
    if (!selectedDate || !tutor?.availabilitySlots) return [];

    const dayOfWeek = selectedDate.getDay();
    const tutorSlots = tutor.availabilitySlots.filter((s) => s.day === dayOfWeek);

    if (tutorSlots.length === 0) return [];

    const slots = [];
    tutorSlots.forEach(({ start, end }) => {
      for (let m = start; m < end; m += 60) {
        const h = Math.floor(m / 60);
        const min = m % 60;
        slots.push({
          start: m,
          end: m + 60,
          label: `${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`,
        });
      }
    });

    return slots;
  }, [selectedDate, tutor]);

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* En-tête avec navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <FaChevronLeft />
        </button>
        <h3 className="text-lg font-semibold text-dark">
          {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Grille du calendrier */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {DAY_NAMES.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-dark/60 py-2">
            {day}
          </div>
        ))}
        {daysInMonth.map(({ date, isCurrentMonth }, idx) => {
          const isAvailable = isDayAvailable(date);
          const isPast = isPastDate(date);
          const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();

          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (isAvailable && !isPast && isCurrentMonth) {
                  onDateSelect(new Date(date));
                }
              }}
              disabled={!isAvailable || isPast || !isCurrentMonth}
              className={`
                aspect-square rounded text-sm transition
                ${!isCurrentMonth ? "text-gray-300" : ""}
                ${isPast ? "text-gray-300 cursor-not-allowed" : ""}
                ${isSelected ? "bg-primary text-white" : ""}
                ${isAvailable && !isPast && isCurrentMonth && !isSelected
                  ? "bg-emerald-50 text-dark hover:bg-emerald-100"
                  : ""}
                ${!isAvailable && !isPast && isCurrentMonth
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : ""}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Créneaux horaires pour le jour sélectionné */}
      {selectedDate && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-dark mb-3">
            {t("courses.selectTime")}
          </h4>
          {timeSlots.length === 0 ? (
            <p className="text-sm text-dark/60">{t("courses.noSlotsThatDay")}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {timeSlots.map((slot) => (
                <TimeSlotButton
                  key={slot.start}
                  label={slot.label}
                  selected={selectedSlot?.start === slot.start}
                  disabled={false}
                  onClick={() => onSlotSelect(slot)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
