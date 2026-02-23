// src/roles/learner/pages/LearnerCourses.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaSearch, FaBook, FaHistory } from "react-icons/fa";
import { useAuthStore } from "../../../app/store/auth.store";
import { useCoursesStore } from "../../../app/store/courses.store";
import { TutorCard } from "../../../shared/components/TutorCard";
import { TutorProfileModal } from "../../../shared/components/TutorProfileModal";
import { ConfirmModal } from "../../../shared/components/ConfirmModal";
import { Button } from "../../../shared/ui/Button";
import { BookingStatusBadge } from "../../../shared/ui/BookingStatusBadge";

/**
 * LearnerCourses - Section Cours côté apprenant (type Preply).
 */
export const LearnerCourses = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const learnerId = user?.id || user?.email || "learner-1";

  const {
    tutors,
    bookings,
    getFilteredTutors,
    setBookingsForLearner,
    createBooking,
    confirmBooking,
    cancelBooking,
    setReviewGiven,
  } = useCoursesStore();

  const [activeTab, setActiveTab] = useState("explore");
  const [filters, setFilters] = useState({ language: "", subject: "", priceMin: "", priceMax: "", ratingMin: "" });
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [bookingToCancelId, setBookingToCancelId] = useState(null);

  const subjectOptions = useMemo(
    () => [...new Set(tutors.flatMap((t) => t.subjects || []))].sort(),
    [tutors]
  );

  useEffect(() => {
    setBookingsForLearner(learnerId);
  }, [learnerId, setBookingsForLearner]);

  useEffect(() => {
    const f = {
      language: filters.language || undefined,
      subject: filters.subject || undefined,
      priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
      priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
      ratingMin: filters.ratingMin ? Number(filters.ratingMin) : undefined,
    };
    setFilteredTutors(getFilteredTutors(f));
  }, [filters, tutors, getFilteredTutors]);

  const upcomingBookings = bookings.filter(
    (b) => b.learnerId === learnerId && ["pending", "confirmed"].includes(b.status) && new Date(b.startTime) > new Date()
  );
  const pastBookings = bookings.filter(
    (b) => b.learnerId === learnerId && (b.status === "completed" || b.status === "cancelled") && new Date(b.startTime) <= new Date()
  );

  const openProfile = (tutor) => {
    setSelectedTutor(tutor);
    setProfileModalOpen(true);
  };

  const openBooking = (tutor) => {
    // Rediriger vers la page de réservation au lieu d'ouvrir une modal
    navigate(`/learner/booking/${tutor.id}`);
  };


  const openCancelConfirm = (bookingId) => {
    setBookingToCancelId(bookingId);
    setCancelConfirmOpen(true);
  };

  const handleConfirmCancelBooking = () => {
    if (bookingToCancelId) {
      cancelBooking(bookingToCancelId);
      setBookingToCancelId(null);
    }
  };

  const handleLeaveReview = (bookingId) => {
    setReviewGiven(bookingId);
  };

  const formatBookingDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark">{t("courses.title")}</h1>

      <div className="flex gap-2 border-b border-black/10 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("explore")}
          className={`px-4 py-2 rounded font-medium flex items-center gap-2 ${activeTab === "explore" ? "bg-primary text-white" : "text-dark/70 hover:bg-black/5"}`}
        >
          <FaSearch /> {t("courses.exploreTeachers")}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("lessons")}
          className={`px-4 py-2 rounded font-medium flex items-center gap-2 ${activeTab === "lessons" ? "bg-primary text-white" : "text-dark/70 hover:bg-black/5"}`}
        >
          <FaBook /> {t("courses.myLessons")}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "explore" && (
          <motion.div key="explore" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm flex flex-wrap gap-4 items-end">
              <div className="min-w-[140px]">
                <label className="block text-xs text-dark/60 mb-1">{t("courses.filterLanguage")}</label>
                <select value={filters.language} onChange={(e) => setFilters((f) => ({ ...f, language: e.target.value }))} className="w-full border border-black/20 rounded px-3 py-2 text-sm">
                  <option value="">{t("courses.all")}</option>
                  <option value="Français">Français</option>
                  <option value="Anglais">Anglais</option>
                  <option value="Espagnol">Espagnol</option>
                </select>
              </div>
              <div className="min-w-[140px]">
                <label className="block text-xs text-dark/60 mb-1">{t("courses.filterSubject")}</label>
                <select value={filters.subject} onChange={(e) => setFilters((f) => ({ ...f, subject: e.target.value }))} className="w-full border border-black/20 rounded px-3 py-2 text-sm">
                  <option value="">{t("courses.all")}</option>
                  {subjectOptions.map((sub) => (<option key={sub} value={sub}>{sub}</option>))}
                </select>
              </div>
              <div className="w-24">
                <label className="block text-xs text-dark/60 mb-1">{t("courses.filterPriceMin")}</label>
                <input type="number" value={filters.priceMin} onChange={(e) => setFilters((f) => ({ ...f, priceMin: e.target.value }))} placeholder="0" className="w-full border border-black/20 rounded px-3 py-2 text-sm" />
              </div>
              <div className="w-24">
                <label className="block text-xs text-dark/60 mb-1">{t("courses.filterPriceMax")}</label>
                <input type="number" value={filters.priceMax} onChange={(e) => setFilters((f) => ({ ...f, priceMax: e.target.value }))} placeholder="∞" className="w-full border border-black/20 rounded px-3 py-2 text-sm" />
              </div>
              <div className="w-20">
                <label className="block text-xs text-dark/60 mb-1">{t("courses.filterRating")}</label>
                <input type="number" min="0" max="5" step="0.5" value={filters.ratingMin} onChange={(e) => setFilters((f) => ({ ...f, ratingMin: e.target.value }))} placeholder="0" className="w-full border border-black/20 rounded px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} showPrice showRating onBook={(tut) => openBooking(tut)} />
              ))}
            </div>
            {filteredTutors.length === 0 && <p className="text-dark/60 text-center py-8">{t("courses.noTutorsFound")}</p>}
          </motion.div>
        )}

        {activeTab === "lessons" && (
          <motion.div key="lessons" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-dark mb-3 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" /> {t("courses.upcoming")}
              </h2>
              <div className="space-y-3">
                {upcomingBookings.length === 0 ? <p className="text-dark/60 text-sm">{t("courses.noUpcoming")}</p> : (
                  upcomingBookings.map((b) => (
                    <motion.div key={b.id} layout className="bg-white rounded-lg p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src={b.tutorAvatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-dark">{b.tutorName} – {b.subject}</p>
                          <p className="text-sm text-dark/60">{formatBookingDate(b.startTime)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookingStatusBadge status={b.status} />
                        <Button variant="outline" className="rounded text-sm" onClick={() => openCancelConfirm(b.id)}>{t("courses.cancel")}</Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-dark mb-3 flex items-center gap-2"><FaHistory /> {t("courses.history")}</h2>
              <div className="space-y-3">
                {pastBookings.length === 0 ? <p className="text-dark/60 text-sm">{t("courses.noHistory")}</p> : (
                  pastBookings.map((b) => (
                    <motion.div key={b.id} layout className="bg-white rounded-lg p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src={b.tutorAvatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-dark">{b.tutorName} – {b.subject}</p>
                          <p className="text-sm text-dark/60">{formatBookingDate(b.startTime)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookingStatusBadge status={b.status} />
                        {b.status === "completed" && !b.reviewGiven && (
                          <Button variant="ghost" className="rounded text-sm" onClick={() => handleLeaveReview(b.id)}>{t("courses.leaveReview")}</Button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <TutorProfileModal tutor={selectedTutor} isOpen={profileModalOpen} onClose={() => { setProfileModalOpen(false); setSelectedTutor(null); }} onBook={openBooking} />
      <ConfirmModal isOpen={cancelConfirmOpen} onClose={() => { setCancelConfirmOpen(false); setBookingToCancelId(null); }} onConfirm={handleConfirmCancelBooking} title={t("courses.confirmCancel")} message={t("courses.confirmCancelMessage")} confirmLabel={t("courses.confirmCancelButton")} cancelLabel={t("confirmModal.cancel")} variant="danger" />
    </div>
  );
};
