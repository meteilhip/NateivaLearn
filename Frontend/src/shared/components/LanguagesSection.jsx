import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export const LanguagesSection = ({ languages = [], onChange }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const commonLanguages = [
    "Français",
    "Anglais",
    "Espagnol",
    "Allemand",
    "Portugais",
    "Arabe",
    "Italien",
    "Chinois",
    "Russe",
  ];

  const handleAddLanguage = (lang) => {
    if (!onChange) return;
    if (lang && !languages.includes(lang)) {
      onChange([...languages, lang]);
    }
  };

  const handleRemoveLanguage = (langToRemove) => {
    if (!onChange) return;
    onChange(languages.filter((l) => l !== langToRemove));
  };

  const filteredCommonLanguages = commonLanguages
    .filter((l) => !languages.includes(l))
    .filter((l) => l.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-semibold text-dark/60 uppercase tracking-wider">
          {t("centerOwner.requiredLanguages")}
        </label>
        <p className="text-xs text-dark/50">
          {t("signup.centerRequiredLanguagesDescription")}
        </p>
        <div className="max-w-xs mt-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("signup.searchLanguage", "Rechercher une langue...")}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {languages.map((lang) => (
            <motion.div
              key={lang}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
            >
              <span>{lang}</span>
              {onChange && (
                <button
                  type="button"
                  onClick={() => handleRemoveLanguage(lang)}
                  className="text-primary hover:text-primary/70"
                >
                  <FaTimes size={12} />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {onChange && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {filteredCommonLanguages.slice(0, 8).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => handleAddLanguage(lang)}
                className="px-3 py-1 bg-gray-100 text-dark rounded-full text-sm hover:bg-gray-200 transition"
              >
                + {lang}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

