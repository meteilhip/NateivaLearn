// src/app/store/quiz.store.js
import { create } from "zustand";

/**
 * Quiz Store (mock)
 * -----------------
 * Gère les quiz créés par les tuteurs et envoyés aux apprenants.
 */

// Quiz créés par les tuteurs (mock initial vide)
const MOCK_TUTOR_QUIZZES = [];

export const useQuizStore = create((set, get) => ({
  tutorQuizzes: MOCK_TUTOR_QUIZZES,

  /**
   * Créer un quiz et l'envoyer aux apprenants sélectionnés
   */
  createAndSendQuiz: (quizData) => {
    const { title, description, questions, timeLimit, tutorId, tutorName, recipientLearnerIds } = quizData;
    
    const newQuiz = {
      id: `quiz-${Date.now()}`,
      title,
      description,
      type: "tutor",
      tutorId,
      tutorName,
      questionsCount: questions.length,
      timeLimit: timeLimit || null,
      completed: false,
      questions,
      createdAt: new Date().toISOString(),
      recipientLearnerIds: recipientLearnerIds || [],
    };

    set((state) => ({
      tutorQuizzes: [...state.tutorQuizzes, newQuiz],
    }));

    return newQuiz;
  },

  /**
   * Obtenir les quiz envoyés à un apprenant spécifique
   */
  getQuizzesForLearner: (learnerId) => {
    return get().tutorQuizzes.filter((quiz) => 
      quiz.recipientLearnerIds.includes(learnerId)
    );
  },

  /**
   * Obtenir les quiz créés par un tuteur spécifique
   */
  getQuizzesByTutor: (tutorId) => {
    return get().tutorQuizzes.filter((quiz) => quiz.tutorId === tutorId);
  },

  /**
   * Marquer un quiz comme complété pour un apprenant
   */
  markQuizCompleted: (quizId, learnerId) => {
    set((state) => ({
      tutorQuizzes: state.tutorQuizzes.map((quiz) =>
        quiz.id === quizId
          ? { ...quiz, completed: true }
          : quiz
      ),
    }));
  },
}));
