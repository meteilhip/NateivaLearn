// src/roles/learner/pages/LearnerCenter.jsx
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useLearnerCenter } from "../../../shared/hooks/useLearnerCenter";
import { useOrganizationsStore } from "../../../app/store/organizations.store";
import { useCoursesStore } from "../../../app/store/courses.store";
import { CenterCard } from "../../../shared/components/CenterCard";
import { CenterDetailModal } from "../../../shared/components/CenterDetailModal";
import { TutorCard } from "../../../shared/components/TutorCard";

/**
 * LearnerCenter
 * -------------
 * Page "Mon centre" pour learner.
 * Si learner a un centre : affiche infos centre + liste tuteurs.
 * Si learner n'a pas de centre : affiche liste centres avec filtres.
 */
export const LearnerCenter = () => {
  const { t } = useTranslation();
  const { hasCenter, center } = useLearnerCenter();
  const { organizations, fetchOrganizations, discoverOrganizations } = useOrganizationsStore();
  const { tutors, fetchTutors } = useCoursesStore();
  const [filters, setFilters] = useState({ city: "", country: "", subject: "" });
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [centerDetailOpen, setCenterDetailOpen] = useState(false);
  const [discoveredCenters, setDiscoveredCenters] = useState([]);
  const [isLoadingCenters, setIsLoadingCenters] = useState(false);

  // Charger les centres et tuteurs réels au montage
  useEffect(() => {
    fetchOrganizations?.();
    fetchTutors?.();
  }, [fetchOrganizations, fetchTutors]);

  // Quand le learner n'a pas de centre : charger la liste des centres via discover (tous les centres)
  useEffect(() => {
    if (hasCenter) return;
    let isMounted = true;
    const load = async () => {
      try {
        setIsLoadingCenters(true);
        const list = await (discoverOrganizations
          ? discoverOrganizations({ city: filters.city || undefined, country: filters.country || undefined })
          : (async () => {
              const { organizationService } = await import("../../../services");
              const data = await organizationService.discover({ city: filters.city || undefined, country: filters.country || undefined });
              return Array.isArray(data) ? data : [];
            })());
        if (!isMounted) return;
        setDiscoveredCenters(Array.isArray(list) ? list : []);
      } catch {
        if (!isMounted) return;
        setDiscoveredCenters([]);
      } finally {
        if (isMounted) setIsLoadingCenters(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [hasCenter, filters.city, filters.country, discoverOrganizations]);

  // Centre du learner basé sur l'organisation active
  const centerData = useMemo(() => {
    if (!center) return null;
    return center;
  }, [center]);

  // Tuteurs du centre du learner
  const centerTutors = useMemo(() => {
    if (!centerData) return [];
    return tutors.filter((tutor) => tutor.center === centerData.name);
  }, [centerData, tutors]);

  // Centres à afficher quand le learner n'a pas de centre : liste discover (filtrée)
  const filteredCenters = useMemo(() => {
    const list = discoveredCenters || [];
    return list.filter((org) => {
      if (filters.city && org.city !== filters.city) return false;
      if (filters.country && org.country !== filters.country) return false;
      if (filters.subject) {
        const orgSubjects = (org.subjects || []).map((s) => (typeof s === "string" ? s : s?.name ?? s));
        if (!orgSubjects.includes(filters.subject)) return false;
      }
      return true;
    });
  }, [filters, discoveredCenters]);

  // Liste des villes uniques (depuis les centres discover)
  const cities = useMemo(
    () =>
      [...new Set((discoveredCenters || []).map((o) => o.city).filter(Boolean))].sort(),
    [discoveredCenters]
  );

  // Liste des pays uniques (depuis les centres discover)
  const countries = useMemo(
    () =>
      [...new Set((discoveredCenters || []).map((o) => o.country).filter(Boolean))].sort(),
    [discoveredCenters]
  );

  // Liste des matières uniques (depuis les centres discover)
  const subjects = useMemo(() => {
    const allSubjects = (discoveredCenters || []).flatMap((o) =>
      (o.subjects || []).map((s) => (typeof s === "string" ? s : s?.name ?? s))
    );
    return [...new Set(allSubjects)].sort();
  }, [discoveredCenters]);

  const handleCenterClick = (center) => {
    setSelectedCenter(center);
    setCenterDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark">
        {hasCenter ? t("learner.myCenter", "Mon centre") : t("learner.findCenter", "Trouver un centre")}
      </h1>

      {/* Cas 1 : Learner a un centre */}
      {hasCenter && centerData && (
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
                  {[centerData.address, centerData.city, centerData.country].filter(Boolean).join(", ")}
                </p>
                {centerData.contactPhone && (
                  <p className="text-dark/60 mb-4">{centerData.contactPhone}</p>
                )}
                {centerData.ratings && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-dark/60">
                      {centerData.ratings.score} ⭐ ({centerData.ratings.reviews} avis)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Liste des tuteurs du centre */}
          <div>
            <h2 className="text-lg font-semibold text-dark mb-4">
              {t("center.centerTutors", "Tuteurs du centre")}
            </h2>
            {centerTutors.length === 0 ? (
              <p className="text-dark/60">{t("center.noTutors", "Aucun tuteur pour ce centre")}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {centerTutors.map((tutor) => (
                  <TutorCard
                    key={tutor.id}
                    tutor={tutor}
                    showPrice
                    showRating
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Cas 2 : Learner n'a pas de centre */}
      {!hasCenter && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Filtres : Pays puis Ville puis Matière, libellés explicites */}
          <div className="bg-white rounded-lg p-4 shadow-sm flex flex-wrap gap-4 items-end">
            <div className="min-w-[180px]">
              <label className="block text-xs text-dark/60 mb-1">{t("learner.filterByCountry", "Dans quel pays ?")}</label>
              <select
                value={filters.country}
                onChange={(e) => setFilters((f) => ({ ...f, country: e.target.value }))}
                className="w-full border border-black/20 rounded px-3 py-2 text-sm"
              >
                <option value="">{t("courses.all", "Tous")}</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="min-w-[180px]">
              <label className="block text-xs text-dark/60 mb-1">{t("learner.filterByCity", "Dans quelle ville ?")}</label>
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
              <label className="block text-xs text-dark/60 mb-1">{t("learner.filterBySubject", "Je veux un centre qui propose")}</label>
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

          {!isLoadingCenters && filteredCenters.length === 0 && (
            <p className="text-dark/60 text-center py-8">
              {t("learner.noCentersFound", "Aucun centre trouvé")}
            </p>
          )}
          {isLoadingCenters && (
            <p className="text-dark/60 text-center py-8">{t("common.loading", "Chargement…")}</p>
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
