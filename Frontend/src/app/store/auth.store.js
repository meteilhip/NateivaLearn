// src/app/store/auth.store.jsx
import { create } from "zustand";

/**
 * Lecture sécurisée du localStorage (évite crash si données corrompues)
 */
function getLocalStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null || raw === "") return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * Normalise l'email pour comparaison (minuscules, sans espaces)
 */
function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

/**
 * Auth Store
 * ----------
 * - Gère les comptes (users)
 * - Gère l'utilisateur connecté (currentUser)
 * - center_owner : organizationIds[], activeOrganizationId (multi-tenant)
 */
export const useAuthStore = create((set, get) => ({
  /**
   * Utilisateur actuellement connecté
   * user.organizationIds[] et user.activeOrganizationId pour center_owner
   */
  user: getLocalStorage("currentUser", null),

  /**
   * Définir l'organisation active (center_owner, multi-tenant)
   */
  setActiveOrganizationId: (organizationId) => {
    const user = get().user;
    if (!user) return;
    const updated = { ...user, activeOrganizationId: organizationId || null };
    localStorage.setItem("currentUser", JSON.stringify(updated));
    set({ user: updated });
  },

  /**
   * INSCRIPTION
   * → Ajoute l'utilisateur à la liste des comptes
   * → Si role = center_owner : organization créée via organizations.store (appelé depuis SignupMultiStep)
   */
  register: (data) => {
    let users = getLocalStorage("users", []);
    if (!Array.isArray(users)) {
      users = [];
      localStorage.setItem("users", "[]");
    }

    const emailNorm = normalizeEmail(data.email);
    if (!emailNorm) {
      return { error: "L'email est requis" };
    }

    const alreadyExists = users.some(
      (u) => u && normalizeEmail(u.email) === emailNorm
    );

    if (alreadyExists) {
      return { error: "Un compte avec cet email existe déjà" };
    }

    const userToSave = {
      ...data,
      email: (data.email || "").trim(),
      organizationIds: data.organizationIds || [],
      activeOrganizationId: data.activeOrganizationId || null,
    };

    const updatedUsers = [...users, userToSave];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("currentUser", JSON.stringify(userToSave));

    set({ user: userToSave });
    return { success: true };
  },

  /**
   * CONNEXION
   * → Vérifie email + mot de passe
   */
  login: ({ email, password }) => {
    const users = getLocalStorage("users", []);
    if (!Array.isArray(users) || users.length === 0) {
      return { error: "Aucun compte trouvé. Inscrivez-vous d'abord." };
    }

    const emailNorm = normalizeEmail(email);
    const foundUser = users.find(
      (u) =>
        normalizeEmail(u.email) === emailNorm &&
        u.password === password
    );

    if (!foundUser) {
      return { error: "Email ou mot de passe incorrect" };
    }

    localStorage.setItem("currentUser", JSON.stringify(foundUser));
    set({ user: foundUser });
    return { success: true };
  },

  /**
   * DÉCONNEXION
   * → Supprime UNIQUEMENT la session
   */
  logout: () => {
    localStorage.removeItem("currentUser");
    set({ user: null });
  },

  /**
   * Mise à jour du profil (nom, mot de passe, avatar)
   * → Met à jour currentUser et la liste users en localStorage
   */
  updateProfile: (updates) => {
    const user = get().user;
    if (!user) return;
    const updated = { ...user, ...updates };
    localStorage.setItem("currentUser", JSON.stringify(updated));
    const users = getLocalStorage("users", []);
    const idx = users.findIndex((u) => u && normalizeEmail(u.email) === normalizeEmail(user.email));
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...updates };
      localStorage.setItem("users", JSON.stringify(users));
    }
    set({ user: updated });
  },
}));
