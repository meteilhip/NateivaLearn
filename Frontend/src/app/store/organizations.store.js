// src/app/store/organizations.store.js
import { create } from "zustand";
import { organizationService } from "../../services";

function mapOrg(o) {
  if (!o) return o;
  const languages = o.required_languages ?? o.requiredLanguages;
  return {
    ...o,
    ownerId: o.owner_id ?? o.ownerId,
    requiredLanguages: Array.isArray(languages) ? languages : languages,
  };
}
function mapRequest(r) {
  if (!r) return r;
  return { ...r, userId: r.user_id ?? r.userId, organizationId: r.organization_id ?? r.organizationId };
}

export const useOrganizationsStore = create((set, get) => ({
  organizations: [],
  membershipRequests: [],

  fetchOrganizations: async () => {
    try {
      const data = await organizationService.list();
      set({ organizations: (data ?? []).map(mapOrg) });
      return get().organizations;
    } catch {
      set({ organizations: [] });
      return [];
    }
  },

  createOrganization: async (payload) => {
    const { name, description, logo, country, languages, ownerId, subjects } = payload;
    try {
      const org = await organizationService.create({
        name: name || "Mon centre",
        city: country,
        description: description || "",
        logo: logo ?? null,
        required_languages: Array.isArray(languages) ? languages : null,
        subjects: Array.isArray(subjects) ? subjects : null,
      });
      set((state) => ({ organizations: [mapOrg(org), ...state.organizations] }));
      return mapOrg(org);
    } catch (err) {
      const msg = err?.data?.message || err?.message;
      return { error: msg };
    }
  },

  updateOrganization: async (organizationId, payload) => {
    try {
      const updated = await organizationService.update(organizationId, {
        name: payload.name,
        city: payload.city,
        description: payload.description,
        logo: payload.logo,
        required_languages: payload.required_languages ?? payload.requiredLanguages,
        subjects: payload.subjects,
      });
      set((state) => ({
        organizations: state.organizations.map((o) =>
          String(o.id) === String(organizationId) ? mapOrg(updated) : o
        ),
      }));
      return mapOrg(updated);
    } catch (err) {
      const msg = err?.data?.message || err?.message;
      throw new Error(msg || "Erreur lors de la mise à jour du centre");
    }
  },

  getOrganizationsForUser: (userId) => {
    return get().organizations;
  },

  getOrganizationById: (id) => {
    return get().organizations.find((o) => String(o.id) === String(id));
  },

  requestMembership: async (payload) => {
    const { userId, organizationId, role = "tutor" } = payload;
    try {
      const data = await organizationService.requestMembership({
        organizationId,
        role,
      });
      return { success: true, request: mapRequest(data) };
    } catch (err) {
      const msg = err?.data?.message || err?.message || "Erreur";
      return { error: msg };
    }
  },

  fetchMembershipRequests: async (organizationId) => {
    try {
      const data = await organizationService.getMembershipRequests(organizationId);
      set({ membershipRequests: (data ?? []).map(mapRequest) });
      return get().membershipRequests;
    } catch {
      return [];
    }
  },

  getMembershipRequests: (organizationId) => {
    return get().membershipRequests.filter(
      (r) => String(r.organizationId ?? r.organization_id) === String(organizationId) && r.status === "pending"
    );
  },

  updateMembershipStatus: async (membershipId, status) => {
    try {
      await organizationService.updateMembership(membershipId, { status });
      await get().fetchMembershipRequests?.();
    } catch (err) {
      throw err;
    }
  },

  hasPendingRequest: (userId, organizationId) => {
    return get().membershipRequests.some(
      (r) =>
        String(r.userId ?? r.user_id) === String(userId) &&
        String(r.organizationId ?? r.organization_id) === String(organizationId) &&
        r.status === "pending"
    );
  },
}));
