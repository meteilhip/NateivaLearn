// src/auth/pages/Step5Subjects.jsx
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "../../shared/ui/Button";

// Composant Input réutilisable
import { Input } from "../../shared/ui/Input";

// Icônes
import { FiSearch } from "react-icons/fi";
import { HiOutlineBookOpen } from "react-icons/hi";

// Données des matières
import coursesData from "../../data/courses";

/**
 * Step5Subjects
 * Étape 5 du signup : sélection d'une ou plusieurs matières
 */
export default function Step5Subjects({ data, setData, onNext, onBack }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  // Filtrage des matières selon la recherche
  const filtered = useMemo(() => {
    if (!search) return coursesData;

    return coursesData.filter((course) =>
      course.subjectName.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Ajout / suppression d'une matière
  const toggleSubject = (subject) => {
    const exists = data.subjects.includes(subject);

    setData({
      ...data,
      subjects: exists
        ? data.subjects.filter((s) => s !== subject)
        : [...data.subjects, subject],
    });
  };

  return (
    <motion.div
      key="step-5"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Titre avec icône */}
      <h1 className="text-3xl font-bold flex items-center gap-3">
        {t("signup.chooseSubjects")}
        <HiOutlineBookOpen className="text-primary" size={32} />
      </h1>

      {/* Texte explicatif */}
      <p className="text-black/70">
        {t("signup.chooseSubjectsInfo")}
      </p>

      {/* Recherche */}
      <Input
        type="text"
        placeholder={t("signup.searchSubject")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon={FiSearch}
      />

      {/* Liste scrollable des matières */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[60vh] overflow-auto scrollbar-hide">
        {filtered.map((course) => {
          const Icon = course.icon;
          const selected = data.subjects.includes(course.subjectName);

          return (
            <button
              key={course.id}
              onClick={() => toggleSubject(course.subjectName)}
              className={`p-4 border rounded flex gap-3 transition ${
                selected
                  ? "border-primary bg-primary/10"
                  : "border-black/20 hover:bg-black/5"
              }`}
            >
              <Icon size={28} className="text-primary" />

              <div>
                <div className="font-semibold">
                  {course.title}
                </div>
                <div className="text-sm text-black/60">
                  {course.summary}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" className="rounded" onClick={onBack}>
          ← {t("signup.back")}
        </Button>

        <Button
          onClick={onNext}
          className="rounded"
          disabled={!data.subjects.length}
        >
          {t("signup.continue")}
        </Button>
      </div>
    </motion.div>
  );
}
