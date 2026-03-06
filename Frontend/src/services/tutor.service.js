/**
 * Service des tuteurs (liste pour apprenants / centres).
 */

import api from "./api";

const PREFIX = "/api/tutors";

export const tutorService = {
  async list(params = {}) {
    const q = new URLSearchParams(params).toString();
    const { data } = await api(`${PREFIX}${q ? `?${q}` : ""}`);
    return data ?? [];
  },

  async getById(id) {
    const { data } = await api(`${PREFIX}/${id}`);
    return data;
  },
};

export default tutorService;
