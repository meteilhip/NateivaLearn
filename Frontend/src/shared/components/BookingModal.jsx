// src/shared/components/BookingModal.jsx
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";
import { TimeSlot } from "./TimeSlot";

const DAY_NAMES = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

/**
 * BookingModal
 * ------------
 * Flow réservation mock : date → heure → confirmation.
 * Plus tard : branchement Stripe / API paiement.
 */
export const BookingModal = ({ tutor, isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const nextDates = useMemo(() => {
    const out = [];
    for (let i = 1; i <= 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      out.push(d);
    }
    return out;
  }, []);

  const slotsForDate = useMemo(() => {
    if (!selectedDate) return [];
    const day = selectedDate.getDay();
    const tutorSlots = (tutor?.availabilitySlots || []).filter((s) => s.day === day);
    if (tutorSlots.length === 0) return [];
    const slots = [];
    tutorSlots.forEach(({ start, end }) => {
      for (let m = start; m < end; m += 60) {
        const h = Math.floor(m / 60);
        const min = m % 60;
        slots.push({
          start: m,
          end: m + 60,
          label: `${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")} - ${(h + 1).toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`,
        });
      }
    });
    return slots;
  }, [selectedDate, tutor]);

  const handleConfirmBooking = () => {
    if (!tutor || !selectedDate || !selectedSlot) return;
    const start = new Date(selectedDate);
    start.setHours(Math.floor(selectedSlot.start / 60), selectedSlot.start % 60, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(Math.floor(selectedSlot.end / 60), selectedSlot.end % 60, 0, 0);
    onConfirm({
      tutorId: tutor.id,
      tutorName: tutor.name,
      tutorAvatar: tutor.avatar,
      subject: tutor.subjects?.[0] || "",
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      price: tutor.pricePerHour,
    });
    setStep(1);
    setSelectedDate(null);
    setSelectedSlot(null);
    onClose();
  };

  const handleClose = () => {
    setStep(1);
    setSelectedDate(null);
    setSelectedSlot(null);
    onClose();
  };

  if (!tutor) return null;

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
            className="bg-white rounded-lg max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
            >
              <FiX size={20} />
            </button>

            <h3 className="text-xl font-semibold text-dark mb-4">
              {t("courses.bookWith")} {tutor.name}
            </h3>

            {/* Step 1 : choix date */}
            {step === 1 && (
              <>
                <p className="text-sm text-dark/60 mb-3">{t("courses.selectDate")}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {nextDates.map((d) => (
                    <TimeSlot
                      key={d.toISOString()}
                      label={`${DAY_NAMES[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`}
                      selected={selectedDate && selectedDate.toDateString() === d.toDateString()}
                      disabled={false}
                      onClick={() => setSelectedDate(d)}
                    />
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="primary" className="rounded" onClick={() => setStep(2)} disabled={!selectedDate}>
                    {t("common.next")}
                  </Button>
                </div>
              </>
            )}

            {/* Step 2 : choix heure */}
            {step === 2 && (
              <>
                <p className="text-sm text-dark/60 mb-3">{t("courses.selectTime")}</p>
                <div className="flex flex-wrap gap-2">
                  {slotsForDate.length === 0 ? (
                    <p className="text-sm text-dark/60">{t("courses.noSlotsThatDay")}</p>
                  ) : (
                    slotsForDate.map((slot) => (
                      <TimeSlot
                        key={slot.start}
                        label={slot.label}
                        selected={selectedSlot?.start === slot.start}
                        disabled={false}
                        onClick={() => setSelectedSlot(slot)}
                      />
                    ))
                  )}
                </div>
                <div className="mt-4 flex justify-between">
                  <Button variant="outline" className="rounded" onClick={() => setStep(1)}>
                    {t("common.back")}
                  </Button>
                  <Button
                    variant="primary"
                    className="rounded"
                    onClick={handleConfirmBooking}
                    disabled={!selectedSlot}
                  >
                    {t("courses.confirmAndPay")}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
