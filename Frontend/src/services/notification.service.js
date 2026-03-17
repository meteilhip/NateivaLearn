/**
 * Service des notifications.
 */

import api from "./api";

const PREFIX = "/api/notifications";

export const notificationService = {
  async list() {
    const { data } = await api(PREFIX);
    return data ?? [];
  },

  async markAsRead(id) {
    const { data } = await api(`${PREFIX}/${id}/read`, { method: "POST" });
    return data;
  },

  async markAllAsRead() {
    const { data } = await api(`${PREFIX}/read-all`, { method: "POST" });
    return data;
  },

  async getUnreadCount() {
    const { data } = await api(`${PREFIX}/unread-count`);
    return data?.count ?? 0;
  },

  async delete(id) {
    await api(`${PREFIX}/${id}`, { method: "DELETE" });
  },
};

export default notificationService;
