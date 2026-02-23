// src/roles/tutor/pages/TutorCenter.jsx
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useAuthStore } from "../../../app/store/auth.store";
import { useOrganizationsStore } from "../../../app/store/organizations.store";
import { useCoursesStore } from "../../../app/store/courses.store";
import { CenterCard } from "../../../shared/components/CenterCard";
import { CenterDetailModal } from "../../../shared/components/CenterDetailModal";
import centersData from "../../../data/centers";

/**
 * TutorCenter
 * -----------
 * Page "Mon Centre" pour tutor.
 * Si tutor a un centre : affiche infos centre + propriétaire + autres tuteurs.
 * Sinon : affiche liste centres filtrable.
 */
export const TutorCenter = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const { organizations, memberships } = useOrganizationsStore();
  const { tutors } = useCoursesStore();

  const [filters, setFilters] = useState({ city: "", subject: "" });
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [centerDetailOpen, setCenterDetailOpen] = useState(false);

  // Trouver le centre du tutor
  const tutorCenter = useMemo(() => {
    if (!user) return null;
    const userId = user.id || user.email;
    
    // Chercher un membership "tutor" pour cet utilisateur
    const tutorMembership = (memberships || []).find(
      (m) => m.userId === userId && m.role === "tutor"
    );

    if (!tutorMembership) return null;

    // Retourner l'organisation correspondante
    return (organizations || []).find(
      (org) => org.id === tutorMembership.organizationId
    ) || null;
  }, [user, organizations, memberships]);

  // Trouver le centre complet depuis les données mockées
  const centerData = useMemo(() => {
    if (!tutorCenter) return null;
    return centersData.find((c) => c.name === tutorCenter.name || String(c.id) === String(tutorCenter.id)) || null;
  }, [tutorCenter]);

  // Tuteurs du centre (autres que le tutor actuel)
  const centerTutors = useMemo(() => {
    if (!centerData) return [];
    const userId = user?.id || user?.email;
    return tutors.filter(
      (tutor) => tutor.center === centerData.name && tutor.id !== userId
    );
  }, [centerData, tutors, user]);

  // Propriétaire du centre
  const centerOwner = useMemo(() => {
    if (!tutorCenter) return null;
    const ownerId = tutorCenter.ownerId;
    // Dans un vrai app, on récupérerait depuis le store users
    return { name: "Propriétaire du centre", email: ownerId };
  }, [tutorCenter]);

  // Centres filtrés (si tutor n'a pas de centre)
  const filteredCenters = useMemo(() => {
    return centersData.filter((c) => {
      if (filters.city && c.city !== filters.city) return false;
      if (filters.subject && !c.subjects?.some((s) => s.name === filters.subject)) return false;
      return true;
    });
  }, [filters]);

  // Liste des villes uniques
  const cities = useMemo(() => [...new Set(centersData.map((c) => c.city))].sort(), []);
  
  // Liste des matières uniques
  const subjects = useMemo(() => {
    const allSubjects = centersData.flatMap((c) => c.subjects || []).map((s) => s.name);
    return [...new Set(allSubjects)].sort();
  }, []);

  const handleCenterClick = (center) => {
    setSelectedCenter(center);
    setCenterDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark">
        {tutorCenter ? t("tutor.myCenter", "Mon centre") : t("tutor.findCenter", "Trouver un centre")}
      </h1>

      {/* Cas 1 : Tutor a un centre */}
      {tutorCenter && centerData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Infos du centre */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {centerData.image && (
                <img
                  src={centerData.image}
                  alt={centerData.name}
                  className="w-full md:w-64 h-48 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-dark mb-2">{centerData.name}</h2>
                <p className="text-dark/60 mb-1">
                  {centerData.address}, {centerData.city}
                </p>
                {centerData.contactPhone && (
                  <p className="text-dark/60 mb-4">{centerData.contactPhone}</p>
                )}
                {centerData.ratings && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-dark/60">
                      {centerData.ratings.score} ⭐ ({centerData.ratings.reviews} avis)
                    </span>
                  </div>
                )}
                
                {/* Propriétaire */}
                {centerOwner && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-dark/60 mb-1">
                      {t("tutor.centerOwner", "Propriétaire")}
                    </p>
                    <p className="text-sm text-dark">{centerOwner.name}</p>
                  </div>
                )}

                {/* Date de création */}
                {tutorCenter.createdAt && (
                  <div>
                    <p className="text-sm font-medium text-dark/60 mb-1">
                      {t("tutor.createdAt", "Date de création")}
                    </p>
                    <p className="text-sm text-dark">
                      {new Date(tutorCenter.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Autres tuteurs du centre */}
          {centerTutors.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-dark mb-4">
                {t("tutor.otherTutors", "Autres tuteurs du centre")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {centerTutors.map((tutor) => (
                  <div key={tutor.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src={tutor.avatar || "/placeholder-avatar.png"}
                        alt={tutor.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-dark">{tutor.name}</p>
                        <p className="text-sm text-dark/60">{tutor.subjects?.join(", ")}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Cas 2 : Tutor n'a pas de centre */}
      {!tutorCenter && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Filtres */}
          <div className="bg-white rounded-lg p-4 shadow-sm flex flex-wrap gap-4 items-end">
            <div className="min-w-[180px]">
              <label className="block text-xs text-dark/60 mb-1">{t("learner.filterCity", "Ville")}</label>
              <select
                value={filters.city}
                onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
                className="w-full border border-black/20 rounded px-3 py-2 text-sm"
              >
                <option value="">{t("courses.all", "Toutes")}</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="min-w-[180px]">
              <label className="block text-xs text-dark/60 mb-1">{t("courses.filterSubject", "Matière")}</label>
              <select
                value={filters.subject}
                onChange={(e) => setFilters((f) => ({ ...f, subject: e.target.value }))}
                className="w-full border border-black/20 rounded px-3 py-2 text-sm"
              >
                <option value="">{t("courses.all", "Toutes")}</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Liste des centres */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCenters.map((center) => (
              <div key={center.id} onClick={() => handleCenterClick(center)}>
                <CenterCard center={center} />
              </div>
            ))}
          </div>

          {filteredCenters.length === 0 && (
            <p className="text-dark/60 text-center py-8">
              {t("learner.noCentersFound", "Aucun centre trouvé")}
            </p>
          )}
        </motion.div>
      )}

      {/* Modal de détails du centre */}
      {selectedCenter && (
        <CenterDetailModal
          center={selectedCenter}
          isOpen={centerDetailOpen}
          onClose={() => {
            setCenterDetailOpen(false);
            setSelectedCenter(null);
          }}
        />
      )}
    </div>
  );
};
