/**
 * Service des réservations (bookings).
 */

import api from "./api";

const PREFIX = "/api/bookings";

export const bookingService = {
  async list() {
    const { data } = await api(PREFIX);
    return data ?? [];
  },

  async create(payload) {
    const { data } = await api(PREFIX, {
      method: "POST",
      body: {
        tutor_id: payload.tutorId,
        organization_id: payload.organizationId ?? null,
        date: payload.date,
        start_time: payload.startTime,
        end_time: payload.endTime,
        price: payload.price ?? null,
      },
    });
    return data;
  },

  async getById(id) {
    const { data } = await api(`${PREFIX}/${id}`);
    return data;
  },

  async confirm(id) {
    const { data } = await api(`${PREFIX}/${id}/confirm`, { method: "POST" });
    return data;
  },

  async complete(id) {
    const { data } = await api(`${PREFIX}/${id}/complete`, { method: "POST" });
    return data;
  },

  async cancel(id) {
    const { data } = await api(`${PREFIX}/${id}/cancel`, { method: "POST" });
    return data;
  },
};

export default bookingService;
