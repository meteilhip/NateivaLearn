import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "../../shared/ui/Button";
import { MdSchool } from "react-icons/md";

/**
 * Step4Level
 * Étape 4 : choix du niveau scolaire
 * 🔹 Bouton "Ignorer" ajouté pour passer directement au dashboard
 */
export default function Step4Level({ data, setData, onNext, onBack, onSkip }) {
  const { t } = useTranslation();

  const levels = [
    "Débutant",
    "Intermédiaire",
    "Avancé",
  ];

  return (
    <motion.div
      key="step4-level"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Titre */}
      <h1 className="text-3xl font-bold flex items-center gap-3">
        {t("signup.chooseLevel")}
        <MdSchool className="text-primary" size={32} />
      </h1>

      {/* Explication */}
      <p className="text-black/70">{t("signup.chooseLevelInfo")}</p>

      {/* Liste des niveaux */}
      <div className="flex flex-col gap-4 max-h-[45vh] overflow-y-auto scrollbar-hide pr-2">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => setData({ ...data, level })}
            className={`p-4 border rounded text-left transition ${
              data.level === level ? "border-primary bg-primary/10" : "border-black/20 hover:bg-black/5"
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Navigation + bouton ignorer */}
      <div className="flex justify-between gap-2">
        <Button variant="outline" onClick={onBack} className="rounded">
          ← {t("signup.back")}
        </Button>

        <div className="flex gap-2">
          <Button onClick={onNext} disabled={!data.level} className="rounded">
            {t("signup.continue")}
          </Button>

          {/* Bouton ignorer, pour passer au dashboard */}
          <Button onClick={onSkip} className="rounded" variant="outline" disabled={!data.role}>
            {t("signup.skip")}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
