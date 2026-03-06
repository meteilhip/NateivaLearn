import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "../../../shared/ui/Button";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { GiWorld } from "react-icons/gi";
import { FiSearch, FiPlus } from "react-icons/fi";
import { Input } from "../../../shared/ui/Input";

// Liste étendue de langues proposées par défaut
const BASE_LANGUAGES = [
  "Français",
  "Anglais",
  "Espagnol",
  "Allemand",
  "Portugais",
  "Italien",
  "Arabe",
  "Chinois",
  "Japonais",
  "Russe",
];

/** Étape : langues parlées par le tuteur (avec recherche + ajout) */
export default function StepTutorLanguages({ data, setData, onNext, onBack, onSkip }) {
  const { t } = useTranslation();
  const [selectedLanguages, setSelectedLanguages] = useState(data.tutorLanguages ?? []);
  const [query, setQuery] = useState("");
  const [availableLanguages, setAvailableLanguages] = useState(() =>
    Array.from(new Set([...(data.tutorLanguages ?? []), ...BASE_LANGUAGES]))
  );

  useEffect(() => {
    setSelectedLanguages(data.tutorLanguages ?? []);
  }, [data.tutorLanguages]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredLanguages = useMemo(() => {
    if (!normalizedQuery) return availableLanguages;
    return availableLanguages.filter((lang) =>
      lang.toLowerCase().includes(normalizedQuery)
    );
  }, [availableLanguages, normalizedQuery]);

  const canAddLanguage =
    normalizedQuery.length > 0 &&
    !availableLanguages.some((l) => l.toLowerCase() === normalizedQuery);

  const toggleLanguage = (lang) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleAddLanguage = () => {
    if (!normalizedQuery) return;
    const label = query.trim();
    setAvailableLanguages((prev) => [...prev, label]);
    setSelectedLanguages((prev) => [...prev, label]);
    setData((prev) => ({
      ...prev,
      tutorLanguages: [...new Set([...(prev.tutorLanguages ?? []), label])],
    }));
    setQuery("");
    toast.success("Langue ajoutée !");
  };

  const handleNext = () => {
    if (!selectedLanguages.length) {
      return toast.error(t("signup.errorLanguage"));
    }
    setData({ ...data, tutorLanguages: selectedLanguages });
    onNext();
  };

  return (
    <motion.div
      key="step-tutor-languages"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold flex items-center gap-3">
        {"Quelles langues parlez-vous ?"}
        <GiWorld className="text-primary" size={32} />
      </h1>

      <p className="text-black/70 text-lg">
        Vous pouvez sélectionner une ou plusieurs langues que vous maîtrisez pour enseigner.
      </p>

      {/* Barre de recherche / ajout */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Rechercher une langue..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            icon={FiSearch}
          />
        </div>
        {canAddLanguage && (
          <Button
            type="button"
            onClick={handleAddLanguage}
            className="rounded flex items-center gap-2 whitespace-nowrap"
            variant="outline"
          >
            <FiPlus />
            Ajouter « {query.trim()} »
          </Button>
        )}
      </div>

      {/* Liste des langues filtrées */}
      <div className="flex flex-wrap gap-3">
        {filteredLanguages.map((lang) => {
          const isSelected = selectedLanguages.includes(lang);
          return (
            <button
              key={lang}
              type="button"
              onClick={() => toggleLanguage(lang)}
              className={`px-4 py-2 rounded-lg border text-sm sm:text-base transition ${
                isSelected
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-dark border-gray-300 hover:bg-primary/10"
              }`}
            >
              {lang}
            </button>
          );
        })}
        {filteredLanguages.length === 0 && !canAddLanguage && (
          <p className="text-sm text-black/60">
            Aucune langue trouvée. Essayez un autre terme ou ajoutez la vôtre.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack} className="rounded">
            ← {t("signup.back")}
          </Button>
          <Button onClick={handleNext} className="rounded">
            {t("signup.continue")}
          </Button>
        </div>
        {onSkip && (
          <Button variant="outline" onClick={onSkip} className="rounded w-full text-black/60">
            {t("signup.skip")}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
