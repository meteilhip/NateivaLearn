import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../../../shared/ui/Button";
import { useTranslation } from "react-i18next";
import { GiTeacher } from "react-icons/gi";
import { toast } from "react-toastify";

/** Étape Tutor – Sélection des matières enseignées */
export default function StepTutorSubjects({ data, setData, onNext, onBack }) {
  const { t } = useTranslation();

  const availableSubjects = [
    "Mathématiques",
    "Physique",
    "Chimie",
    "Biologie",
    "Informatique",
    "Français",
    "Anglais",
  ];

  const [selectedSubjects, setSelectedSubjects] = useState(data.tutorSubjects ?? []);

  useEffect(() => {
    setSelectedSubjects(data.tutorSubjects ?? []);
  }, [data.tutorSubjects]);

  const toggleSubject = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleNext = () => {
    if (!selectedSubjects.length) {
      return toast.error(t("signup.errorSubject"));
    }
    const newData = { ...data, tutorSubjects: selectedSubjects };
    setData(newData);
    onNext(newData);
  };

  return (
    <motion.div
      key="step-tutor-subjects"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold flex items-center gap-3">
        {t("signup.teacherSubjectsTitle")}
        <GiTeacher className="text-primary" size={32} />
      </h1>

      <p className="text-black/70 text-lg">
        {t("signup.teacherSubjectsInfo")}
      </p>

      <div className="flex flex-wrap gap-3">
        {availableSubjects.map((subject) => {
          const isSelected = selectedSubjects.includes(subject);
          return (
            <button
              key={subject}
              type="button"
              onClick={() => toggleSubject(subject)}
              className={`px-4 py-2 rounded-lg border transition ${
                isSelected
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-gray-300 hover:bg-primary/10"
              }`}
            >
              {subject}
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
