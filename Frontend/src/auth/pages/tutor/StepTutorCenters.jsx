import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "../../../shared/ui/Button";
import { CenterCard } from "../../../shared/components/CenterCard";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { toast } from "react-toastify";
import { useOrganizationsStore } from "../../../app/store/organizations.store";

/** StepTutorCenters – Étape optionnelle : proposer des centres en fonction des matières enseignées */
export default function StepTutorCenters({ data, setData, onNext, onBack, onSkip }) {
  const { t } = useTranslation();
  const { organizations, fetchOrganizations } = useOrganizationsStore();

  // Charger les centres réels depuis l'API
  useEffect(() => {
    fetchOrganizations?.();
  }, [fetchOrganizations]);

  const tutorSubjects = (data.tutorSubjects ?? []).map((s) => s.toLowerCase());

  const centers = useMemo(() => organizations || [], [organizations]);

  const filteredCenters = useMemo(() => {
    if (!Array.isArray(centers) || centers.length === 0) return [];
    if (tutorSubjects.length === 0) return centers;

    return centers.filter((center) => {
      const centerSubjects = (center.subjects || []).map((subject) => {
        if (typeof subject === "string") return subject.toLowerCase();
        return (subject.name ?? "").toLowerCase();
      });
      return centerSubjects.some((name) => tutorSubjects.includes(name));
    });
  }, [centers, tutorSubjects]);

  const handleSelectCenter = (center) => {
    setData((prev) => ({
      ...prev,
      tutorCenter: center,
    }));
  };

  const handleNext = () => {
    if (!data.tutorCenter) {
      toast.info("Vous pouvez aussi ignorer cette étape");
      return;
    }
    onNext();
  };

  const handleSkip = () => {
    setData((prev) => ({
      ...prev,
      tutorCenter: null,
    }));
    onSkip();
  };

  return (
    <motion.div
      key="step-tutor-centers"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold flex items_center gap-3">
        <HiOutlineOfficeBuilding className="text-primary" size={32} />
        Rejoindre un centre
      </h1>

      <p className="text-black/70">
        {tutorSubjects.length > 0
          ? `Nous vous suggérons des centres qui proposent au moins une de vos matières : ${data.tutorSubjects.join(
              ", "
            )}.`
          : "Vous pouvez demander à rejoindre un centre pour collaborer avec d'autres tuteurs. Cette étape est facultative."}
      </p>

      {filteredCenters.length === 0 && tutorSubjects.length > 0 && (
        <p className="text-sm text-red-600">
          Aucun centre ne correspond encore à vos matières. Vous pouvez ignorer cette étape et créer votre propre centre plus tard.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
        {filteredCenters.map((center) => {
          const isSelected = data.tutorCenter?.id === center.id;

          return (
            <div
              key={center.id}
              onClick={() => handleSelectCenter(center)}
              className={`
                cursor-pointer
                transition
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

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="rounded">
          ← {t("signup.back")}
        </Button>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="rounded"
          >
            Ignorer
          </Button>

          <Button
            onClick={handleNext}
            className="rounded"
            disabled={!data.tutorCenter}
          >
            Continuer
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
