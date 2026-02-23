// src/shared/components/booking/BookingSummary.jsx
import { useTranslation } from "react-i18next";
import { useSubscriptionStatus } from "../../hooks/useSubscriptionStatus";
import { useBookingConflict } from "../../hooks/useBookingConflict";
import { Button } from "../../ui/Button";

/**
 * BookingSummary
 * --------------
 * Colonne droite de la page de réservation.
 * Affiche le résumé de la réservation avec logique hybride (abonnement ou paiement).
 */
export const BookingSummary = ({ tutor, selectedDate, selectedSlot, onConfirm }) => {
  const { t } = useTranslation();
  const { hasActiveSubscription, remainingHours, totalHours } = useSubscriptionStatus(tutor?.id);

  // Vérifier les conflits
  const startTime = selectedDate && selectedSlot
    ? (() => {
        const date = new Date(selectedDate);
        date.setHours(Math.floor(selectedSlot.start / 60), selectedSlot.start % 60, 0, 0);
        return date;
      })()
    : null;

  const endTime = selectedDate && selectedSlot
    ? (() => {
        const date = new Date(selectedDate);
        date.setHours(Math.floor(selectedSlot.end / 60), selectedSlot.end % 60, 0, 0);
        return date;
      })()
    : null;

  const { hasConflict, conflictingBooking } = useBookingConflict(startTime, endTime);

  if (!selectedDate || !selectedSlot) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-dark mb-4">
          {t("booking.summary", "Résumé")}
        </h3>
        <p className="text-sm text-dark/60">
          {t("booking.selectDateAndTime", "Sélectionnez une date et un créneau")}
        </p>
      </div>
    );
  }

  const duration = 1; // 1 heure par défaut
  const price = tutor?.pricePerHour || 0;

  // Format de la date
  const dateStr = selectedDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Format de l'heure
  const timeStr = selectedSlot.label;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-dark mb-4">
        {t("booking.summary", "Résumé")}
      </h3>

      {/* Informations de base */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-dark/60">{t("booking.date", "Date")}</span>
          <span className="text-dark font-medium">{dateStr}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-dark/60">{t("booking.time", "Heure")}</span>
          <span className="text-dark font-medium">{timeStr}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-dark/60">{t("booking.duration", "Durée")}</span>
          <span className="text-dark font-medium">{duration} {t("courses.hour")}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-dark/60">{t("booking.price", "Prix")}</span>
          <span className="text-dark font-medium">{price.toLocaleString()} $</span>
        </div>
      </div>

      {/* Conflit de réservation */}
      {hasConflict && (
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
          <p className="text-sm text-red-700 mb-2">
            {t("booking.conflictMessage", "Vous avez déjà un cours prévu à cette heure.")}
          </p>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="rounded text-sm"
              onClick={() => {
                // TODO: Naviguer vers l'agenda
                console.log("Voir mon agenda");
              }}
            >
              {t("booking.viewCalendar", "Voir mon agenda")}
            </Button>
            <Button
              variant="danger"
              className="rounded text-sm"
              onClick={() => {
                // TODO: Annuler le cours existant
                console.log("Annuler le cours existant:", conflictingBooking);
              }}
            >
              {t("booking.cancelExisting", "Annuler le cours existant")}
            </Button>
          </div>
        </div>
      )}

      {/* Si abonnement actif */}
      {hasActiveSubscription && !hasConflict && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded p-4">
            <p className="text-sm text-emerald-700 mb-2">
              {t("booking.subscriptionRemaining", "Vous avez {{count}} heures restantes", {
                count: remainingHours,
              })}
            </p>
            {/* Barre de progression */}
            <div className="w-full bg-emerald-200 rounded-full h-2 mb-2">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all"
                style={{ width: `${(remainingHours / totalHours) * 100}%` }}
              />
            </div>
            <p className="text-xs text-emerald-600">
              {remainingHours} / {totalHours} {t("booking.hours", "heures")}
            </p>
          </div>
          <Button
            variant="primary"
            className="rounded w-full"
            onClick={() => onConfirm({ useSubscription: true })}
          >
            {t("booking.useSubscriptionHour", "Utiliser 1 heure de votre abonnement")}
          </Button>
        </div>
      )}

      {/* Si pas d'abonnement */}
      {!hasActiveSubscription && !hasConflict && (
        <div className="space-y-4">
          {/* Carte 1 : Cours individuel */}
          <div className="border border-gray-200 rounded p-4">
            <h4 className="font-semibold text-dark mb-2">
              {t("booking.individualLesson", "Cours individuel")}
            </h4>
            <p className="text-2xl font-bold text-primary mb-3">
              {price.toLocaleString()} $
            </p>
            <Button
              variant="primary"
              className="rounded w-full"
              onClick={() => onConfirm({ useSubscription: false })}
            >
              {t("booking.payAndBook", "Payer et réserver")}
            </Button>
          </div>

          {/* Carte 2 : Abonnement */}
          <div className="border border-gray-200 rounded p-4">
            <h4 className="font-semibold text-dark mb-2">
              {t("booking.subscription", "Abonnement")}
            </h4>
            <div className="space-y-2 mb-3">
              {[1, 2, 3].map((count) => {
                const subscriptionPrice = price * count * 4; // prix × nombre × 4 semaines
                return (
                  <div
                    key={count}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm text-dark">
                      {count} {t("booking.lessonsPerWeek", "cours/semaine")}
                    </span>
                    <span className="text-sm font-semibold text-dark">
                      {subscriptionPrice.toLocaleString()} $ / {t("subscription.monthly", "mois")}
                    </span>
                  </div>
                );
              })}
            </div>
            <Button
              variant="outline"
              className="rounded w-full"
              onClick={() => {
                // TODO: Ouvrir modal d'abonnement
                console.log("S'abonner");
              }}
            >
              {t("booking.subscribe", "S'abonner")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
