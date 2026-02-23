// src/shared/components/quiz/LearnerSelector.jsx
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaCheck } from "react-icons/fa";

/**
 * LearnerSelector
 * ---------------
 * Composant pour sélectionner un ou plusieurs apprenants.
 * Utilise les bookings du tuteur pour obtenir la liste des apprenants.
 */
export const LearnerSelector = ({ learners = [], selectedLearnerIds = [], onSelectionChange }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLearners = useMemo(() => {
    if (!searchTerm) return learners;
    const term = searchTerm.toLowerCase();
    return learners.filter(
      (learner) =>
        learner.name?.toLowerCase().includes(term) ||
        learner.id?.toLowerCase().includes(term) ||
        learner.email?.toLowerCase().includes(term)
    );
  }, [learners, searchTerm]);

  const toggleLearner = (learnerId) => {
    const newSelection = selectedLearnerIds.includes(learnerId)
      ? selectedLearnerIds.filter((id) => id !== learnerId)
      : [...selectedLearnerIds, learnerId];
    onSelectionChange(newSelection);
  };

  const selectAll = () => {
    onSelectionChange(filteredLearners.map((l) => l.id));
  };

  const deselectAll = () => {
    onSelectionChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-dark">
          {t("quiz.selectLearners", "Sélectionner les apprenants")}
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="text-xs text-primary hover:underline"
          >
            {t("quiz.selectAll", "Tout sélectionner")}
          </button>
          <button
            type="button"
            onClick={deselectAll}
            className="text-xs text-gray-500 hover:underline"
          >
            {t("quiz.deselectAll", "Tout désélectionner")}
          </button>
        </div>
      </div>

      {learners.length > 5 && (
        <input
          type="text"
          placeholder={t("quiz.searchLearners", "Rechercher un apprenant...")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      )}

      <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
        {filteredLearners.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            {t("quiz.noLearners", "Aucun apprenant trouvé")}
          </p>
        ) : (
          filteredLearners.map((learner) => {
            const isSelected = selectedLearnerIds.includes(learner.id);
            return (
              <div
                key={learner.id}
                onClick={() => toggleLearner(learner.id)}
                className={`
                  flex items-center gap-3 p-2 rounded cursor-pointer transition
                  ${isSelected ? "bg-primary/10 border border-primary" : "hover:bg-gray-50"}
                `}
              >
                <div
                  className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center
                    ${isSelected ? "bg-primary border-primary" : "border-gray-300"}
                  `}
                >
                  {isSelected && <FaCheck size={12} className="text-white" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark">{learner.name || learner.id}</p>
                  {learner.email && (
                    <p className="text-xs text-gray-500">{learner.email}</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedLearnerIds.length > 0 && (
        <p className="text-xs text-gray-600">
          {t("quiz.selectedCount", "{{count}} apprenant(s) sélectionné(s)", {
            count: selectedLearnerIds.length,
          })}
        </p>
      )}
    </div>
  );
};
