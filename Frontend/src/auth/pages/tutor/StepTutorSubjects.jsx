import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "../../../shared/ui/Button";
import { useTranslation } from "react-i18next";
import { GiTeacher } from "react-icons/gi";
import { toast } from "react-toastify";
import { FiSearch, FiPlus } from "react-icons/fi";
import { Input } from "../../../shared/ui/Input";

// Liste élargie de matières proposées par défaut
const BASE_SUBJECTS = [
  "Mathématiques",
  "Physique",
  "Chimie",
  "Biologie",
  "Informatique",
  "Français",
  "Anglais",
  "Histoire",
  "Géographie",
  "Philosophie",
  "Statistiques",
  "Économie",
];

/** Étape Tutor – Sélection des matières enseignées (recherche + ajout) */
export default function StepTutorSubjects({ data, setData, onNext, onBack, onSkip }) {
  const { t } = useTranslation();

  const [selectedSubjects, setSelectedSubjects] = useState(data.tutorSubjects ?? []);
  const [query, setQuery] = useState("");
  const [availableSubjects, setAvailableSubjects] = useState(() =>
    Array.from(new Set([...(data.tutorSubjects ?? []), ...BASE_SUBJECTS]))
  );

  useEffect(() => {
    setSelectedSubjects(data.tutorSubjects ?? []);
  }, [data.tutorSubjects]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredSubjects = useMemo(() => {
    if (!normalizedQuery) return availableSubjects;
    return availableSubjects.filter((subject) =>
      subject.toLowerCase().includes(normalizedQuery)
    );
  }, [availableSubjects, normalizedQuery]);

  const canAddSubject =
    normalizedQuery.length > 0 &&
    !availableSubjects.some((s) => s.toLowerCase() === normalizedQuery);

  const toggleSubject = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleAddSubject = () => {
    if (!normalizedQuery) return;
    const label = query.trim();
    setAvailableSubjects((prev) => [...prev, label]);
    setSelectedSubjects((prev) => [...prev, label]);
    setData((prev) => ({
      ...prev,
      tutorSubjects: [...new Set([...(prev.tutorSubjects ?? []), label])],
    }));
    setQuery("");
    toast.success("Matière ajoutée !");
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

      {/* Recherche / ajout de matière */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Rechercher une matière..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            icon={FiSearch}
          />
        </div>
        {canAddSubject && (
          <Button
            type="button"
            onClick={handleAddSubject}
            className="rounded flex items-center gap-2 whitespace-nowrap"
            variant="outline"
          >
            <FiPlus />
            Ajouter « {query.trim()} »
          </Button>
        )}
      </div>

      {/* Liste des matières filtrées */}
      <div className="flex flex-wrap gap-3">
        {filteredSubjects.map((subject) => {
          const isSelected = selectedSubjects.includes(subject);
          return (
            <button
              key={subject}
              type="button"
              onClick={() => toggleSubject(subject)}
              className={`px-4 py-2 rounded-lg border text-sm sm:text-base transition ${
                isSelected
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-gray-300 hover:bg-primary/10"
              }`}
            >
              {subject}
            </button>
          );
        })}
        {filteredSubjects.length === 0 && !canAddSubject && (
          <p className="text-sm text-black/60">
            Aucune matière trouvée. Essayez un autre terme ou ajoutez la vôtre.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <div className="flex justify_between sm:justify-between">
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
