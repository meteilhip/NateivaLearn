// src/roles/learner/pages/LearnerQuiz.jsx
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../../app/store/auth.store";
import { useQuizStore } from "../../../app/store/quiz.store";
import { QuizCard } from "../../../shared/components/quiz/QuizCard";
import { QuizPlayer } from "../../../shared/components/quiz/QuizPlayer";
import { QuizResult } from "../../../shared/components/quiz/QuizResult";

// Quiz système (IA) simulés côté frontend
const MOCK_QUIZZES = [
  {
    id: "sys-1",
    title: "Quiz IA - Révisions générales",
    description: "Quiz généré par l'IA pour réviser plusieurs matières.",
    type: "system",
    questionsCount: 3,
    timeLimit: 10,
    completed: false,
    questions: [
      {
        id: "sys-1-q1",
        question: "Combien font 7 × 8 ?",
        answers: [
          { id: "sys-1-q1-a1", text: "54", isCorrect: false },
          { id: "sys-1-q1-a2", text: "56", isCorrect: true },
          { id: "sys-1-q1-a3", text: "64", isCorrect: false },
        ],
      },
      {
        id: "sys-1-q2",
        question: "Quel est le synonyme de « rapide » ?",
        answers: [
          { id: "sys-1-q2-a1", text: "Lent", isCorrect: false },
          { id: "sys-1-q2-a2", text: "Vite", isCorrect: true },
          { id: "sys-1-q2-a3", text: "Triste", isCorrect: false },
        ],
      },
      {
        id: "sys-1-q3",
        question: "La capitale du Cameroun est...",
        answers: [
          { id: "sys-1-q3-a1", text: "Douala", isCorrect: false },
          { id: "sys-1-q3-a2", text: "Yaoundé", isCorrect: true },
          { id: "sys-1-q3-a3", text: "Bafoussam", isCorrect: false },
        ],
      },
    ],
  },
];

/**
 * LearnerQuiz
 * ------------
 * Page Quiz pour learner.
 * Affiche la liste des quiz (système et tutor) et permet de les jouer.
 */
export const LearnerQuiz = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const learnerId = user?.id || user?.email || "learner-1";
  const { getQuizzesForLearner, fetchTutorQuizzes } = useQuizStore();

  // Charger les quiz tuteurs depuis le backend
  useEffect(() => {
    fetchTutorQuizzes?.();
  }, [fetchTutorQuizzes]);

  // Quiz envoyés par les tuteurs pour ce learner
  const tutorQuizzesFromStore = useMemo(
    () => getQuizzesForLearner(learnerId),
    [learnerId, getQuizzesForLearner]
  );

  const allQuizzes = useMemo(
    () => [...MOCK_QUIZZES, ...tutorQuizzesFromStore],
    [tutorQuizzesFromStore]
  );
  
  const [quizzes, setQuizzes] = useState(allQuizzes);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  // Mettre à jour les quiz quand la source change
  useEffect(() => {
    setQuizzes(allQuizzes);
  }, [allQuizzes]);

  const handleStartQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setQuizResult(null);
  };

  const handleQuizComplete = (result) => {
    setQuizResult(result);
    // Marquer le quiz comme complété
    const updatedQuizzes = quizzes.map((q) =>
      q.id === result.quizId ? { ...q, completed: true } : q
    );
    // Dans un vrai app, on sauvegarderait ça dans le store
  };

  const handleClose = () => {
    setSelectedQuiz(null);
    setQuizResult(null);
  };

  const handleRetry = () => {
    setQuizResult(null);
    // Réinitialiser les réponses sélectionnées
  };

  const systemQuizzes = quizzes.filter((q) => q.type === "system");
  const tutorQuizzes = quizzes.filter((q) => q.type === "tutor");

  if (selectedQuiz && !quizResult) {
    return (
      <div className="space-y-6">
        <QuizPlayer
          quiz={selectedQuiz}
          onComplete={handleQuizComplete}
          onClose={handleClose}
        />
      </div>
    );
  }

  if (quizResult) {
    return (
      <div className="space-y-6">
        <QuizResult
          result={quizResult}
          quiz={selectedQuiz}
          onClose={handleClose}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark">{t("quiz.title", "Quiz")}</h1>

      {/* Quiz système (IA) */}
      {systemQuizzes.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-dark mb-4">
            {t("quiz.systemQuizzes", "Quiz système (IA)")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} onStart={handleStartQuiz} />
            ))}
          </div>
        </section>
      )}

      {/* Quiz envoyés par les tuteurs */}
      {tutorQuizzes.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-dark mb-4">
            {t("quiz.tutorQuizzes", "Quiz envoyés par vos tuteurs")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tutorQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} onStart={handleStartQuiz} />
            ))}
          </div>
        </section>
      )}

      {quizzes.length === 0 && (
        <p className="text-dark/60 text-center py-8">
          {t("quiz.noQuizzes", "Aucun quiz disponible")}
        </p>
      )}
    </div>
  );
};
