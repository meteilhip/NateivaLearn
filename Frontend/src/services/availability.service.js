/**
 * Service des disponibilités tuteur.
 */

import api from "./api";

const PREFIX = "/api/availability";

export const availabilityService = {
  async list() {
    const { data } = await api(PREFIX);
    return data ?? { slots: [], blocked_dates: [] };
  },

  async saveSlots(slots) {
    const { data } = await api(PREFIX, {
      method: "POST",
      body: {
        slots: (slots ?? []).map((s) => ({
          day_of_week: s.day_of_week ?? s.day,
          start_time: s.start_time,
          end_time: s.end_time,
        })),
      },
    });
    return data ?? [];
  },

  async blockDate(date) {
    const { data } = await api(`${PREFIX}/block`, {
      method: "POST",
      body: { date },
    });
    return data;
  },

  async unblockDate(date) {
    const { data } = await api(`${PREFIX}/block/${encodeURIComponent(date)}`, {
      method: "DELETE",
    });
    return data;
  },

  async byTutor(tutorId) {
    const { data } = await api(`${PREFIX}/tutor/${tutorId}`);
    return data ?? { slots: [], blocked_dates: [] };
  },
};

export default availabilityService;
