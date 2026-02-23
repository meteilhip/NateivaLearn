// src/shared/hooks/useBookingConflict.js
import { useMemo } from "react";
import { useAuthStore } from "../../app/store/auth.store";
import { useCoursesStore } from "../../app/store/courses.store";

/**
 * useBookingConflict
 * -------------------
 * Hook pour vérifier si une réservation entre en conflit avec une réservation existante.
 * Frontend simulé : vérifie les bookings existants du learner.
 * 
 * @param {Date} startTime - Date/heure de début de la réservation proposée
 * @param {Date} endTime - Date/heure de fin de la réservation proposée
 * @returns {object} { hasConflict, conflictingBooking }
 */
export const useBookingConflict = (startTime, endTime) => {
  const user = useAuthStore((state) => state.user);
  const learnerId = user?.id || user?.email || "learner-1";
  const { bookings } = useCoursesStore();

  const conflict = useMemo(() => {
    if (!startTime || !endTime) {
      return { hasConflict: false, conflictingBooking: null };
    }

    // Récupérer les bookings confirmés/pending du learner
    const learnerBookings = bookings.filter(
      (b) =>
        b.learnerId === learnerId &&
        ["pending", "confirmed"].includes(b.status) &&
        new Date(b.startTime) > new Date() // Seulement les futurs bookings
    );

    // Vérifier les conflits (même heure)
    const proposedStart = new Date(startTime);
    const proposedEnd = new Date(endTime);

    const conflicting = learnerBookings.find((booking) => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);

      // Conflit si les créneaux se chevauchent
      return (
        (proposedStart >= bookingStart && proposedStart < bookingEnd) ||
        (proposedEnd > bookingStart && proposedEnd <= bookingEnd) ||
        (proposedStart <= bookingStart && proposedEnd >= bookingEnd)
      );
    });

    return {
      hasConflict: !!conflicting,
      conflictingBooking: conflicting || null,
    };
  }, [startTime, endTime, learnerId, bookings]);

  return conflict;
};
