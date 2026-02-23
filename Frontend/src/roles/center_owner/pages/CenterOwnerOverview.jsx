/**
 * CenterOwnerOverview - Vue d'ensemble du centre (organisation).
 * Données mockées. Backend : stats agrégées plus tard.
 */
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaUsers, FaUserGraduate, FaBook, FaChartLine } from "react-icons/fa";
import { useActiveOrganization } from "../../../shared/hooks/useActiveOrganization";
import { useAuthStore } from "../../../app/store/auth.store";

export function CenterOwnerOverview() {
  const { t } = useTranslation();
  const { activeOrganization, isCenterContext } = useActiveOrganization();
  const user = useAuthStore((state) => state.user);
  const userName = user?.name || "";
  const org = activeOrganization || { name: t("center_owner.myOrganization"), description: "" };
  const stats = [
    { label: t("center_owner.tutorsCount"), value: org.tutorIds?.length ?? 0, icon: FaUsers },
    { label: t("center_owner.learnersCount"), value: org.learnerIds?.length ?? 0, icon: FaUserGraduate },
    { label: t("center_owner.coursesCount"), value: 12, icon: FaBook },
    { label: t("center_owner.revenue"), value: "—", icon: FaChartLine },
  ];

  // Messages d'information pour la bande annonce
  const infoMessages = [
    "📢 Nouvelle demande de tuteur en attente",
    "👥 3 nouveaux apprenants cette semaine",
    "💬 5 nouveaux messages de vos tuteurs",
    "📅 Vérifiez les réservations de la semaine",
  ];

  const marqueeText = infoMessages.join("   •   ");

  return (
    <div className="space-y-8">
      {/* Bande annonce */}
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
        {t("center_owner.dashboardTitle")}
        {userName && <span className="text-dark">, {userName}</span>}
      </h1>
      {!isCenterContext && <p className="text-dark/60 text-sm">{t("center_owner.noActiveOrganization")}</p>}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-dark mb-2">{org.name}</h2>
        {org.description && <p className="text-dark/60 text-sm mb-4">{org.description}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3 p-3 bg-black/5 rounded-lg">
              <div className="p-2 rounded-full bg-primary/10 text-primary"><Icon size={20} /></div>
              <div>
                <p className="text-xs text-dark/60">{label}</p>
                <p className="text-lg font-bold text-dark">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
