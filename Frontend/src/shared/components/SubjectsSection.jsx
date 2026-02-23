// src/shared/components/SubjectsSection.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SubjectsSection
 * ---------------
 * Section pour afficher et gérer les matières enseignées.
 * Utilisé dans le profil public tutor.
 */
export const SubjectsSection = ({ subjects = [], onChange }) => {
  const { t } = useTranslation();
  const [newSubject, setNewSubject] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);

  const commonSubjects = [
    "Mathématiques",
    "Physique",
    "Chimie",
    "SVT",
    "Français",
    "Anglais",
    "Espagnol",
    "Histoire",
    "Géographie",
    "Philosophie",
    "Méthodologie",
  ];

  const handleAddSubject = (subject) => {
    if (subject && !subjects.includes(subject)) {
      onChange([...subjects, subject]);
      setNewSubject("");
      setShowAddInput(false);
    }
  };

  const handleRemoveSubject = (subjectToRemove) => {
    onChange(subjects.filter((s) => s !== subjectToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-dark/60 uppercase tracking-wider">
          {t("tutor.subjects", "Matières enseignées")}
        </label>
      </div>

      {/* Liste des matières actuelles */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {subjects.map((subject) => (
            <motion.div
              key={subject}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
            >
              <span>{subject}</span>
              {onChange && (
                <button
                  type="button"
                  onClick={() => handleRemoveSubject(subject)}
                  className="text-primary hover:text-primary/70"
                >
                  <FaTimes size={12} />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Ajouter une matière */}
      {onChange && (
        <div className="space-y-2">
          {showAddInput ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddSubject(newSubject);
                  } else if (e.key === "Escape") {
                    setShowAddInput(false);
                    setNewSubject("");
                  }
                }}
                placeholder={t("tutor.addSubject", "Ajouter une matière")}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <button
                type="button"
                onClick={() => handleAddSubject(newSubject)}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm"
              >
                {t("common.add", "Ajouter")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddInput(false);
                  setNewSubject("");
                }}
                className="px-4 py-2 bg-gray-200 text-dark rounded hover:bg-gray-300 text-sm"
              >
                {t("common.cancel", "Annuler")}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowAddInput(true)}
                className="flex items-center gap-2 text-primary hover:text-primary/70 text-sm"
              >
                <FaPlus size={12} />
                {t("tutor.addSubject", "Ajouter une matière")}
              </button>

              {/* Suggestions de matières communes */}
              <div className="flex flex-wrap gap-2">
                {commonSubjects
                  .filter((s) => !subjects.includes(s))
                  .slice(0, 6)
                  .map((subject) => (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => handleAddSubject(subject)}
                      className="px-3 py-1 bg-gray-100 text-dark rounded-full text-sm hover:bg-gray-200 transition"
                    >
                      + {subject}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
