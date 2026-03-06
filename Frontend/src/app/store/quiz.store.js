// src/app/store/quiz.store.js
import { create } from "zustand";
import { quizService } from "../../services";

function mapQuiz(q) {
  if (!q) return q;
  const questions = (q.questions ?? []).map((qu) => ({
    id: qu.id,
    question: qu.question,
    answers: (qu.answers ?? []).map((a) => ({
      id: a.id,
      text: a.answer,
      isCorrect: a.is_correct ?? a.is_correct,
    })),
  }));
  return {
    id: q.id,
    title: q.title,
    description: q.description,
    type: "tutor",
    tutorId: q.tutor_id ?? q.tutor?.id,
    tutorName: q.tutor?.name,
    questionsCount: questions.length,
    timeLimit: q.time_limit ?? q.timeLimit,
    completed: q.recipient?.completed ?? q.completed,
    questions,
    createdAt: q.created_at ?? q.createdAt,
    recipientLearnerIds: [],
  };
}

export const useQuizStore = create((set, get) => ({
  tutorQuizzes: [],

  fetchTutorQuizzes: async () => {
    try {
      const data = await quizService.list();
      const list = Array.isArray(data) ? data : [];
      set({ tutorQuizzes: list.map(mapQuiz) });
      return get().tutorQuizzes;
    } catch {
      set({ tutorQuizzes: [] });
      return [];
    }
  },

  createAndSendQuiz: async (quizData) => {
    const { title, description, questions, timeLimit, tutorId, recipientLearnerIds } = quizData;
    try {
      const data = await quizService.create({
        title,
        description,
        timeLimit,
        questions: questions ?? [],
        recipientLearnerIds: recipientLearnerIds ?? [],
      });
      const mapped = mapQuiz(data);
      set((state) => ({ tutorQuizzes: [mapped, ...state.tutorQuizzes] }));
      return mapped;
    } catch (err) {
      const msg = err?.data?.message || err?.message;
      throw new Error(msg);
    }
  },

  getQuizzesForLearner: (learnerId) => {
    return get().tutorQuizzes.filter((q) =>
      (q.recipientLearnerIds ?? []).includes(learnerId)
    );
  },

  getQuizzesByTutor: (tutorId) => {
    return get().tutorQuizzes.filter((q) => String(q.tutorId ?? q.tutor_id) === String(tutorId));
  },

  markQuizCompleted: async (quizId, learnerId) => {
    await get().fetchTutorQuizzes();
  },
}));
