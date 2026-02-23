import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../../../shared/ui/Button";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { GiWorld } from "react-icons/gi";

/** Étape : langues parlées par le tuteur */
export default function StepTutorLanguages({ data, setData, onNext, onBack }) {
  const { t } = useTranslation();
  const availableLanguages = ["Français", "Anglais", "Espagnol", "Allemand"];

  const [selectedLanguages, setSelectedLanguages] = useState(data.tutorLanguages ?? []);

  useEffect(() => {
    setSelectedLanguages(data.tutorLanguages ?? []);
  }, [data.tutorLanguages]);

  const toggleLanguage = (lang) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
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
        Vous pouvez selectionner une ou plusieurs langue vous parlez
      </p>

      <div className="flex flex-wrap gap-3">
        {availableLanguages.map((lang) => {
          const isSelected = selectedLanguages.includes(lang);
          return (
            <button
              key={lang}
              type="button"
              onClick={() => toggleLanguage(lang)}
              className={`px-4 py-2 rounded-lg border transition ${
                isSelected
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-dark border-gray-300 hover:bg-primary/10"
              }`}
            >
              {lang}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack} className="rounded">
          ← {t("signup.back")}
        </Button>
        <Button onClick={handleNext} className="rounded">
          {t("signup.continue")}
        </Button>
      </div>
    </motion.div>
  );
}
