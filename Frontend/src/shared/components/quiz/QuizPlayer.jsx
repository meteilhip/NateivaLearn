// src/shared/components/quiz/QuizPlayer.jsx
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../ui/Button";

/**
 * QuizPlayer
 * ----------
 * Composant pour jouer un quiz.
 * Affiche les questions une par une avec choix multiples.
 * Calcule le score à la fin.
 */
export const QuizPlayer = ({ quiz, onComplete, onClose }) => {
  const { t } = useTranslation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : null);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  // Timer si timeLimit existe
  useEffect(() => {
    if (!timeRemaining) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerId,
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Calculer le score
    let correctAnswers = 0;
    quiz.questions.forEach((question) => {
      const selectedAnswerId = selectedAnswers[question.id];
      const correctAnswer = question.answers.find((a) => a.isCorrect);
      if (selectedAnswerId === correctAnswer?.id) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    onComplete({
      quizId: quiz.id,
      score,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      answers: selectedAnswers,
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-dark">{quiz.title}</h2>
          <p className="text-sm text-dark/60">
            {t("quiz.question", "Question")} {currentQuestionIndex + 1} / {quiz.questions.length}
          </p>
        </div>
        {timeRemaining !== null && (
          <div className={`text-lg font-semibold ${timeRemaining < 60 ? "text-red-600" : "text-dark"}`}>
            {formatTime(timeRemaining)}
          </div>
        )}
      </div>

      {/* Barre de progression */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>

      {/* Question actuelle */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="mb-6"
        >
          <h3 className="text-lg font-medium text-dark mb-4">{currentQuestion.question}</h3>

          <div className="space-y-3">
            {currentQuestion.answers.map((answer) => {
              const isSelected = selectedAnswers[currentQuestion.id] === answer.id;
              return (
                <button
                  key={answer.id}
                  type="button"
                  onClick={() => handleAnswerSelect(answer.id)}
                  className={`
                    w-full text-left p-4 rounded-lg border-2 transition
                    ${isSelected
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 hover:border-primary/50"
                    }
                  `}
                >
                  {answer.text}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          {currentQuestionIndex > 0 && (
            <Button variant="outline" className="rounded" onClick={handlePrevious}>
              {t("common.back", "Retour")}
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded" onClick={onClose}>
            {t("common.cancel", "Annuler")}
          </Button>
          <Button
            variant="primary"
            className="rounded"
            onClick={handleNext}
            disabled={!selectedAnswers[currentQuestion.id]}
          >
            {isLastQuestion ? t("quiz.submit", "Terminer") : t("common.next", "Suivant")}
          </Button>
        </div>
      </div>
    </div>
  );
};
