// src/roles/tutor/pages/TutorCenter.jsx
import { useEffect, useState, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdBusiness, MdImage, MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../app/store/auth.store";
import { useOrganizationsStore } from "../../../app/store/organizations.store";
import { CenterCard } from "../../../shared/components/CenterCard";
import { CenterDetailModal } from "../../../shared/components/CenterDetailModal";
import { ScrollableChipsSelect } from "../../../shared/components/ScrollableChipsSelect";

// Matières par défaut si aucun centre ne propose de matières
const DEFAULT_SUBJECTS = [
  "Mathématiques",
  "Physique",
  "Chimie",
  "Français",
  "Anglais",
];

// Langues exigées (aligné Step4CenterSetup)
const LANGUAGES_OPTIONS = [
  "Français", "Anglais", "Espagnol", "Arabe", "Mandarin", "Portugais", "Russe",
  "Allemand", "Italien", "Japonais", "Hindou", "Néerlandais", "Polonais", "Turc",
  "Vietnamien", "Coréen", "Swahili", "Hausa", "Wolof", "Lingala", "Fon", "Bassa", "Douala", "Autre",
];

// Matières proposées par le centre (aligné Step4CenterSetup)
const CENTER_SUBJECTS_OPTIONS = [
  "Mathématiques", "Physique", "Chimie", "SVT", "Français", "Anglais", "Espagnol", "Allemand",
  "Histoire", "Géographie", "Philosophie", "Méthodologie", "Sciences économiques", "Informatique",
  "Arts", "Musique", "Sport", "Autre",
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

  const navigate = useNavigate();
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const [filters, setFilters] = useState({ city: "", country: "", subject: "" });
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [centerDetailOpen, setCenterDetailOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [centerName, setCenterName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState(null);
  const [centerCity, setCenterCity] = useState("");
  const [country, setCountry] = useState("");
  const [requiredLanguages, setRequiredLanguages] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const fileInputRef = useRef(null);
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
          country: filters.country || undefined,
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
  }, [filters.city, filters.country]);

  // Fusion discover + organisations du tuteur pour afficher tous les centres (dont ceux qu'il a créés)
  const centersToShow = useMemo(() => {
    const byId = new Map();
    (availableCenters || []).forEach((c) => byId.set(String(c.id), c));
    (organizations || []).forEach((o) => byId.set(String(o.id), o));
    return Array.from(byId.values());
  }, [availableCenters, organizations]);

  // Liste des villes uniques pour le filtre
  const cities = useMemo(
    () => [...new Set(centersToShow.map((c) => c.city).filter(Boolean))].sort(),
    [centersToShow]
  );

  const countries = useMemo(
    () => [...new Set(centersToShow.map((c) => c.country).filter(Boolean))].sort(),
    [centersToShow]
  );

  // Liste des matières uniques pour le filtre (provenant des centres)
  const subjectFilterOptions = useMemo(() => {
    const fromCenters = [
      ...new Set(
        centersToShow
          .flatMap((c) => (Array.isArray(c.subjects) ? c.subjects : []).map((s) => (typeof s === "string" ? s : s?.name ?? s)))
          .filter(Boolean)
      ),
    ].sort();

    return fromCenters.length > 0 ? fromCenters : DEFAULT_SUBJECTS;
  }, [centersToShow]);

  const filteredCentersToShow = useMemo(() => {
    let list = centersToShow;
    if (filters.city) {
      list = list.filter((c) => c.city === filters.city);
    }
    if (filters.country) {
      list = list.filter((c) => c.country === filters.country);
    }
    if (filters.subject) {
      list = list.filter((c) => {
        const orgSubjects = (Array.isArray(c.subjects) ? c.subjects : []).map((s) => (typeof s === "string" ? s : s?.name ?? s));
        return orgSubjects.includes(filters.subject);
      });
    }
    return list;
  }, [centersToShow, filters.subject, filters.city, filters.country]);

  const handleCenterClick = (center) => {
    setSelectedCenter(center);
    setCenterDetailOpen(true);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result);
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCreateCenter = async (e) => {
    e.preventDefault();
    if (!centerName.trim()) {
      toast.error(t("center.nameRequired", "Le nom du centre est obligatoire"));
      return;
    }
    setSubmitLoading(true);
    const result = await createOrganization({
      name: centerName.trim(),
      description: description.trim() || "",
      logo: logo || null,
      city: centerCity.trim() || null,
      country: country.trim() || null,
      languages: requiredLanguages,
      subjects,
    });
    setSubmitLoading(false);

    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success(t("tutor.centerCreated", "Centre créé avec succès"));
    try {
      await fetchUser();
    } catch (_) {}
    fetchOrganizations?.();
    navigate("/center_owner/dashboard", { replace: true });
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
                  {[tutorCenter.city, tutorCenter.country].filter(Boolean).join(", ") || t("center.noCity", "Ville non renseignée")}
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
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6 space-y-5"
            >
              <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                {t("signup.createCenter", "Créer mon centre")}
                <MdBusiness className="text-primary" size={28} />
              </h2>
              <p className="text-dark/70 text-sm">
                {t("signup.createCenterInfo", "Renseignez les informations de votre centre. Vous serez redirigé vers l’espace propriétaire après la création.")}
              </p>
              <form className="space-y-5" onSubmit={handleCreateCenter}>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">{t("signup.centerName", "Nom du centre")} *</label>
                  <input
                    type="text"
                    value={centerName}
                    onChange={(e) => setCenterName(e.target.value)}
                    placeholder={t("signup.centerNamePlaceholder", "Ex. Centre Excellence")}
                    className="w-full border border-black/20 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">{t("signup.centerDescription", "Description")}</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("signup.centerDescriptionPlaceholder", "Décrivez votre centre…")}
                    rows={3}
                    className="w-full border border-black/20 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-dark">{t("signup.centerLogo", "Logo / image")}</label>
                  <p className="text-xs text-dark/60">{t("signup.centerLogoDescription", "Image représentative du centre (optionnel)")}</p>
                  <div className="flex items-start gap-4 flex-wrap">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                    <AnimatePresence mode="wait">
                      {logo ? (
                        <motion.div
                          key="preview"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="relative"
                        >
                          <img
                            src={logo}
                            alt="Logo du centre"
                            className="w-28 h-28 object-cover rounded-xl border-2 border-black/10 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={removeLogo}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition shadow"
                            aria-label={t("signup.centerLogoRemove", "Supprimer le logo")}
                          >
                            <MdClose size={18} />
                          </button>
                        </motion.div>
                      ) : (
                        <motion.button
                          key="upload"
                          type="button"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => fileInputRef.current?.click()}
                          className="w-28 h-28 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/20 text-dark/60 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200"
                        >
                          <MdImage size={32} />
                          <span className="text-xs font-medium">{t("signup.centerLogoChange", "Choisir une image")}</span>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">{t("signup.city", "Ville")}</label>
                  <input
                    type="text"
                    value={centerCity}
                    onChange={(e) => setCenterCity(e.target.value)}
                    placeholder={t("signup.centerCityPlaceholder", "Ex. Yaoundé")}
                    className="w-full border border-black/20 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">{t("signup.centerCountry", "Pays")}</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder={t("signup.centerCountryPlaceholder", "Ex. Cameroun")}
                    className="w-full border border-black/20 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
                <ScrollableChipsSelect
                  label={t("signup.centerRequiredLanguages", "Langues exigées")}
                  description={t("signup.centerRequiredLanguagesDescription", "Langues requises pour les tuteurs du centre")}
                  options={LANGUAGES_OPTIONS}
                  selected={requiredLanguages}
                  onChange={setRequiredLanguages}
                  maxHeight="12rem"
                />
                <ScrollableChipsSelect
                  label={t("signup.centerSubjects", "Matières proposées")}
                  description={t("signup.centerSubjectsDescription", "Matières que le centre propose")}
                  options={CENTER_SUBJECTS_OPTIONS}
                  selected={subjects}
                  onChange={setSubjects}
                  maxHeight="10rem"
                />
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm rounded border border-black/20 text-dark hover:bg-black/5"
                    onClick={() => setCreating(false)}
                    disabled={submitLoading}
                  >
                    {t("common.cancel", "Annuler")}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm rounded bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
                    disabled={submitLoading || !centerName.trim()}
                  >
                    {submitLoading ? t("common.loading", "Création…") : t("signup.finish", "Créer le centre")}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

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
                {subjectFilterOptions.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Liste des centres */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCentersToShow.map((center) => (
              <div key={center.id} onClick={() => handleCenterClick(center)}>
                <CenterCard center={center} />
              </div>
            ))}
          </div>

          {!isLoadingCenters && filteredCentersToShow.length === 0 && (
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
