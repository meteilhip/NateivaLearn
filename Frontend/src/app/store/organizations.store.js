// src/app/store/organizations.store.js
import { create } from "zustand";

/**
 * ORGANIZATIONS STORE (mock)
 * --------------------------
 * 👑 center_owner : gère ses organisations.
 * Types mockés :
 *   Organization { id, name, description, logo, ownerId, tutorIds[], learnerIds[], createdAt }
 *   Membership { userId, organizationId, role: "owner" | "tutor" | "learner" }
 *
 * 🔌 FUTUR BACKEND : endpoints createOrganization, listMemberships, etc.
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

export const useOrganizationsStore = create((set, get) => ({
  /** Liste des organisations (mock) */
  organizations: getLocalStorage("organizations", []),

  /** Memberships : userId, organizationId, role */
  memberships: getLocalStorage("memberships", []),

  /** Demandes de membership en attente */
  membershipRequests: getLocalStorage("membershipRequests", []),

  /**
   * Créer une organisation (inscription center_owner).
   * Crée Organization + Membership(owner) et retourne l'organisation.
   */
  createOrganization: (payload) => {
    const { name, description, logo, country, languages, ownerId } = payload;
    const orgs = getLocalStorage("organizations", []);
    const mems = getLocalStorage("memberships", []);
    const id = `org-${Date.now()}`;
    const org = {
      id,
      name: name || "Mon centre",
      description: description || "",
      logo: logo || null,
      country: country || "",
      languages: Array.isArray(languages) ? languages : [languages].filter(Boolean),
      ownerId,
      tutorIds: [],
      learnerIds: [],
      createdAt: new Date().toISOString(),
    };
    const membership = {
      userId: ownerId,
      organizationId: id,
      role: "owner",
    };
    const newOrgs = [...(Array.isArray(orgs) ? orgs : []), org];
    const newMems = [...(Array.isArray(mems) ? mems : []), membership];
    localStorage.setItem("organizations", JSON.stringify(newOrgs));
    localStorage.setItem("memberships", JSON.stringify(newMems));
    set({ organizations: newOrgs, memberships: newMems });
    return org;
  },

  /** Récupérer les organisations d'un user (par memberships) */
  getOrganizationsForUser: (userId) => {
    const { organizations, memberships } = get();
    const orgIds = (memberships || [])
      .filter((m) => m.userId === userId)
      .map((m) => m.organizationId);
    return (organizations || []).filter((o) => orgIds.includes(o.id));
  },

  /** Récupérer le rôle d'un user dans une organisation */
  getMembershipRole: (userId, organizationId) => {
    const m = (get().memberships || []).find(
      (x) => x.userId === userId && x.organizationId === organizationId
    );
    return m ? m.role : null;
  },

  /** Organisation par id */
  getOrganizationById: (id) => {
    return (get().organizations || []).find((o) => o.id === id);
  },

  /**
   * Créer une demande de membership pour un tuteur (ou learner)
   * Simule une demande qui sera approuvée par le propriétaire du centre
   */
  requestMembership: (payload) => {
    const { userId, organizationId, role = "tutor" } = payload;
    const mems = getLocalStorage("memberships", []);
    const requests = getLocalStorage("membershipRequests", []);
    
    // Vérifier si une demande existe déjà
    const existingRequest = (Array.isArray(requests) ? requests : []).find(
      (r) => r.userId === userId && r.organizationId === organizationId && r.status === "pending"
    );
    if (existingRequest) {
      return { error: "Une demande existe déjà pour ce centre" };
    }

    // Vérifier si l'utilisateur est déjà membre
    const existingMembership = (Array.isArray(mems) ? mems : []).find(
      (m) => m.userId === userId && m.organizationId === organizationId
    );
    if (existingMembership) {
      return { error: "Vous êtes déjà membre de ce centre" };
    }

    const newRequest = {
      id: `req-${Date.now()}`,
      userId,
      organizationId,
      role,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const newRequests = [...(Array.isArray(requests) ? requests : []), newRequest];
    localStorage.setItem("membershipRequests", JSON.stringify(newRequests));
    
    // Mettre à jour le state pour que les composants se mettent à jour
    set((state) => ({
      ...state,
      membershipRequests: newRequests,
    }));
    
    return { success: true, request: newRequest };
  },

  /** Obtenir les demandes de membership pour une organisation */
  getMembershipRequests: (organizationId) => {
    const requests = get().membershipRequests || getLocalStorage("membershipRequests", []);
    return requests.filter((r) => r.organizationId === organizationId && r.status === "pending");
  },

  /** Vérifier si un utilisateur a une demande en attente pour un centre */
  hasPendingRequest: (userId, organizationId) => {
    const requests = get().membershipRequests || getLocalStorage("membershipRequests", []);
    return requests.some(
      (r) => r.userId === userId && r.organizationId === organizationId && r.status === "pending"
    );
  },
}));
