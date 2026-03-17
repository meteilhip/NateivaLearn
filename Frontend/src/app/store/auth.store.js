// src/app/store/auth.store.js
import { create } from "zustand";
import { authService } from "../../services";

function normalizeUser(apiUser) {
  if (!apiUser) return null;
  return {
    ...apiUser,
    avatar: apiUser.avatar ?? apiUser.photo ?? apiUser.photo_url ?? apiUser.profile_photo_url ?? null,
    activeOrganizationId: apiUser.active_organization_id ?? apiUser.activeOrganizationId,
  };
}

export const useAuthStore = create((set, get) => ({
  user: null,
  authReady: false,

  setUser: (user) => set({ user: normalizeUser(user) }),

  setActiveOrganizationId: async (organizationId) => {
    const user = get().user;
    if (!user) return;
    try {
      const api = (await import("../../services")).api;
      await api(`/api/user/active-organization/${organizationId}`, { method: "PUT" });
      const { data } = await api("/api/auth/user");
      set({ user: normalizeUser(data?.user) });
    } catch (e) {
      throw e;
    }
  },

  fetchUser: async () => {
    try {
      const data = await authService.getCurrentUser();
      set({ user: normalizeUser(data), authReady: true });
      return data;
    } catch {
      set({ user: null, authReady: true });
      return null;
    }
  },

  register: async (data) => {
    try {
      // Prépare la payload pour l'inscription côté API
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        country: data.country,
        password: data.password,
        password_confirmation: data.password_confirmation ?? data.password,
        role: data.role || "learner",
      };
      const roleLower = (data.role || "").toLowerCase();
      // Si on inscrit un tuteur ou un propriétaire de centre, inclure aussi les infos de profil tuteur
      if (roleLower === "tutor" || roleLower === "center_owner") {
        payload.tutor_subjects = data.tutorSubjects || [];
        payload.tutor_languages =
          roleLower === "tutor"
            ? data.tutorLanguages || []
            : data.ownerLanguages || [];
        payload.tutor_video_url = data.tutorVideo || null;
      }
      const res = await authService.register(payload);
      set({ user: normalizeUser(res?.user) });
      return { success: true };
    } catch (err) {
      const msg = err?.data?.message || err?.message || "Erreur d'inscription";
      const errors = err?.data?.errors;
      return { error: msg, errors };
    }
  },

  login: async ({ email, password, remember }) => {
    try {
      const res = await authService.login({ email, password, remember });
      set({ user: normalizeUser(res?.user), authReady: true });
      return { success: true };
    } catch (err) {
      const msg = err?.data?.message || err?.message || "Email ou mot de passe incorrect";
      const errors = err?.data?.errors;
      return { error: msg, errors };
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({ user: null, authReady: true });
    }
  },

  updateProfile: async (updates) => {
    const user = get().user;
    if (!user) return;
    try {
      const api = (await import("../../services")).api;
      const { data } = await api("/api/user/profile", {
        method: "PUT",
        body: updates,
      });
      set({ user: normalizeUser(data) });
    } catch (e) {
      throw e;
    }
  },
}));
