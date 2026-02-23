// src/roles/learner/pages/LearnerCalendar.jsx
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../app/store/auth.store";
import { useCoursesStore } from "../../../app/store/courses.store";
import { Button } from "../../../shared/ui/Button";
import { BookingStatusBadge } from "../../../shared/ui/BookingStatusBadge";
import { RescheduleModal } from "../../../shared/components/RescheduleModal";

/**
 * LearnerCalendar - Section Agenda côté apprenant.
 */
export const LearnerCalendar = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const learnerId = user?.id || user?.email || "learner-1";
  const { bookings, setBookingsForLearner, tutors } = useCoursesStore();
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  });

  useEffect(() => { setBookingsForLearner(learnerId); }, [learnerId, setBookingsForLearner]);

  const myBookings = useMemo(
    () => bookings.filter((b) => b.learnerId === learnerId && ["pending", "confirmed"].includes(b.status)),
    [bookings, learnerId]
  );

  const upcomingBookings = useMemo(
    () => myBookings.filter((b) => new Date(b.startTime) >= new Date()).sort((a, b) => new Date(a.startTime) - new Date(b.startTime)),
    [myBookings]
  );

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(d.getDate() + i); return d; }), [weekStart]);

  const bookingsByDay = useMemo(() => {
    const map = {};
    weekDays.forEach((d) => { const key = d.toISOString().slice(0, 10); map[key] = myBookings.filter((b) => b.startTime.slice(0, 10) === key); });
    return map;
  }, [weekDays, myBookings]);

  const formatTime = (iso) => new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  const goPrevWeek = () => setWeekStart((d) => { const next = new Date(d); next.setDate(next.getDate() - 7); return next; });
  const goNextWeek = () => setWeekStart((d) => { const next = new Date(d); next.setDate(next.getDate() + 7); return next; });

  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  const handleReschedule = (booking) => {
    setSelectedBooking(booking);
    setRescheduleModalOpen(true);
  };

  const handleConfirmReschedule = ({ bookingId, newStartTime, newEndTime }) => {
    // Mettre à jour la réservation dans le store
    const { updateBooking } = useCoursesStore.getState();
    updateBooking(bookingId, { startTime: newStartTime, endTime: newEndTime });
    setRescheduleModalOpen(false);
    setSelectedBooking(null);
  };

  // Trouver le tutor pour la réservation sélectionnée
  const selectedTutor = useMemo(() => {
    if (!selectedBooking) return null;
    return tutors.find((t) => t.id === selectedBooking.tutorId);
  }, [selectedBooking, tutors]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark">{t("calendar.title")}</h1>
      <section>
        <h2 className="text-lg font-semibold text-dark mb-3 flex items-center gap-2">
          <FaCalendarAlt className="text-primary" /> {t("calendar.upcomingLessons")}
        </h2>
        <div className="space-y-3">
          {upcomingBookings.length === 0 ? <p className="text-dark/60 text-sm">{t("courses.noUpcoming")}</p> : (
            upcomingBookings.slice(0, 5).map((b) => (
              <motion.div key={b.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-lg p-4 flex items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="text-primary"><FaCalendarAlt size={20} /></div>
                  <div>
                    <p className="font-medium text-dark">{b.tutorName} – {b.subject}</p>
                    <p className="text-sm text-dark/60">{new Date(b.startTime).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })} à {formatTime(b.startTime)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookingStatusBadge status={b.status} />
                  <Button
                    variant="outline"
                    className="rounded text-sm"
                    onClick={() => handleReschedule(b)}
                  >
                    {t("calendar.reschedule")}
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-dark">{t("calendar.week")}</h2>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded text-sm" onClick={goPrevWeek}>←</Button>
            <Button variant="outline" className="rounded text-sm" onClick={goNextWeek}>→</Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((d) => (
            <div key={d.toISOString()} className="bg-white rounded-lg p-2 shadow-sm min-h-[120px]">
              <p className="text-xs font-medium text-dark/70">{dayNames[d.getDay()]} {d.getDate()}</p>
              <div className="mt-2 space-y-1">
                {(bookingsByDay[d.toISOString().slice(0, 10)] || []).map((b) => (
                  <div key={b.id} className="text-xs bg-primary/10 text-primary rounded px-2 py-1 truncate" title={`${b.tutorName} ${formatTime(b.startTime)}`}>
                    {formatTime(b.startTime)} {b.tutorName}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal de reprogrammation */}
      {selectedBooking && selectedTutor && (
        <RescheduleModal
          booking={selectedBooking}
          tutor={selectedTutor}
          isOpen={rescheduleModalOpen}
          onClose={() => {
            setRescheduleModalOpen(false);
            setSelectedBooking(null);
          }}
          onConfirm={handleConfirmReschedule}
        />
      )}
    </div>
  );
};
