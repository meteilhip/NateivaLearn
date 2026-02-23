// src/roles/tutor/pages/TutorBookings.jsx
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaBrain } from "react-icons/fa";
import { useAuthStore } from "../../../app/store/auth.store";
import { useCoursesStore } from "../../../app/store/courses.store";
import { BookingStatusBadge } from "../../../shared/ui/BookingStatusBadge";
import { Button } from "../../../shared/ui/Button";
import { CreateQuizModal } from "../../../shared/components/quiz/CreateQuizModal";

/**
 * TutorBookings
 * ---------------
 * Liste des réservations côté enseignant (mock).
 *
 * 👨🏽‍🏫 Enseignant peut :
 * - Voir prochaines sessions et historique
 * - Voir l’élève, statut (pending, confirmed, completed, cancelled, no_show)
 * - Marquer comme "completed"
 *
 * Données dans courses.store. Plus tard : notes internes, API.
 */
export const TutorBookings = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const tutorId = user?.teacherId || user?.id || user?.email || "t1";
  const tutorName = user?.name || "Tuteur";
  const { bookings, setBookingsForTutor, completeBooking } = useCoursesStore();
  const [createQuizModalOpen, setCreateQuizModalOpen] = useState(false);

  useEffect(() => {
    setBookingsForTutor(tutorId);
  }, [tutorId, setBookingsForTutor]);

  // Extraire la liste des apprenants uniques depuis les bookings
  const learners = useMemo(() => {
    const learnerMap = new Map();
    bookings.forEach((booking) => {
      if (!learnerMap.has(booking.learnerId)) {
        learnerMap.set(booking.learnerId, {
          id: booking.learnerId,
          name: booking.learnerName || `Apprenant ${booking.learnerId}`,
          email: booking.learnerEmail || null,
        });
      }
    });
    return Array.from(learnerMap.values());
  }, [bookings]);

  const upcoming = bookings.filter(
    (b) => ["pending", "confirmed"].includes(b.status) && new Date(b.startTime) > new Date()
  );
  const past = bookings.filter(
    (b) => new Date(b.startTime) <= new Date() || ["completed", "cancelled", "no_show"].includes(b.status)
  );

  const formatDate = (iso) =>
    new Date(iso).toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">{t("teacherPages.bookingsTitle")}</h1>
          <p className="text-dark/60 text-sm">{t("teacherPages.bookingsSubtitle")}</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setCreateQuizModalOpen(true)}
          className="flex items-center gap-2"
        >
          <FaBrain size={16} />
          {t("quiz.createQuiz", "Créer un quiz")}
        </Button>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-dark mb-3">{t("courses.upcoming")}</h2>
        <div className="space-y-3">
          {upcoming.length === 0 ? (
            <p className="text-dark/60 text-sm">{t("courses.noUpcoming")}</p>
          ) : (
            upcoming.map((b) => (
              <motion.div
                key={b.id}
                layout
                className="bg-white rounded-lg p-4 shadow-sm flex flex-wrap items-center justify-between gap-4"
              >
                <div>
                  <p className="font-medium text-dark">
                    Apprenant (ID: {b.learnerId}) – {b.subject}
                  </p>
                  <p className="text-sm text-dark/60">{formatDate(b.startTime)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <BookingStatusBadge status={b.status} />
                  {b.status === "confirmed" && (
                    <Button variant="primary" className="rounded text-sm" onClick={() => completeBooking(b.id)}>
                      {t("teacherPages.markCompleted")}
                    </Button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-dark mb-3">{t("courses.history")}</h2>
        <div className="space-y-3">
          {past.length === 0 ? (
            <p className="text-dark/60 text-sm">{t("courses.noHistory")}</p>
          ) : (
            past.map((b) => (
              <motion.div
                key={b.id}
                layout
                className="bg-white rounded-lg p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 opacity-90"
              >
                <div>
                  <p className="font-medium text-dark">Apprenant (ID: {b.learnerId}) – {b.subject}</p>
                  <p className="text-sm text-dark/60">{formatDate(b.startTime)}</p>
                </div>
                <BookingStatusBadge status={b.status} />
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Modal de création de quiz */}
      <CreateQuizModal
        isOpen={createQuizModalOpen}
        onClose={() => setCreateQuizModalOpen(false)}
        tutorId={tutorId}
        tutorName={tutorName}
        learners={learners}
      />
    </div>
  );
};
