// src/auth/pages/Step4CenterSetup.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MdBusiness } from "react-icons/md";
import { Button } from "../../shared/ui/Button";

/**
 * Step4CenterSetup
 * ----------------
 * 👑 Uniquement pour role = center_owner (après Step3Role).
 * Formulaire : nom du centre, description, logo (mock), pays, langues proposées.
 * À la validation : création Organization + Membership(owner) + User avec activeOrganizationId.
 * Tout est mocké (store). Backend : endpoint create organization plus tard.
 */
export default function Step4CenterSetup({ data, setData, onBack, onSubmit }) {
  const { t } = useTranslation();
  const [centerName, setCenterName] = useState(data.centerName || "");
  const [description, setDescription] = useState(data.centerDescription || "");
  const [country, setCountry] = useState(data.centerCountry || "");
  const [languages, setLanguages] = useState(data.centerLanguages || []);

  const languageOptions = ["Français", "Anglais", "Espagnol", "Arabe"];

  const toggleLanguage = (lang) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleSubmit = () => {
    if (!centerName.trim()) return;
    const centerData = {
      centerName: centerName.trim(),
      centerDescription: description.trim(),
      centerCountry: country.trim(),
      centerLanguages: languages,
      centerLogo: null,
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

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">{t("signup.centerName")}</label>
          <input
            type="text"
            value={centerName}
            onChange={(e) => setCenterName(e.target.value)}
            placeholder={t("signup.centerNamePlaceholder")}
            className="w-full border border-black/20 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">{t("signup.centerDescription")}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("signup.centerDescriptionPlaceholder")}
            rows={3}
            className="w-full border border-black/20 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">{t("signup.centerLogo")}</label>
          <p className="text-xs text-black/50">{t("signup.centerLogoMock")}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">{t("signup.centerCountry")}</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder={t("signup.centerCountryPlaceholder")}
            className="w-full border border-black/20 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-2">{t("signup.centerLanguages")}</label>
          <div className="flex flex-wrap gap-2">
            {languageOptions.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLanguage(lang)}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  languages.includes(lang)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-black/20 text-black/70"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
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
