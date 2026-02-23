// src/roles/learner/pages/LearnerQuiz.jsx
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../../app/store/auth.store";
import { useQuizStore } from "../../../app/store/quiz.store";
import { QuizCard } from "../../../shared/components/quiz/QuizCard";
import { QuizPlayer } from "../../../shared/components/quiz/QuizPlayer";
import { QuizResult } from "../../../shared/components/quiz/QuizResult";

/**
 * Mock data pour les quiz
 */
const MOCK_QUIZZES = [
  {
    id: "q1",
    title: "Quiz de Mathématiques - Niveau Débutant",
    description: "Testez vos connaissances en mathématiques de base",
    type: "system",
    questionsCount: 5,
    timeLimit: 10,
    completed: false,
    questions: [
      {
        id: "q1-1",
        question: "Quel est le résultat de 5 + 3 ?",
        answers: [
          { id: "a1", text: "7", isCorrect: false },
          { id: "a2", text: "8", isCorrect: true },
          { id: "a3", text: "9", isCorrect: false },
          { id: "a4", text: "10", isCorrect: false },
        ],
      },
      {
        id: "q1-2",
        question: "Quel est le résultat de 10 × 2 ?",
        answers: [
          { id: "a1", text: "18", isCorrect: false },
          { id: "a2", text: "20", isCorrect: true },
          { id: "a3", text: "22", isCorrect: false },
          { id: "a4", text: "24", isCorrect: false },
        ],
      },
      {
        id: "q1-3",
        question: "Quel est le résultat de 15 - 7 ?",
        answers: [
          { id: "a1", text: "6", isCorrect: false },
          { id: "a2", text: "7", isCorrect: false },
          { id: "a3", text: "8", isCorrect: true },
          { id: "a4", text: "9", isCorrect: false },
        ],
      },
      {
        id: "q1-4",
        question: "Quel est le résultat de 12 ÷ 3 ?",
        answers: [
          { id: "a1", text: "3", isCorrect: false },
          { id: "a2", text: "4", isCorrect: true },
          { id: "a3", text: "5", isCorrect: false },
          { id: "a4", text: "6", isCorrect: false },
        ],
      },
      {
        id: "q1-5",
        question: "Quel est le résultat de 6 × 4 ?",
        answers: [
          { id: "a1", text: "20", isCorrect: false },
          { id: "a2", text: "22", isCorrect: false },
          { id: "a3", text: "24", isCorrect: true },
          { id: "a4", text: "26", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "q2",
    title: "Quiz de Français - Grammaire",
    description: "Quiz envoyé par votre tuteur pour réviser la grammaire",
    type: "tutor",
    tutorName: "Marie Dupont",
    questionsCount: 3,
    completed: false,
    questions: [
      {
        id: "q2-1",
        question: "Quel est le pluriel de 'cheval' ?",
        answers: [
          { id: "a1", text: "chevals", isCorrect: false },
          { id: "a2", text: "chevaux", isCorrect: true },
          { id: "a3", text: "chevales", isCorrect: false },
          { id: "a4", text: "cheval", isCorrect: false },
        ],
      },
      {
        id: "q2-2",
        question: "Quel est le féminin de 'acteur' ?",
        answers: [
          { id: "a1", text: "acteuse", isCorrect: false },
          { id: "a2", text: "actrice", isCorrect: true },
          { id: "a3", text: "acteure", isCorrect: false },
          { id: "a4", text: "acteur", isCorrect: false },
        ],
      },
      {
        id: "q2-3",
        question: "Quel est le participe passé de 'prendre' ?",
        answers: [
          { id: "a1", text: "pris", isCorrect: true },
          { id: "a2", text: "prendu", isCorrect: false },
          { id: "a3", text: "pris", isCorrect: true },
          { id: "a4", text: "prend", isCorrect: false },
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
  const { getQuizzesForLearner } = useQuizStore();
  
  // Combiner les quiz système (mock) et les quiz envoyés par les tuteurs
  const tutorQuizzesFromStore = useMemo(() => {
    return getQuizzesForLearner(learnerId);
  }, [learnerId, getQuizzesForLearner]);
  
  const allQuizzes = useMemo(() => {
    return [...MOCK_QUIZZES, ...tutorQuizzesFromStore];
  }, [tutorQuizzesFromStore]);
  
  const [quizzes, setQuizzes] = useState(allQuizzes);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  // Mettre à jour les quiz quand tutorQuizzesFromStore change
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

  // Séparer les quiz système et tutor
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

      {/* Quiz système */}
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

      {/* Quiz envoyés par tutor */}
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
