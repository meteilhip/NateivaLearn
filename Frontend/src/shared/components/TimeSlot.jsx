// src/shared/components/TimeSlot.jsx
import React from "react";
import { motion } from "framer-motion";

/**
 * TimeSlot
 * --------
 * Créneau horaire cliquable pour la réservation.
 * Réutilisable côté élève (choix créneau) et enseignant (gestion dispos).
 *
 * Props:
 * - label: ex "10:00 - 11:00"
 * - selected: boolean
 * - disabled: boolean (déjà réservé ou bloqué)
 * - onClick: () => void
 */
export const TimeSlot = ({ label, selected, disabled, onClick }) => {
  return (
    <motion.button
      type="button"
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg text-sm font-medium border transition
        ${selected ? "bg-primary text-white border-primary" : "bg-white border-black/20 text-dark hover:border-primary"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {label}
    </motion.button>
  );
};
