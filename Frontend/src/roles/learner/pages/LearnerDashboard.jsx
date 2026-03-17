import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { FaBook, FaVideo, FaCalendarAlt, FaComments } from "react-icons/fa";
import { useAuthStore } from "../../../app/store/auth.store";
import { useCoursesStore } from "../../../app/store/courses.store";
import { useChatStore } from "../../../app/store/chat.store";

/**
 * LearnerDashboard
 * ----------------
 * - Bande d'information EN HAUT
 * - Texte défilant continu (marquee)
 * - Titre en dessous
 * - Image + statistiques
 */
export const LearnerDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const learnerId = user?.id || user?.email || null;
  const { bookings, fetchBookings } = useCoursesStore();
  const { conversations, fetchConversations } = useChatStore();

  const userName = user?.name || "";

  useEffect(() => {
    fetchBookings();
    fetchConversations();
  }, [fetchBookings, fetchConversations]);

  const now = useMemo(() => new Date(), []);

  const myBookings = useMemo(
    () =>
      bookings.filter(
        (b) => learnerId && String(b.learnerId) === String(learnerId)
      ),
    [bookings, learnerId]
  );

  const completedCoursesCount = useMemo(
    () => myBookings.filter((b) => b.status === "completed").length,
    [myBookings]
  );

  const upcomingBookingsCount = useMemo(
    () =>
      myBookings.filter(
        (b) =>
          ["pending", "confirmed"].includes(b.status) &&
          new Date(b.startTime) > now
      ).length,
    [myBookings, now]
  );

  const uniqueUpcomingDaysCount = useMemo(() => {
    const days = new Set(
      myBookings
        .filter(
          (b) =>
            ["pending", "confirmed"].includes(b.status) &&
            new Date(b.startTime) > now
        )
        .map((b) => (b.startTime || "").slice(0, 10))
    );
    return days.size;
  }, [myBookings, now]);

  const messagesCount = conversations.length;

  const stats = [
    { label: "Cours suivis", value: completedCoursesCount, icon: FaBook },
    { label: "Cours à venir", value: upcomingBookingsCount, icon: FaVideo },
    { label: "Jours avec cours", value: uniqueUpcomingDaysCount, icon: FaCalendarAlt },
    { label: "Conversations", value: messagesCount, icon: FaComments },
  ];

  const infoMessages = [
    `📚 ${completedCoursesCount} cours déjà suivis`,
    `📆 ${upcomingBookingsCount} réservation(s) à venir`,
    `📅 ${uniqueUpcomingDaysCount} jour(s) avec des cours prévus`,
    `💬 ${messagesCount} conversation(s) active(s)`,
  ];

  const marqueeText = infoMessages.join("   •   ");

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden bg-primary/10 text-primary px-4 py-2 rounded shadow-sm h-10">
        <motion.div
          className="absolute flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        >
          <span className="mx-6 text-sm font-medium">{marqueeText}</span>
          <span className="mx-6 text-sm font-medium">{marqueeText}</span>
        </motion.div>
      </div>

      <h1 className="text-2xl font-bold text-dark">
        Bienvenue sur Nateiva Learn,
        {userName && <span className="text-dark">  {userName}</span>}
      </h1>

      <div className="flex flex-col lg:flex-row items-start justify-around gap-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded shadow-sm p-6 flex items-center justify-center lg:w-2/5"
        >
          <img
            src="/teacher-new.png"
            alt="Illustration"
            className="w-full max-h-80 object-contain"
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded p-5 shadow-sm flex items-center gap-4"
            >
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Icon size={22} />
              </div>
              <div>
                <p className="text-sm text-dark/60">{label}</p>
                <p className="text-xl font-bold text-dark">{value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
