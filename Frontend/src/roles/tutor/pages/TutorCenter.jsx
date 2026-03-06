// src/roles/tutor/pages/TutorCenter.jsx
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useAuthStore } from "../../../app/store/auth.store";
import { useOrganizationsStore } from "../../../app/store/organizations.store";
import { CenterCard } from "../../../shared/components/CenterCard";
import { CenterDetailModal } from "../../../shared/components/CenterDetailModal";

// Matières par défaut si aucun centre ne propose de matières
const DEFAULT_SUBJECTS = [
  "Mathématiques",
  "Physique",
  "Chimie",
  "Français",
  "Anglais",
];

/**
 * TutorCenter
 * -----------
 * Page "Mon Centre" pour tuteur.
 *
 * Données issues de la BD :
 * - Si le tuteur est membre / propriétaire d’un centre : affiche les infos du centre.
 * - Sinon : affiche la liste des centres disponibles (discover) et permet de créer son propre centre.
 */
export const TutorCenter = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const { organizations, fetchOrganizations, createOrganization } = useOrganizationsStore();

  const [filters, setFilters] = useState({ city: "", subject: "" });
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [centerDetailOpen, setCenterDetailOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCenterName, setNewCenterName] = useState("");
  const [newCenterCity, setNewCenterCity] = useState("");
  const [newCenterDescription, setNewCenterDescription] = useState("");
  const [availableCenters, setAvailableCenters] = useState([]);
  const [isLoadingCenters, setIsLoadingCenters] = useState(false);

  // Charger les organisations du tuteur depuis la BD
  useEffect(() => {
    fetchOrganizations?.();
  }, [fetchOrganizations]);

  // Centre actif du tuteur (propriétaire ou membre accepté)
  const tutorCenter = useMemo(() => {
    if (!user) return null;
    const activeOrgId = user.activeOrganizationId;
    if (activeOrgId) {
      return (organizations || []).find(
        (org) => String(org.id) === String(activeOrgId)
      ) || null;
    }
    // Fallback : premier centre auquel le tuteur a accès
    return (organizations || [])[0] || null;
  }, [user, organizations]);

  // Charger les centres disponibles (découverte) pour "Rejoindre un centre"
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setIsLoadingCenters(true);
        const { organizationService } = await import("../../../services");
        const data = await organizationService.discover({
          city: filters.city || undefined,
        });
        if (!isMounted) return;
        setAvailableCenters(Array.isArray(data) ? data : []);
      } catch {
        if (!isMounted) return;
        setAvailableCenters([]);
      } finally {
        if (!isMounted) return;
        setIsLoadingCenters(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [filters.city]);

  // Liste des villes uniques pour le filtre
  const cities = useMemo(
    () => [...new Set(availableCenters.map((c) => c.city).filter(Boolean))].sort(),
    [availableCenters]
  );

  // Liste des matières uniques provenant des centres,
  // avec fallback sur une liste fixe si aucune matière disponible
  const subjects = useMemo(() => {
    const fromCenters = [
      ...new Set(
        availableCenters
          .flatMap((c) => (Array.isArray(c.subjects) ? c.subjects : []))
          .filter(Boolean)
      ),
    ].sort();

    return fromCenters.length > 0 ? fromCenters : DEFAULT_SUBJECTS;
  }, [availableCenters]);

  const handleCenterClick = (center) => {
    setSelectedCenter(center);
    setCenterDetailOpen(true);
  };

  const handleCreateCenter = async (e) => {
    e.preventDefault();
    if (!newCenterName.trim()) return;

    const result = await createOrganization({
      name: newCenterName.trim(),
      city: newCenterCity.trim() || null,
      description: newCenterDescription.trim() || "",
    });

    if (!result?.error) {
      setCreating(false);
      setNewCenterName("");
      setNewCenterCity("");
      setNewCenterDescription("");
      fetchOrganizations?.();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark">
        {tutorCenter ? t("tutor.myCenter", "Mon centre") : t("tutor.findCenter", "Trouver un centre")}
      </h1>

      {/* Cas 1 : Tutor a un centre (depuis la BD) */}
      {tutorCenter && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Infos du centre */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-dark mb-2">
                  {tutorCenter.name}
                </h2>
                <p className="text-dark/60 mb-1">
                  {tutorCenter.city || t("center.noCity", "Ville non renseignée")}
                </p>
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
                {tutorCenter.description && (
                  <p className="text-sm text-dark/70 mt-3">
                    {tutorCenter.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Cas 2 : Tutor n'a pas de centre */}
      {!tutorCenter && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Bande d'information + création de centre */}
          <div className="bg-white rounded-lg p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-dark">
                {t("tutor.noCenterTitle", "Vous n'êtes encore rattaché à aucun centre.")}
              </p>
              <p className="text-xs text-dark/60">
                {t("tutor.noCenterSubtitle", "Créez votre propre centre ou rejoignez un centre existant.")}
              </p>
            </div>
            <button
              type="button"
              className="text-sm text-primary underline"
              onClick={() => setCreating((v) => !v)}
            >
              {t("tutor.createCenter", "Créer mon centre")}
            </button>
          </div>

          {creating && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-dark mb-3">
                {t("tutor.createCenterFormTitle", "Créer un centre de A à Z")}
              </h2>
              <form className="space-y-3" onSubmit={handleCreateCenter}>
                <div>
                  <label className="block text-xs text-dark/60 mb-1">
                    {t("center.name", "Nom du centre")} *
                  </label>
                  <input
                    type="text"
                    value={newCenterName}
                    onChange={(e) => setNewCenterName(e.target.value)}
                    className="w-full border border-black/20 rounded px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-dark/60 mb-1">
                    {t("center.city", "Ville")}
                  </label>
                  <input
                    type="text"
                    value={newCenterCity}
                    onChange={(e) => setNewCenterCity(e.target.value)}
                    className="w-full border border-black/20 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-dark/60 mb-1">
                    {t("center.description", "Description")}
                  </label>
                  <textarea
                    value={newCenterDescription}
                    onChange={(e) => setNewCenterDescription(e.target.value)}
                    rows={3}
                    className="w-full border border-black/20 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="text-sm text-dark/60"
                    onClick={() => setCreating(false)}
                  >
                    {t("common.cancel", "Annuler")}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm rounded bg-primary text-white hover:bg-primary/90"
                  >
                    {t("tutor.saveCenter", "Enregistrer le centre")}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filtres pour découverte des centres */}
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
            {availableCenters.map((center) => (
              <div key={center.id} onClick={() => handleCenterClick(center)}>
                <CenterCard center={center} />
              </div>
            ))}
          </div>

          {!isLoadingCenters && availableCenters.length === 0 && (
            <p className="text-dark/60 text-center py-8">
              {t("tutor.noCentersAvailable", "Aucun centre disponible")}
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
