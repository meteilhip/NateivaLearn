// src/roles/tutor/pages/TutorCalendar.jsx
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../app/store/auth.store";
import { useCoursesStore } from "../../../app/store/courses.store";
import { BookingStatusBadge } from "../../../shared/ui/BookingStatusBadge";
import { Button } from "../../../shared/ui/Button";

/** TutorCalendar - Agenda tuteur (mock). */
export const TutorCalendar = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const tutorId = user?.teacherId || user?.id || user?.email || "t1";
  const { bookings, setBookingsForTutor } = useCoursesStore();
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  });

  useEffect(() => {
    setBookingsForTutor(tutorId);
  }, [tutorId, setBookingsForTutor]);

  const myBookings = useMemo(() => bookings.filter((b) => b.tutorId === tutorId && ["pending", "confirmed"].includes(b.status)), [bookings, tutorId]);
  const upcoming = useMemo(() => myBookings.filter((b) => new Date(b.startTime) >= new Date()).sort((a, b) => new Date(a.startTime) - new Date(b.startTime)), [myBookings]);
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(d.getDate() + i); return d; }), [weekStart]);
  const bookingsByDay = useMemo(() => {
    const map = {};
    weekDays.forEach((d) => { const key = d.toISOString().slice(0, 10); map[key] = myBookings.filter((b) => b.startTime.slice(0, 10) === key); });
    return map;
  }, [weekDays, myBookings]);
  const estimatedRevenue = useMemo(() => myBookings.reduce((acc, b) => acc + (b.price || 0), 0), [myBookings]);
  const formatTime = (iso) => new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark">{t("calendar.title")}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-dark/60">{t("teacherPages.sessionsCount")}</p>
          <p className="text-2xl font-bold text-dark">{myBookings.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-dark/60">{t("teacherPages.estimatedRevenue")}</p>
          <p className="text-2xl font-bold text-primary">{estimatedRevenue.toLocaleString()} $</p>
        </motion.div>
      </div>
      <section>
        <h2 className="text-lg font-semibold text-dark mb-3 flex items-center gap-2">
          <FaCalendarAlt className="text-primary" /> {t("calendar.upcomingLessons")}
        </h2>
        <div className="space-y-3">
          {upcoming.length === 0 ? (
            <p className="text-dark/60 text-sm">{t("courses.noUpcoming")}</p>
          ) : (
            upcoming.slice(0, 5).map((b) => (
              <motion.div key={b.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-lg p-4 flex items-center justify-between gap-4 shadow-sm">
                <div>
                  <p className="font-medium text-dark">Apprenant – {b.subject}</p>
                  <p className="text-sm text-dark/60">{new Date(b.startTime).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })} à {formatTime(b.startTime)}</p>
                </div>
                <BookingStatusBadge status={b.status} />
              </motion.div>
            ))
          )}
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-dark">{t("calendar.week")}</h2>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded text-sm" onClick={() => setWeekStart((d) => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; })}>←</Button>
            <Button variant="outline" className="rounded text-sm" onClick={() => setWeekStart((d) => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; })}>→</Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((d) => (
            <div key={d.toISOString()} className="bg-white rounded-lg p-2 shadow-sm min-h-[100px]">
              <p className="text-xs font-medium text-dark/70">{dayNames[d.getDay()]} {d.getDate()}</p>
              <div className="mt-2 space-y-1">
                {(bookingsByDay[d.toISOString().slice(0, 10)] || []).map((b) => (
                  <div key={b.id} className="text-xs bg-primary/10 text-primary rounded px-2 py-1 truncate">{formatTime(b.startTime)}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
