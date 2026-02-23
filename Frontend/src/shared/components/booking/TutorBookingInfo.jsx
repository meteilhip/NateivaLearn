// src/shared/components/booking/TutorBookingInfo.jsx
import { useTranslation } from "react-i18next";
import { StarRating } from "../../ui/StarRating";
import { useSubscriptionStatus } from "../../hooks/useSubscriptionStatus";

/**
 * TutorBookingInfo
 * ----------------
 * Colonne gauche de la page de réservation.
 * Affiche les informations du tutor : photo, nom, prix, langue, note, badge abonnement.
 */
export const TutorBookingInfo = ({ tutor }) => {
  const { t } = useTranslation();
  const { hasActiveSubscription } = useSubscriptionStatus(tutor?.id);

  if (!tutor) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Photo */}
      <div className="flex justify-center mb-4">
        <img
          src={tutor.avatar || "/placeholder-avatar.png"}
          alt={tutor.name}
          className="w-24 h-24 rounded-full object-cover"
        />
      </div>

      {/* Nom */}
      <h3 className="text-xl font-semibold text-dark text-center mb-2">
        {tutor.name}
      </h3>

      {/* Prix */}
      {tutor.pricePerHour != null && (
        <p className="text-primary font-semibold text-center mb-3">
          {tutor.pricePerHour.toLocaleString()} $ / {t("courses.hour")}
        </p>
      )}

      {/* Langue */}
      {tutor.languages && tutor.languages.length > 0 && (
        <div className="mb-3">
          <p className="text-sm text-dark/60 mb-1">{t("tutor.languages")}</p>
          <p className="text-sm text-dark">{tutor.languages.join(", ")}</p>
        </div>
      )}

      {/* Note */}
      {tutor.rating != null && (
        <div className="mb-3 flex items-center justify-center gap-2">
          <StarRating score={tutor.rating} size={18} />
          <span className="text-sm text-dark/60">({tutor.rating})</span>
        </div>
      )}

      {/* Badge abonnement */}
      <div className="mt-4">
        {hasActiveSubscription ? (
          <div className="bg-emerald-100 text-emerald-700 px-3 py-2 rounded text-sm text-center font-medium">
            {t("booking.subscriptionActive", "Abonnement actif")}
          </div>
        ) : (
          <div className="bg-gray-100 text-gray-600 px-3 py-2 rounded text-sm text-center">
            {t("booking.noSubscription", "Aucun abonnement")}
          </div>
        )}
      </div>
    </div>
  );
};
