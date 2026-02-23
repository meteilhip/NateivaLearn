// src/roles/learner/pages/BookingPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCoursesStore } from "../../../app/store/courses.store";
import { useAuthStore } from "../../../app/store/auth.store";
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
  const { tutors, createBooking, confirmBooking } = useCoursesStore();
  const user = useAuthStore((state) => state.user);
  const learnerId = user?.id || user?.email || "learner-1";

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [paymentSimulated, setPaymentSimulated] = useState(false);

  // Trouver le tutor
  const tutor = tutors.find((t) => t.id === tutorId);

  useEffect(() => {
    if (!tutor) {
      // Tutor non trouvé, rediriger vers la page des cours
      navigate("/learner/courses");
    }
  }, [tutor, navigate]);

  const handleConfirm = ({ useSubscription }) => {
    if (!tutor || !selectedDate || !selectedSlot) return;

    const start = new Date(selectedDate);
    start.setHours(Math.floor(selectedSlot.start / 60), selectedSlot.start % 60, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(Math.floor(selectedSlot.end / 60), selectedSlot.end % 60, 0, 0);

    // Créer la réservation
    const booking = createBooking({
      learnerId,
      tutorId: tutor.id,
      tutorName: tutor.name,
      tutorAvatar: tutor.avatar,
      subject: tutor.subjects?.[0] || "",
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      price: tutor.pricePerHour,
    });

    // Simuler le paiement si nécessaire
    if (!useSubscription) {
      setPaymentSimulated(true);
      setTimeout(() => {
        confirmBooking(booking.id);
        setPaymentSimulated(false);
        // Rediriger vers la page des cours après confirmation
        setTimeout(() => {
          navigate("/learner/courses");
        }, 1000);
      }, 800);
    } else {
      // Utiliser l'abonnement (simulation)
      confirmBooking(booking.id);
      setTimeout(() => {
        navigate("/learner/courses");
      }, 500);
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
            tutor={tutor}
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
