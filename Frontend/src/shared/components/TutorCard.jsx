// src/shared/components/TutorCard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";
import { StarRating } from "../ui/StarRating";
import { TutorProfileModal } from "./TutorProfileModal";

/**
 * TutorCard
 * - Carte tuteur (réutilisable liste + détail)
 * - Gère sa propre modale profil
 * - Option : bouton "Réserver" (onBook) pour le flow réservation
 */
export const TutorCard = ({ tutor, isSelected, onSelect, showPrice, showRating, onBook }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleBook = (e) => {
    e.stopPropagation();
    if (onBook) {
      onBook(tutor);
    } else {
      // Par défaut, rediriger vers la page de réservation
      navigate(`/learner/booking/${tutor.id}`);
    }
  };

  return (
    <>
      <article
        onClick={onSelect}
        className={`bg-white shadow-md rounded p-4 flex flex-col gap-3 cursor-pointer transition
        ${isSelected ? "border-2 border-primary" : "border border-black/10"}`}
      >
        <div className="flex gap-3">
          <img
            src={tutor.avatar}
            alt={tutor.name}
            className="w-14 h-14 rounded-full object-cover"
          />

          <div className="flex-1">
            <h4 className="text-gray-900 font-semibold text-sm sm:text-base">
              {tutor.name}
            </h4>

            <p className="text-sm text-black/60">
              {t("tutor.teaches")} : {tutor.subjects.join(" • ")}
            </p>

            {showPrice && tutor.pricePerHour != null && (
              <p className="text-sm text-primary font-semibold mt-1">
                {tutor.pricePerHour.toLocaleString()} $ / {t("courses.hour")}
              </p>
            )}

            {showRating && (tutor.rating != null) && (
              <div className="flex items-center gap-1 mt-1">
                <StarRating score={tutor.rating} size={14} />
                <span className="text-xs text-black/60">({tutor.rating})</span>
              </div>
            )}

            {tutor.experience && (
              <p className="text-xs text-black/50 mt-1">
                <strong>{t("tutor.experience")} :</strong> {tutor.experience}
              </p>
            )}

            {tutor.languages && tutor.languages.length > 0 && (
              <p className="text-xs text-black/50">
                <strong>{t("tutor.languages")} :</strong>{" "}
                {tutor.languages.join(" • ")}
              </p>
            )}
          </div>

          <span className="text-xs text-primary font-semibold">
            {tutor.center || "—"}
          </span>
        </div>

        <div className="flex justify-end gap-2 mt-auto">
          <Button variant="primary" onClick={handleBook} className="rounded">
            {t("courses.bookSlot")}
          </Button>
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
            className="rounded"
          >
            {t("tutor.profile")}
          </Button>
        </div>
      </article>

      <TutorProfileModal
        tutor={tutor}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
