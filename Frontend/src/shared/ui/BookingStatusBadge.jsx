// src/shared/ui/BookingStatusBadge.jsx
import React from "react";
import { useTranslation } from "react-i18next";

/**
 * BookingStatusBadge
 * ------------------
 * Affiche le statut d'une réservation (pending, confirmed, completed, cancelled, no_show).
 * Réutilisable côté élève et enseignant.
 */
const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  completed: "bg-slate-100 text-slate-700 border-slate-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  no_show: "bg-gray-100 text-gray-600 border-gray-200",
};

export const BookingStatusBadge = ({ status, className = "" }) => {
  const { t } = useTranslation();
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
  const label = t(`booking.status.${status}`, status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style} ${className}`}
    >
      {label}
    </span>
  );
};
