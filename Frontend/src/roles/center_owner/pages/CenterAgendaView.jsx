// src/roles/center_owner/pages/CenterAgendaView.jsx
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCoursesStore } from "../../../app/store/courses.store";
import { useAuthStore } from "../../../app/store/auth.store";
import { BookingStatusBadge } from "../../../shared/ui/BookingStatusBadge";

/**
 * CenterAgendaView
 * ----------------
 * Vue d'agenda pour center_owner.
 * Affiche à la fois l'agenda personnel (en tant que tuteur)
 * et l'agenda global du centre.
 */
export const CenterAgendaView = () => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const tutorId = user?.id;
  const { bookings, fetchBookings } = useCoursesStore();

  useEffect(() => {
    fetchBookings?.();
  }, [fetchBookings]);

  const myBookings = useMemo(
    () =>
      bookings.filter(
        (b) =>
          b.tutorId === tutorId &&
          ["pending", "confirmed"].includes(b.status)
      ),
    [bookings, tutorId]
  );

  const centerBookings = useMemo(
    () => bookings.filter((b) => ["pending", "confirmed"].includes(b.status)),
    [bookings]
  );

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
        {t("calendar.title", "Agenda")}
      </h1>

      {/* Agenda personnel du propriétaire (en tant que tuteur) */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-lg font-semibold text-dark">
          {t("booking.summary", "Résumé")} – {t("tutor.profile", "Profil")}
        </h2>
        {myBookings.length === 0 ? (
          <p className="text-dark/60 text-sm">
            {t("courses.noUpcoming", "Aucun cours à venir")}
          </p>
        ) : (
          <div className="space-y-3">
            {myBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-dark">
                    {booking.subject || "Cours"} – {booking.learnerName || "Apprenant"}
                  </p>
                  <p className="text-sm text-dark/60">
                    {formatDate(new Date(booking.startTime))} à{" "}
                    {formatTime(booking.startTime)}
                  </p>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Agenda du centre (tous les bookings liés au centre) */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-lg font-semibold text-dark">
          {t("centerOwner.agenda", "Agenda du centre")}
        </h2>

        {centerBookings.length === 0 ? (
          <p className="text-dark/60">
            {t("centerOwner.noBookings", "Aucune réservation")}
          </p>
        ) : (
          <div className="space-y-3">
            {centerBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={booking.tutorAvatar || "/9581121.png"}
                    alt={booking.tutorName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-dark">
                      {booking.tutorName} - {booking.subject}
                    </p>
                    <p className="text-sm text-dark/60">
                      {formatDate(new Date(booking.startTime))} à{" "}
                      {formatTime(booking.startTime)}
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
