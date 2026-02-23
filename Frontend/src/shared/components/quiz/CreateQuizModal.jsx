// src/shared/components/quiz/CreateQuizModal.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaTimes } from "react-icons/fa";
import { Button } from "../../ui/Button";
import { LearnerSelector } from "./LearnerSelector";
import { useQuizStore } from "../../../app/store/quiz.store";

/**
 * CreateQuizModal
 * ---------------
 * Modal pour créer un quiz avec questions/réponses et sélectionner les apprenants destinataires.
 */
export const CreateQuizModal = ({ isOpen, onClose, tutorId, tutorName, learners = [] }) => {
  const { t } = useTranslation();
  const { createAndSendQuiz } = useQuizStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [questions, setQuestions] = useState([
    {
      id: `q-${Date.now()}`,
      question: "",
      answers: [
        { id: `a-${Date.now()}-1`, text: "", isCorrect: false },
        { id: `a-${Date.now()}-2`, text: "", isCorrect: false },
      ],
    },
  ]);
  const [selectedLearnerIds, setSelectedLearnerIds] = useState([]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q-${Date.now()}-${Math.random()}`,
        question: "",
        answers: [
          { id: `a-${Date.now()}-${Math.random()}-1`, text: "", isCorrect: false },
          { id: `a-${Date.now()}-${Math.random()}-2`, text: "", isCorrect: false },
        ],
      },
    ]);
  };

  const handleRemoveQuestion = (questionId) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== questionId));
    }
  };

  const handleQuestionChange = (questionId, value) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, question: value } : q))
    );
  };

  const handleAddAnswer = (questionId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: [
                ...q.answers,
                { id: `a-${Date.now()}-${Math.random()}`, text: "", isCorrect: false },
              ],
            }
          : q
      )
    );
  };

  const handleRemoveAnswer = (questionId, answerId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.filter((a) => a.id !== answerId),
            }
          : q
      )
    );
  };

  const handleAnswerChange = (questionId, answerId, value) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a) =>
                a.id === answerId ? { ...a, text: value } : a
              ),
            }
          : q
      )
    );
  };

  const handleToggleCorrect = (questionId, answerId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a) =>
                a.id === answerId ? { ...a, isCorrect: !a.isCorrect } : a
              ),
            }
          : q
      )
    );
  };

  const handleSubmit = () => {
    // Validation
    if (!title.trim()) {
      alert(t("quiz.titleRequired", "Le titre est requis"));
      return;
    }

    if (questions.length === 0) {
      alert(t("quiz.atLeastOneQuestion", "Au moins une question est requise"));
      return;
    }

    for (const q of questions) {
      if (!q.question.trim()) {
        alert(t("quiz.questionTextRequired", "Toutes les questions doivent avoir un texte"));
        return;
      }
      if (q.answers.length < 2) {
        alert(t("quiz.atLeastTwoAnswers", "Chaque question doit avoir au moins 2 réponses"));
        return;
      }
      const hasCorrect = q.answers.some((a) => a.isCorrect);
      if (!hasCorrect) {
        alert(t("quiz.atLeastOneCorrectAnswer", "Chaque question doit avoir au moins une réponse correcte"));
        return;
      }
      for (const a of q.answers) {
        if (!a.text.trim()) {
          alert(t("quiz.answerTextRequired", "Toutes les réponses doivent avoir un texte"));
          return;
        }
      }
    }

    if (selectedLearnerIds.length === 0) {
      alert(t("quiz.selectAtLeastOneLearner", "Sélectionnez au moins un apprenant"));
      return;
    }

    // Créer et envoyer le quiz
    createAndSendQuiz({
      title: title.trim(),
      description: description.trim(),
      questions: questions.map((q) => ({
        id: q.id,
        question: q.question.trim(),
        answers: q.answers.map((a) => ({
          id: a.id,
          text: a.text.trim(),
          isCorrect: a.isCorrect,
        })),
      })),
      timeLimit: timeLimit ? parseInt(timeLimit) : null,
      tutorId,
      tutorName,
      recipientLearnerIds: selectedLearnerIds,
    });

    // Réinitialiser le formulaire
    setTitle("");
    setDescription("");
    setTimeLimit("");
    setQuestions([
      {
        id: `q-${Date.now()}`,
        question: "",
        answers: [
          { id: `a-${Date.now()}-1`, text: "", isCorrect: false },
          { id: `a-${Date.now()}-2`, text: "", isCorrect: false },
        ],
      },
    ]);
    setSelectedLearnerIds([]);

    alert(t("quiz.quizSent", "Quiz créé et envoyé avec succès !"));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-dark">
                  {t("quiz.createQuiz", "Créer un quiz")}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Informations générales */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t("quiz.title", "Titre")} *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={t("quiz.titlePlaceholder", "Ex: Quiz de Mathématiques - Niveau Débutant")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t("quiz.description", "Description")}
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t("quiz.descriptionPlaceholder", "Description du quiz...")}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t("quiz.timeLimit", "Limite de temps (minutes)")}
                    </label>
                    <input
                      type="number"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(e.target.value)}
                      placeholder={t("quiz.timeLimitPlaceholder", "Optionnel")}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Questions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-dark">
                      {t("quiz.questions", "Questions")}
                    </h3>
                    <Button
                      variant="secondary"
                      onClick={handleAddQuestion}
                      className="flex items-center gap-2"
                    >
                      <FaPlus size={14} />
                      {t("quiz.addQuestion", "Ajouter une question")}
                    </Button>
                  </div>

                  {questions.map((q, qIndex) => (
                    <div
                      key={q.id}
                      className="border border-gray-200 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-dark mb-2">
                            {t("quiz.question", "Question")} {qIndex + 1} *
                          </label>
                          <input
                            type="text"
                            value={q.question}
                            onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                            placeholder={t("quiz.questionPlaceholder", "Entrez votre question...")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        {questions.length > 1 && (
                          <button
                            onClick={() => handleRemoveQuestion(q.id)}
                            className="ml-3 text-red-500 hover:text-red-700"
                          >
                            <FaTrash size={16} />
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-dark">
                            {t("quiz.answers", "Réponses")}
                          </label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAddAnswer(q.id)}
                            className="text-xs"
                          >
                            <FaPlus size={12} className="mr-1" />
                            {t("quiz.addAnswer", "Ajouter une réponse")}
                          </Button>
                        </div>

                        {q.answers.map((answer, aIndex) => (
                          <div key={answer.id} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={answer.text}
                              onChange={(e) =>
                                handleAnswerChange(q.id, answer.id, e.target.value)
                              }
                              placeholder={t("quiz.answerPlaceholder", "Réponse...")}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <button
                              onClick={() => handleToggleCorrect(q.id, answer.id)}
                              className={`
                                px-4 py-2 rounded-lg text-sm font-medium transition
                                ${
                                  answer.isCorrect
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }
                              `}
                            >
                              {answer.isCorrect
                                ? t("quiz.correct", "Correct")
                                : t("quiz.markCorrect", "Marquer correct")}
                            </button>
                            {q.answers.length > 2 && (
                              <button
                                onClick={() => handleRemoveAnswer(q.id, answer.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTrash size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sélection des apprenants */}
                <div>
                  <LearnerSelector
                    learners={learners}
                    selectedLearnerIds={selectedLearnerIds}
                    onSelectionChange={setSelectedLearnerIds}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <Button variant="ghost" onClick={onClose}>
                  {t("common.cancel", "Annuler")}
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                  {t("quiz.createAndSend", "Créer et envoyer")}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
