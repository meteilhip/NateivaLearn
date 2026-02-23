// src/shared/components/booking/TimeSlotButton.jsx
import { motion } from "framer-motion";

/**
 * TimeSlotButton
 * --------------
 * Bouton réutilisable pour afficher un créneau horaire.
 * Utilisé dans BookingCalendar pour les créneaux disponibles.
 */
export const TimeSlotButton = ({ label, selected, disabled, onClick }) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded text-sm font-medium transition
        ${selected
          ? "bg-primary text-white"
          : disabled
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-white border border-gray-300 text-dark hover:border-primary hover:text-primary"
        }
      `}
      whileHover={!disabled && !selected ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {label}
    </motion.button>
  );
};
