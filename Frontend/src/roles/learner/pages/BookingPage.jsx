// src/roles/learner/pages/BookingPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useCoursesStore } from "../../../app/store/courses.store";
import { useAuthStore } from "../../../app/store/auth.store";
import { useNotificationsStore } from "../../../app/store/notifications.store";
import { TutorBookingInfo } from "../../../shared/components/booking/TutorBookingInfo";
import { BookingCalendar } from "../../../shared/components/booking/BookingCalendar";
import { BookingSummary } from "../../../shared/components/booking/BookingSummary";
import { motion } from "framer-motion";

/**
 * BookingPage
 * -----------
 * Page dédiée pour réserver un créneau avec un tutor.
 * Layout 3 colonnes : TutorBookingInfo | BookingCalendar | BookingSummary
 */
export const BookingPage = () => {
  const { t } = useTranslation();
  const { tutorId } = useParams();
  const navigate = useNavigate();
  const {
    tutors,
    createBooking,
    confirmBooking,
    fetchAvailabilityForTutor,
    fetchBookings,
    availabilityByTutorId,
  } = useCoursesStore();
  const fetchNotifications = useNotificationsStore((s) => s.fetchNotifications);
  const user = useAuthStore((state) => state.user);
  const learnerId = user?.id || user?.email || "learner-1";

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [paymentSimulated, setPaymentSimulated] = useState(false);

  // Trouver le tutor
  const tutor = useMemo(
    () => tutors.find((t) => String(t.id) === String(tutorId)),
    [tutors, tutorId]
  );

  // Charger ses disponibilités depuis l'API et les injecter dans le tutor passé au calendrier
  const availabilitySlots = useMemo(
    () => (tutor ? availabilityByTutorId[tutor.id] || [] : []),
    [availabilityByTutorId, tutor]
  );

  const calendarTutor = useMemo(
    () => (tutor ? { ...tutor, availabilitySlots } : null),
    [tutor, availabilitySlots]
  );

  useEffect(() => {
    if (tutor) {
      fetchAvailabilityForTutor?.(tutor.id);
    }
  }, [tutor, fetchAvailabilityForTutor]);

  useEffect(() => {
    if (!tutor) {
      // Tutor non trouvé, rediriger vers la page des cours
      navigate("/learner/courses");
    }
  }, [tutor, navigate]);

  const handleConfirm = async ({ useSubscription }) => {
    if (!tutor || !selectedDate || !selectedSlot) return;

    const start = new Date(selectedDate);
    start.setHours(Math.floor(selectedSlot.start / 60), selectedSlot.start % 60, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(Math.floor(selectedSlot.end / 60), selectedSlot.end % 60, 0, 0);

    const pad = (n) => String(n).padStart(2, "0");
    const dateStr = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`;
    const startTimeStr = `${pad(start.getHours())}:${pad(start.getMinutes())}`;
    const endTimeStr = `${pad(end.getHours())}:${pad(end.getMinutes())}`;

    const booking = await createBooking({
      learnerId,
      tutorId: tutor.id,
      tutorName: tutor.name,
      tutorAvatar: tutor.avatar,
      subject: tutor.subjects?.[0] || "",
      date: dateStr,
      startTime: startTimeStr,
      endTime: endTimeStr,
      price: tutor.pricePerHour,
    });

    if (!booking || booking.error) {
      const msg = booking?.error;
      const message = typeof msg === "string"
        ? msg
        : booking?.errors && typeof booking.errors === "object"
          ? Object.values(booking.errors).flat().filter(Boolean).join(" ") || t("booking.error", "Impossible de créer la réservation")
          : t("booking.error", "Impossible de créer la réservation");
      toast.error(message);
      return;
    }

    if (!useSubscription) {
      // Paiement supposé effectué : demande envoyée au tuteur (statut pending)
      setPaymentSimulated(true);
      toast.success(
        t("booking.paymentAndRequestSent", "Paiement effectué. Votre demande de réservation a été envoyée au tuteur.")
      );
      fetchNotifications?.();
      fetchBookings?.();
      setTimeout(() => {
        setPaymentSimulated(false);
        navigate("/learner/courses");
      }, 1500);
    } else {
      // Utiliser l'abonnement (simulation) : confirmation directe
      confirmBooking(booking.id);
      fetchNotifications?.();
      setTimeout(() => navigate("/learner/courses"), 500);
    }
  };

  if (!tutor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-dark/60">{t("courses.noTutorsFound")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-dark">
          {t("courses.bookSlot")} - {tutor.name}
        </h1>
        <button
          type="button"
          onClick={() => navigate("/learner/courses")}
          className="text-dark/60 hover:text-dark"
        >
          {t("common.cancel", "Annuler")}
        </button>
      </div>

      {/* Layout 3 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne 1 : TutorBookingInfo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TutorBookingInfo tutor={tutor} />
        </motion.div>

        {/* Colonne 2 : BookingCalendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <BookingCalendar
            tutor={calendarTutor}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            selectedSlot={selectedSlot}
            onSlotSelect={setSelectedSlot}
          />
        </motion.div>

        {/* Colonne 3 : BookingSummary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <BookingSummary
            tutor={tutor}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            onConfirm={handleConfirm}
          />
        </motion.div>
      </div>

      {/* Notification de paiement simulé */}
      {paymentSimulated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 bg-emerald-600 text-white px-4 py-2 rounded shadow-lg z-50"
        >
          {t("courses.paymentSimulated")}
        </motion.div>
      )}
    </div>
  );
};
