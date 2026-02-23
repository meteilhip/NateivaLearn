// src/shared/components/quiz/QuizResult.jsx
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Button } from "../../ui/Button";

/**
 * QuizResult
 * ----------
 * Affiche le résultat d'un quiz avec le score et les détails.
 */
export const QuizResult = ({ result, quiz, onClose, onRetry }) => {
  const { t } = useTranslation();
  const { score, correctAnswers, totalQuestions } = result;

  const getScoreColor = () => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = () => {
    if (score >= 80) return t("quiz.excellent", "Excellent !");
    if (score >= 60) return t("quiz.good", "Bien joué !");
    return t("quiz.needPractice", "Continuez à vous entraîner !");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-center"
    >
      {/* Score principal */}
      <div className="mb-6">
        <div className={`text-6xl font-bold mb-2 ${getScoreColor()}`}>
          {score}%
        </div>
        <p className="text-lg text-dark/70">{getScoreMessage()}</p>
      </div>

      {/* Détails */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <FaCheckCircle className="text-emerald-600" />
          <span className="text-dark font-medium">
            {t("quiz.correctAnswers", "{{count}} bonnes réponses sur {{total}}", {
              count: correctAnswers,
              total: totalQuestions,
            })}
          </span>
        </div>
        <div className="text-sm text-dark/60">
          {t("quiz.scoreDetails", "Vous avez répondu correctement à {{correct}} questions sur {{total}}.", {
            correct: correctAnswers,
            total: totalQuestions,
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <Button variant="outline" className="rounded" onClick={onClose}>
          {t("quiz.close", "Fermer")}
        </Button>
        {onRetry && (
          <Button variant="primary" className="rounded" onClick={onRetry}>
            {t("quiz.retry", "Réessayer")}
          </Button>
        )}
      </div>
    </motion.div>
  );
};
