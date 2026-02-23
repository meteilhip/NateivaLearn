// src/auth/pages/Step6Centers.jsx
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import centers from "../../data/centers";
import { CenterCard } from "../../shared/components/CenterCard";
import { Button } from "../../shared/ui/Button";

// Icône centre / établissement
import { HiOutlineOfficeBuilding } from "react-icons/hi";

/**
 * Step6Centers
 * Étape 6 du signup : choix du centre
 *
 * Correctifs apportés :
 * - Container scrollable (max-h + overflow-y-auto)
 * - Padding interne pour éviter que le ring soit coupé
 * - ring-offset pour un rendu propre
 */
export default function Step6Centers({ data, setData, onNext, onBack }) {
  const { t } = useTranslation();

  /**
   * Centres compatibles avec les matières sélectionnées
   */
  const compatibleCenters = centers.filter((center) =>
    center.subjects.some((s) => data.subjects.includes(s.name))
  );

  return (
    <motion.div
      key="step-6"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Titre avec icône */}
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <HiOutlineOfficeBuilding className="text-primary" size={32} />
        {t("signup.chooseCenter")}
      </h1>

      {/* Texte explicatif */}
      <p className="text-black/70">
        {t("signup.chooseCenterInfo")}
      </p>

      {/*
        Container scrollable des centres
        - max-h limite la hauteur
        - overflow-y-auto active le scroll
        - p-2 empêche le ring d'être coupé
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
        {compatibleCenters.map((center) => {
          const isSelected = data.center?.id === center.id;

          return (
            <div
              key={center.id}
              onClick={() => setData({ ...data, center })}
              className={`
                cursor-pointer 
                transition
                overflow-visible
                rounded
                ${
                  isSelected
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-white"
                    : "hover:scale-[1.01]"
                }
              `}
            >
              <CenterCard center={center} />
            </div>
          );
        })}
      </div>

      {/* Boutons de navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          className="rounded"
          onClick={onBack}
        >
          ← {t("signup.back")}
        </Button>

        <Button
          className="rounded"
          onClick={onNext}
          disabled={!data.center}
        >
          {t("signup.subscribe")}
        </Button>
      </div>
    </motion.div>
  );
}
