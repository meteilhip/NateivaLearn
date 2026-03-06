/**
 * Service des quiz.
 */

import api from "./api";

const PREFIX = "/api/quizzes";

export const quizService = {
  async list() {
    const { data } = await api(PREFIX);
    return data ?? [];
  },

  async create(payload) {
    const { data } = await api(PREFIX, {
      method: "POST",
      body: {
        title: payload.title,
        description: payload.description ?? null,
        time_limit: payload.timeLimit ?? null,
        questions: (payload.questions ?? []).map((q) => ({
          question: q.question,
          answers: (q.answers ?? []).map((a) => ({
            answer: a.text ?? a.answer,
            is_correct: a.isCorrect ?? a.is_correct,
          })),
        })),
        recipient_learner_ids: payload.recipientLearnerIds ?? [],
      },
    });
    return data;
  },

  async getById(id) {
    const { data } = await api(`${PREFIX}/${id}`);
    return data;
  },

  async submit(quizId, answers) {
    const { data } = await api(`${PREFIX}/${quizId}/submit`, {
      method: "POST",
      body: { answers },
    });
    return data;
  },
};

export default quizService;
