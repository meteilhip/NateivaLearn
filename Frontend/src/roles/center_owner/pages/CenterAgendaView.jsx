// src/roles/center_owner/pages/CenterAgendaView.jsx
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCoursesStore } from "../../../app/store/courses.store";
import { BookingStatusBadge } from "../../../shared/ui/BookingStatusBadge";

/**
 * CenterAgendaView
 * ----------------
 * Vue d'agenda pour center_owner.
 * Affiche toutes les réservations du centre.
 */
export const CenterAgendaView = () => {
  const { t } = useTranslation();
  const { bookings } = useCoursesStore();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Filtrer les bookings (simulation : tous les bookings du système)
  const centerBookings = useMemo(() => {
    return bookings.filter((b) => ["pending", "confirmed"].includes(b.status));
  }, [bookings]);

  const formatDate = (date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (iso) => {
    return new Date(iso).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark">
        {t("centerOwner.agenda", "Agenda du centre")}
      </h1>

      {/* Liste des réservations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-dark mb-4">
          {t("centerOwner.upcomingBookings", "Réservations à venir")}
        </h2>

        {centerBookings.length === 0 ? (
          <p className="text-dark/60">{t("centerOwner.noBookings", "Aucune réservation")}</p>
        ) : (
          <div className="space-y-3">
            {centerBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={booking.tutorAvatar || "/placeholder-avatar.png"}
                    alt={booking.tutorName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-dark">
                      {booking.tutorName} - {booking.subject}
                    </p>
                    <p className="text-sm text-dark/60">
                      {formatDate(new Date(booking.startTime))} à {formatTime(booking.startTime)}
                    </p>
                  </div>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
