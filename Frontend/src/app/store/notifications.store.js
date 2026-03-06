// src/app/store/notifications.store.js
import { create } from "zustand";
import { notificationService } from "../../services";

function mapNotif(n) {
  return {
    id: n.id,
    type: n.type ?? "system",
    title: n.title,
    message: n.body ?? n.message,
    timestamp: n.timestamp ?? n.created_at,
    read: n.read ?? !!n.read_at,
  };
}

export const useNotificationsStore = create((set, get) => ({
  notifications: [],

  fetchNotifications: async () => {
    try {
      const data = await notificationService.list();
      set({ notifications: (data ?? []).map(mapNotif) });
      return get().notifications;
    } catch {
      set({ notifications: [] });
      return [];
    }
  },

  markAsRead: async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
      }));
    } catch (e) {
      throw e;
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationService.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      }));
    } catch (e) {
      throw e;
    }
  },

  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.read).length;
  },

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
