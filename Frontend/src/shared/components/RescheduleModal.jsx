// src/shared/components/RescheduleModal.jsx
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { Button } from "../ui/Button";
import { useBookingConflict } from "../hooks/useBookingConflict";

const DAY_NAMES = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

/**
 * RescheduleModal
 * ---------------
 * Modal pour reprogrammer une réservation.
 * Permet de choisir une nouvelle date, vérifier les conflits et confirmer.
 */
export const RescheduleModal = ({ booking, tutor, isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Générer les dates disponibles (14 prochains jours)
  const availableDates = useMemo(() => {
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

  // Générer les créneaux pour le jour sélectionné
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

  // Vérifier les conflits
  const startTime = selectedDate && selectedSlot
    ? (() => {
        const date = new Date(selectedDate);
        date.setHours(Math.floor(selectedSlot.start / 60), selectedSlot.start % 60, 0, 0);
        return date;
      })()
    : null;

  const endTime = selectedDate && selectedSlot
    ? (() => {
        const date = new Date(selectedDate);
        date.setHours(Math.floor(selectedSlot.end / 60), selectedSlot.end % 60, 0, 0);
        return date;
      })()
    : null;

  const { hasConflict } = useBookingConflict(startTime, endTime);

  const handleConfirm = () => {
    if (!selectedDate || !selectedSlot || hasConflict) return;

    const newStartTime = new Date(selectedDate);
    newStartTime.setHours(Math.floor(selectedSlot.start / 60), selectedSlot.start % 60, 0, 0);

    const newEndTime = new Date(selectedDate);
    newEndTime.setHours(Math.floor(selectedSlot.end / 60), selectedSlot.end % 60, 0, 0);

    onConfirm({
      bookingId: booking.id,
      newStartTime: newStartTime.toISOString(),
      newEndTime: newEndTime.toISOString(),
    });

    // Réinitialiser
    setSelectedDate(null);
    setSelectedSlot(null);
    onClose();
  };

  if (!booking || !tutor) return null;

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
            className="bg-white rounded-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
            >
              <FiX size={20} />
            </button>

            <h3 className="text-xl font-semibold text-dark mb-4">
              {t("reschedule.title", "Reprogrammer la réservation")}
            </h3>

            <p className="text-sm text-dark/60 mb-4">
              {t("reschedule.currentBooking", "Réservation actuelle")}:{" "}
              {new Date(booking.startTime).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            {/* Sélection de la date */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-dark mb-2">
                {t("reschedule.selectNewDate", "Sélectionner une nouvelle date")}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {availableDates.map((date) => {
                  const isAvailable = tutor.availabilitySlots?.some(
                    (slot) => slot.day === date.getDay()
                  );
                  const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();

                  return (
                    <button
                      key={date.toISOString()}
                      type="button"
                      onClick={() => isAvailable && setSelectedDate(new Date(date))}
                      disabled={!isAvailable}
                      className={`
                        p-3 rounded text-sm transition
                        ${isSelected
                          ? "bg-primary text-white"
                          : isAvailable
                          ? "bg-gray-100 text-dark hover:bg-gray-200"
                          : "bg-gray-50 text-gray-400 cursor-not-allowed"
                        }
                      `}
                    >
                      {DAY_NAMES[date.getDay()]} {date.getDate()}/{date.getMonth() + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sélection du créneau horaire */}
            {selectedDate && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-dark mb-2">
                  {t("reschedule.selectNewTime", "Sélectionner un créneau horaire")}
                </label>
                {timeSlots.length === 0 ? (
                  <p className="text-sm text-dark/60">{t("courses.noSlotsThatDay")}</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.start}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`
                          px-4 py-2 rounded text-sm transition
                          ${selectedSlot?.start === slot.start
                            ? "bg-primary text-white"
                            : "bg-white border border-gray-300 text-dark hover:border-primary"
                          }
                        `}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Message de conflit */}
            {hasConflict && (
              <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                <p className="text-sm text-red-700">
                  {t("booking.conflictMessage", "Vous avez déjà un cours prévu à cette heure.")}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" className="rounded" onClick={onClose}>
                {t("common.cancel", "Annuler")}
              </Button>
              <Button
                variant="primary"
                className="rounded"
                onClick={handleConfirm}
                disabled={!selectedDate || !selectedSlot || hasConflict}
              >
                {t("reschedule.confirm", "Confirmer la reprogrammation")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
