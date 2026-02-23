import { motion } from "framer-motion";
import { FaBook, FaVideo, FaCalendarAlt, FaComments } from "react-icons/fa";
import { useAuthStore } from "../../../app/store/auth.store";

/**
 * TutorDashboard
 * ----------------
 * Dashboard enseignant avec :
 * - Bande info en haut
 * - Titre personnalisé avec le nom de l'utilisateur
 * - Image + statistiques
 */
export const TutorDashboard = () => {
  // ─────────────────────────────
  // Utilisateur connecté
  // ─────────────────────────────
  const user = useAuthStore((state) => state.user);

  // Nom à afficher (fallback sécurisé)
  const userName = user?.name || "";

  // ─────────────────────────────
  // Statistiques enseignant
  // ─────────────────────────────
  const stats = [
    { label: "Cours donnés", value: 8, icon: FaBook },
    { label: "Sessions visio", value: 4, icon: FaVideo },
    { label: "Événements", value: 2, icon: FaCalendarAlt },
    { label: "Messages", value: 5, icon: FaComments },
  ];

  // ─────────────────────────────
  // Messages d'information
  // ─────────────────────────────
  const infoMessages = [
    "📢 Nouveau cours publié pour vos étudiants",
    "🎥 Session visio programmée demain à 18h",
    "💬 3 nouveaux messages reçus",
    "📅 Vérifiez vos événements de la semaine",
  ];

  // Texte continu pour le marquee
  const marqueeText = infoMessages.join("   •   ");

  return (
    <div className="space-y-8">
      {/* ───────────────────────────── */}
      {/* BANDE INFO EN HAUT */}
      {/* ───────────────────────────── */}
      <div
        className="
          relative
          overflow-hidden
          bg-primary/10
          text-primary
          px-4
          py-2
          rounded
          shadow-sm
          h-10
        "
      >
        <motion.div
          className="absolute flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <span className="mx-6 text-sm font-medium">{marqueeText}</span>
          <span className="mx-6 text-sm font-medium">{marqueeText}</span>
        </motion.div>
      </div>

      {/* ───────────────────────────── */}
      {/* TITRE DE BIENVENUE */}
      {/* ───────────────────────────── */}
      <h1 className="text-2xl font-bold text-dark">
        Bienvenue sur Nateiva Learn,
        {userName && (
          <span className="text-dark">  {userName}</span>
        )}
      </h1>

      {/* ───────────────────────────── */}
      {/* IMAGE + STATISTIQUES */}
      {/* ───────────────────────────── */}
      <div className="flex flex-col lg:flex-row items-start justify-around gap-6">
        {/* Image à gauche */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded shadow-sm p-6 flex items-center justify-center lg:w-2/5"
        >
          <img
            src="/teacher-new.png"
            alt="Tutor illustration"
            className="w-full max-h-80 object-contain"
          />
        </motion.div>

        {/* Statistiques à droite */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded p-5 shadow-sm flex items-center gap-4"
            >
              {/* Icône */}
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Icon size={22} />
              </div>

              {/* Texte */}
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
