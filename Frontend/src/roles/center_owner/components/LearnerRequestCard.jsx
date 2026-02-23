// src/roles/center_owner/components/LearnerRequestCard.jsx
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "../../../shared/ui/Button";

/**
 * LearnerRequestCard
 * ------------------
 * Carte pour afficher une demande d'apprenant.
 * Permet d'accepter, refuser ou retirer du centre.
 */
export const LearnerRequestCard = ({ learner, onAccept, onReject, onRemove, isMember = false }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <img
          src={learner.avatar || "/placeholder-avatar.png"}
          alt={learner.name}
          className="w-16 h-16 rounded-full object-cover"
        />

        {/* Infos */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-dark mb-1">{learner.name}</h3>
          <p className="text-sm text-dark/60 mb-2">{learner.email}</p>
          
          {learner.level && (
            <p className="text-sm text-dark/60 mb-2">
              {t("learner.level", "Niveau")}: {learner.level}
            </p>
          )}

          {learner.subjects && learner.subjects.length > 0 && (
            <div className="mb-2">
              <p className="text-xs text-dark/60 mb-1">{t("learner.subjects", "Matières")}</p>
              <div className="flex flex-wrap gap-1">
                {learner.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            {!isMember ? (
              <>
                <Button
                  variant="primary"
                  className="rounded text-sm"
                  onClick={() => onAccept(learner.id)}
                >
                  {t("centerOwner.accept", "Accepter")}
                </Button>
                <Button
                  variant="outline"
                  className="rounded text-sm"
                  onClick={() => onReject(learner.id)}
                >
                  {t("centerOwner.reject", "Refuser")}
                </Button>
              </>
            ) : (
              <Button
                variant="danger"
                className="rounded text-sm"
                onClick={() => onRemove(learner.id)}
              >
                {t("centerOwner.remove", "Retirer du centre")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
