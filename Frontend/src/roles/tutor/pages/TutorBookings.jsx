// src/roles/tutor/pages/TutorBookings.jsx
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaBrain } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../app/store/auth.store";
import { useCoursesStore } from "../../../app/store/courses.store";
import { BookingStatusBadge } from "../../../shared/ui/BookingStatusBadge";
import { Button } from "../../../shared/ui/Button";
import { CreateQuizModal } from "../../../shared/components/quiz/CreateQuizModal";
import { chatService } from "../../../services";

/**
 * TutorBookings
 * ---------------
 * Liste des réservations côté enseignant, branchée sur l’API.
 *
 * 👨🏽‍🏫 Enseignant peut :
 * - Voir prochaines réservations et historique (réels, depuis la BD)
 * - Voir l’élève, le statut (pending, confirmed, completed, cancelled, no_show)
 * - Marquer une réservation comme "completed"
 * - Créer des quiz uniquement pour les apprenants avec une réservation en cours
 */
export const TutorBookings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const tutorId = user?.teacherId || user?.id || user?.email || "t1";
  const tutorName = user?.name || "Tuteur";
  const { bookings, setBookingsForTutor, completeBooking } = useCoursesStore();
  const [createQuizModalOpen, setCreateQuizModalOpen] = useState(false);

  useEffect(() => {
    setBookingsForTutor(tutorId);
  }, [tutorId, setBookingsForTutor]);

  // Apprenants éligibles pour les quiz :
  // - au moins une réservation en cours (pending/confirmed dans le futur)
  const eligibleLearners = useMemo(() => {
    const byLearner = new Map();
    const now = new Date();

    bookings.forEach((booking) => {
      const isActiveReservation =
        ["pending", "confirmed"].includes(booking.status) &&
        booking.startTime &&
        new Date(booking.startTime) > now;

      if (!isActiveReservation) return;
      if (!booking.learnerId) return;

      if (!byLearner.has(booking.learnerId)) {
        byLearner.set(booking.learnerId, {
          id: String(booking.learnerId),
          name: booking.learnerName || `Apprenant ${booking.learnerId}`,
          email: booking.learnerEmail || null,
        });
      }
    });

    return Array.from(byLearner.values());
  }, [bookings]);

  const upcoming = bookings.filter(
    (b) => ["pending", "confirmed"].includes(b.status) && new Date(b.startTime) > new Date()
  );
  const past = bookings.filter(
    (b) => new Date(b.startTime) <= new Date() || ["completed", "cancelled", "no_show"].includes(b.status)
  );

  const formatDate = (iso) =>
    new Date(iso).toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  const handleMessageLearner = async (learnerId) => {
    if (!learnerId) return;
    try {
      const conv = await chatService.findOrCreateConversation(learnerId);
      const conversationId = conv?.id ?? conv?.conversation_id ?? conv?.conversationId;
      if (conversationId) {
        navigate("/tutor/chat", { state: { conversationId } });
      } else {
        navigate("/tutor/chat");
      }
    } catch {
      navigate("/tutor/chat");
    }
  };

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
          className="flex items-center gap-2 rounded"
          disabled={eligibleLearners.length === 0}
          title={
            eligibleLearners.length === 0
              ? t(
                  "quiz.noEligibleLearnersTooltip",
                  "Aucun apprenant avec réservation en cours pour le moment"
                )
              : undefined
          }
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
                    <Button
                      variant="primary"
                      className="rounded text-sm"
                      onClick={() => completeBooking(b.id)}
                    >
                      {t("teacherPages.markCompleted")}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="rounded text-xs"
                    onClick={() => handleMessageLearner(b.learnerId)}
                  >
                    {t("chat.messageLearner", "Écrire à l’apprenant")}
                  </Button>
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
                  <p className="font-medium text-dark">
                    Apprenant (ID: {b.learnerId}) – {b.subject}
                  </p>
                  <p className="text-sm text-dark/60">{formatDate(b.startTime)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <BookingStatusBadge status={b.status} />
                  <Button
                    variant="outline"
                    className="rounded text-xs"
                    onClick={() => handleMessageLearner(b.learnerId)}
                  >
                    {t("chat.messageLearner", "Écrire à l’apprenant")}
                  </Button>
                </div>
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
        learners={eligibleLearners}
      />
    </div>
  );
};
