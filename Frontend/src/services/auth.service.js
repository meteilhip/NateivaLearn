/**
 * Service d'authentification.
 * Tous les appels passent par le client api (credentials + CSRF).
 */

import api from "./api";

const AUTH_PREFIX = "/api/auth";

export const authService = {
  // Vérifie qu'un email est libre (validation côté backend sans créer l'utilisateur)
  async checkEmail(email) {
    const { data } = await api(`${AUTH_PREFIX}/check-email`, {
      method: "POST",
      body: { email: email?.trim()?.toLowerCase() },
    });
    return data;
  },

  async register(payload) {
    const { data } = await api(`${AUTH_PREFIX}/register`, {
      method: "POST",
      body: {
        ...payload,
        email: payload.email?.trim()?.toLowerCase(),
      },
    });
    return data;
  },

  async login(payload) {
    const { data } = await api(`${AUTH_PREFIX}/login`, {
      method: "POST",
      body: {
        email: payload.email?.trim()?.toLowerCase(),
        password: payload.password,
        remember: payload.remember ?? false,
      },
    });
    return data;
  },

  async logout() {
    await api(`${AUTH_PREFIX}/logout`, { method: "POST" });
  },

  async getCurrentUser() {
    try {
      const { data } = await api(`${AUTH_PREFIX}/user`, { method: "GET" });
      return data?.user ?? null;
    } catch (err) {
      if (err?.status === 401) return null;
      throw err;
    }
  },
};
export default authService;