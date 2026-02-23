import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "../../../shared/ui/Button";
import centers from "../../../data/centers";
import { CenterCard } from "../../../shared/components/CenterCard";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { toast } from "react-toastify";

/** StepTutorCenters – Étape optionnelle : rejoindre un centre */
export default function StepTutorCenters({ data, setData, onNext, onBack, onSkip }) {
  const { t } = useTranslation();

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
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <HiOutlineOfficeBuilding className="text-primary" size={32} />
        Rejoindre un centre
      </h1>

      <p className="text-black/70">
        Vous pouvez demander à rejoindre un centre pour collaborer avec
        d'autres tuteurs. Cette étape est facultative.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
        {centers.map((center) => {
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
