/**
 * Step4CenterSetup
 * ----------------
 * Étape signup réservée au rôle center_owner (après Step3Role).
 * Formulaire : nom, description, logo (image représentative), pays,
 * langues exigées (scrollable), matières proposées (optionnel, scrollable).
 * Données envoyées au backend et stockées en base (organizations).
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MdBusiness, MdImage, MdClose } from "react-icons/md";
import { Button } from "../../shared/ui/Button";
import { ScrollableChipsSelect } from "../../shared/components/ScrollableChipsSelect";

// Liste étendue de langues pour « Langues exigées » (conteneur scrollable)
const LANGUAGES_OPTIONS = [
  "Français",
  "Anglais",
  "Espagnol",
  "Arabe",
  "Mandarin",
  "Portugais",
  "Russe",
  "Allemand",
  "Italien",
  "Japonais",
  "Hindou",
  "Néerlandais",
  "Polonais",
  "Turc",
  "Vietnamien",
  "Coréen",
  "Swahili",
  "Hausa",
  "Wolof",
  "Lingala",
  "Fon",
  "Bassa",
  "Douala",
  "Autre",
];

// Matières proposées par le centre (tuteurs attendus sur ces matières)
const CENTER_SUBJECTS_OPTIONS = [
  "Mathématiques",
  "Physique",
  "Chimie",
  "SVT",
  "Français",
  "Anglais",
  "Espagnol",
  "Allemand",
  "Histoire",
  "Géographie",
  "Philosophie",
  "Méthodologie",
  "Sciences économiques",
  "Informatique",
  "Arts",
  "Musique",
  "Sport",
  "Autre",
];

export default function Step4CenterSetup({ data, setData, onBack, onSubmit }) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const [centerName, setCenterName] = useState(data.centerName || "");
  const [description, setDescription] = useState(data.centerDescription || "");
  const [country, setCountry] = useState(data.centerCountry || "");
  const [logo, setLogo] = useState(data.centerLogo || null);
  const [requiredLanguages, setRequiredLanguages] = useState(data.centerRequiredLanguages || []);
  const [subjects, setSubjects] = useState(data.centerSubjects || []);
  const [ownerLanguages, setOwnerLanguages] = useState(data.ownerLanguages || []);

  /** Envoi du fichier image : lecture en base64 (data URL) pour envoi au backend */
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result);
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!centerName.trim()) return;
    const centerData = {
      centerName: centerName.trim(),
      centerDescription: description.trim(),
      centerCountry: country.trim(),
      centerLogo: logo,
      centerRequiredLanguages: requiredLanguages,
      centerSubjects: subjects,
      ownerLanguages,
    };
    setData({ ...data, ...centerData });
    onSubmit(centerData);
  };

  return (
    <motion.div
      key="step-4-center"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold flex items-center gap-3">
        {t("signup.createCenter")}
        <MdBusiness className="text-primary" size={32} />
      </h1>
      <p className="text-black/70 text-lg">{t("signup.createCenterInfo")}</p>

      <div className="space-y-5">
        {/* Nom du centre */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1">{t("signup.centerName")}</label>
          <input
            type="text"
            value={centerName}
            onChange={(e) => setCenterName(e.target.value)}
            placeholder={t("signup.centerNamePlaceholder")}
            className="w-full border border-black/20 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1">{t("signup.centerDescription")}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("signup.centerDescriptionPlaceholder")}
            rows={3}
            className="w-full border border-black/20 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        {/* Logo / image représentative */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="space-y-2"
        >
          <label className="block text-sm font-medium text-dark">{t("signup.centerLogo")}</label>
          <p className="text-xs text-dark/60">{t("signup.centerLogoDescription")}</p>
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
                    aria-label={t("signup.centerLogoRemove")}
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
                  <span className="text-xs font-medium">{t("signup.centerLogoChange")}</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Pays */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1">{t("signup.centerCountry")}</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder={t("signup.centerCountryPlaceholder")}
            className="w-full border border-black/20 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Langues exigées — conteneur scrollable */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <ScrollableChipsSelect
            label={t("signup.centerRequiredLanguages")}
            description={t("signup.centerRequiredLanguagesDescription")}
            options={LANGUAGES_OPTIONS}
            selected={requiredLanguages}
            onChange={setRequiredLanguages}
            maxHeight="12rem"
          />
        </motion.div>

        {/* Langues parlées par le propriétaire */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
        >
          <ScrollableChipsSelect
            label={t("tutor.languages")}
            description={t("signup.ownerLanguagesDescription", "Sélectionnez les langues que vous parlez en tant que tuteur du centre.")}
            options={LANGUAGES_OPTIONS}
            selected={ownerLanguages}
            onChange={setOwnerLanguages}
            maxHeight="10rem"
          />
        </motion.div>

        {/* Matières que le centre propose (optionnel) — conteneur scrollable */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <ScrollableChipsSelect
            label={t("signup.centerSubjects")}
            description={t("signup.centerSubjectsDescription")}
            options={CENTER_SUBJECTS_OPTIONS}
            selected={subjects}
            onChange={setSubjects}
            maxHeight="10rem"
          />
        </motion.div>
      </div>

      <div className="flex justify-between mt-6">
        <Button onClick={onBack} variant="outline" className="rounded">
          ← {t("signup.back")}
        </Button>
        <Button onClick={handleSubmit} className="rounded" disabled={!centerName.trim()}>
          {t("signup.finish")}
        </Button>
      </div>
    </motion.div>
  );
}
