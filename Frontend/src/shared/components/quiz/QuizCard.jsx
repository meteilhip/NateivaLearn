// src/shared/components/quiz/QuizCard.jsx
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaBrain, FaUser } from "react-icons/fa";

/**
 * QuizCard
 * --------
 * Carte affichant un quiz (système ou envoyé par tutor).
 * Affiche titre, type, statut, et permet de lancer le quiz.
 */
export const QuizCard = ({ quiz, onStart }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {quiz.type === "system" ? (
            <FaBrain className="text-primary text-xl" />
          ) : (
            <FaUser className="text-emerald-600 text-xl" />
          )}
          <div>
            <h3 className="text-lg font-semibold text-dark">{quiz.title}</h3>
            <p className="text-sm text-dark/60">
              {quiz.type === "system"
                ? t("quiz.systemQuiz", "Quiz système (IA)")
                : t("quiz.tutorQuiz", "Quiz envoyé par {{tutorName}}", { tutorName: quiz.tutorName })}
            </p>
          </div>
        </div>
        {quiz.completed && (
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
            {t("quiz.completed", "Terminé")}
          </span>
        )}
      </div>

      <p className="text-sm text-dark/70 mb-4">{quiz.description}</p>

      <div className="flex items-center justify-between">
        <div className="text-sm text-dark/60">
          {t("quiz.questionsCount", "{{count}} questions", { count: quiz.questionsCount || 0 })}
          {quiz.timeLimit && ` • ${quiz.timeLimit} ${t("quiz.minutes", "min")}`}
        </div>
        <button
          type="button"
          onClick={() => onStart(quiz)}
          disabled={quiz.completed}
          className={`
            px-4 py-2 rounded text-sm font-medium transition
            ${quiz.completed
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary/90"
            }
          `}
        >
          {quiz.completed ? t("quiz.review", "Réviser") : t("quiz.start", "Commencer")}
        </button>
      </div>
    </motion.div>
  );
};
