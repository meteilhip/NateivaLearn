/**
 * Service des organisations (centres).
 */

import api from "./api";

const PREFIX = "/api/organizations";

export const organizationService = {
  async list() {
    const res = await api(PREFIX);
    if (!res) return [];
    const data = res.data ?? res;
    const list = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : []);
    return list;
  },

  async discover(params = {}) {
    const clean = {};
    if (params.city != null && params.city !== "" && params.city !== "undefined") {
      clean.city = params.city;
    }
    if (params.country != null && params.country !== "" && params.country !== "undefined") {
      clean.country = params.country;
    }
    const q = Object.keys(clean).length ? new URLSearchParams(clean).toString() : "";
    const res = await api(`${PREFIX}/discover${q ? `?${q}` : ""}`);
    if (!res) return [];
    const data = res.data ?? res;
    const list = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : []);
    return list;
  },

  async create(payload) {
    const { data } = await api(PREFIX, {
      method: "POST",
      body: {
        name: payload.name,
        city: payload.city || null,
        country: payload.country ?? null,
        description: payload.description || null,
        logo: payload.logo ?? null,
        required_languages: payload.required_languages ?? null,
        subjects: payload.subjects ?? null,
      },
    });
    return data;
  },

  async getById(id) {
    const { data } = await api(`${PREFIX}/${id}`);
    return data;
  },

  async update(id, payload) {
    const body = {};
    if (payload.name !== undefined) body.name = payload.name;
    if (payload.city !== undefined) body.city = payload.city;
    if (payload.country !== undefined) body.country = payload.country;
    if (payload.description !== undefined) body.description = payload.description;
    if (payload.logo !== undefined) body.logo = payload.logo;
    if (payload.required_languages !== undefined) body.required_languages = payload.required_languages;
    if (payload.subjects !== undefined) body.subjects = payload.subjects;
    const { data } = await api(`${PREFIX}/${id}`, {
      method: "PUT",
      body,
    });
    return data;
  },

  async requestMembership(payload) {
    const { data } = await api(`${PREFIX}/request-membership`, {
      method: "POST",
      body: {
        organization_id: payload.organizationId,
        role: payload.role || "tutor",
      },
    });
    return data;
  },

  async getMembershipRequests(organizationId) {
    const { data } = await api(`${PREFIX}/${organizationId}/membership-requests`);
    return data ?? [];
  },

  async updateMembership(membershipId, payload) {
    const { data } = await api(`/api/organization-memberships/${membershipId}`, {
      method: "PUT",
      body: { status: payload.status },
    });
    return data;
  },

  async getMembers(organizationId) {
    const { data } = await api(`${PREFIX}/${organizationId}/members`);
    return data ?? [];
  },
};

export default organizationService;
