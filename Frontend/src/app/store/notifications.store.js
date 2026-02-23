// src/app/store/notifications.store.js
import { create } from "zustand";

/**
 * Notifications Store (mock)
 * --------------------------
 * Simule les notifications pour tous les comptes.
 * Frontend uniquement - pas de backend réel.
 */

const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    type: "booking",
    title: "Nouvelle réservation",
    message: "Marie Dupont a réservé un créneau pour demain à 10h",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "n2",
    type: "message",
    title: "Nouveau message",
    message: "Vous avez reçu un message de Jean Martin",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "n3",
    type: "system",
    title: "Mise à jour",
    message: "Nouvelle fonctionnalité disponible : Quiz interactifs",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
];

export const useNotificationsStore = create((set, get) => ({
  notifications: MOCK_NOTIFICATIONS,

  /** Marquer une notification comme lue */
  markAsRead: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
    }));
  },

  /** Marquer toutes les notifications comme lues */
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  /** Obtenir le nombre de notifications non lues */
  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.read).length;
  },

  /** Ajouter une notification (simulation) */
  addNotification: (notification) => {
    const newNotification = {
      id: `n-${Date.now()}`,
      ...notification,
      timestamp: new Date().toISOString(),
      read: false,
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }));
    return newNotification;
  },
}));
