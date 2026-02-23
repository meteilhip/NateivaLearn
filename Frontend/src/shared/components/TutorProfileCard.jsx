import React from "react";
import { Button } from "../ui/Button";
import { StarRating } from "../ui/StarRating";
import { useTranslation } from "react-i18next";
import { useLearnerCenter } from "../hooks/useLearnerCenter";

/**
 * TutorProfileCard
 * - Carte profil tuteur (modale ou page profil)
 * - Affiche optionnellement prix, note, et CTA "Réserver" (section Cours)
 * - Affiche boutons conditionnels selon si learner a un centre
 */
export const TutorProfileCard = ({ tutor, showPrice, showRating, onBook, onJoinCenter }) => {
  const { t } = useTranslation();
  const { hasCenter } = useLearnerCenter();

  return (
    <aside className="bg-white rounded-lg shadow-lg p-6 w-full md:w-80">
      <div className="flex flex-col items-center gap-4">
        <img
          src={tutor.avatar || "/placeholder-avatar.png"}
          alt={tutor.name}
          className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover shadow-sm"
        />

        <h3 className="text-gray-900 text-lg md:text-xl font-semibold text-center">
          {tutor.name}
        </h3>

        <p className="text-sm text-gray-600 text-center">
          {tutor.tagline || tutor.subjects?.join(", ")}
        </p>

        {(showPrice && tutor.pricePerHour != null) && (
          <p className="text-primary font-semibold">
            {tutor.pricePerHour.toLocaleString()} $ / {t("courses.hour")}
          </p>
        )}
        {(showRating && tutor.rating != null) && (
          <div className="flex items-center gap-2">
            <StarRating score={tutor.rating} size={18} />
            <span className="text-sm text-gray-600">({tutor.rating})</span>
          </div>
        )}

        <div className="w-full mt-2 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{t("tutor.experience")}</span>
            <span>{tutor.experience || "—"}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{t("tutor.languages")}</span>
            <span>{(tutor.languages || []).join(", ") || "—"}</span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 mt-4">
          {/* Cas 1 : Learner n'a pas rejoint de centre */}
          {!hasCenter && (
            <>
              {onBook && (
                <Button variant="primary" className="rounded w-full text-sm" onClick={() => onBook(tutor)}>
                  {t("courses.bookSlot")}
                </Button>
              )}
              {onJoinCenter && (
                <Button variant="outline" className="rounded w-full text-sm" onClick={() => onJoinCenter(tutor)}>
                  {t("tutor.startLearningWithTutor")}
                </Button>
              )}
            </>
          )}
          
          {/* Cas 2 : Learner a déjà un centre */}
          {hasCenter && onBook && (
            <Button variant="primary" className="rounded w-full text-sm" onClick={() => onBook(tutor)}>
              {t("courses.bookSlot")}
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};
