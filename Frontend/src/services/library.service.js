/**
 * Service Librairie (dossiers, fichiers, partage).
 */

import api from "./api";

const PREFIX = "/api/library";

const getBaseUrl = () => import.meta.env.VITE_API_URL || "http://localhost:8000";

export const libraryService = {
  async list() {
    const data = await api(PREFIX);
    return data?.data ?? data ?? { folders: [], files: [], shared: [] };
  },

  async createFolder(payload) {
    const res = await api(`${PREFIX}/folders`, {
      method: "POST",
      body: { name: payload.name, parent_id: payload.parentId ?? null },
    });
    return res?.data ?? res;
  },

  async uploadFile(file, folderId = null) {
    const form = new FormData();
    form.append("file", file);
    if (folderId != null) form.append("folder_id", folderId);
    const res = await api(`${PREFIX}/files`, {
      method: "POST",
      body: form,
    });
    return res?.data ?? res;
  },

  async share(payload) {
    const res = await api(`${PREFIX}/share`, {
      method: "POST",
      body: {
        recipient_id: payload.recipientId,
        shareable_type: payload.shareableType,
        shareable_id: payload.shareableId,
      },
    });
    return res?.data ?? res;
  },

  getDownloadUrl(fileId) {
    return `${getBaseUrl()}${PREFIX}/files/${fileId}/download`;
  },

  /** Télécharge un fichier avec les credentials (cookies) pour l’auth. */
  async downloadFile(fileId, fileName) {
    const url = this.getDownloadUrl(fileId);
    const token = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1];
    const res = await fetch(url, {
      credentials: "include",
      headers: token ? { "X-XSRF-TOKEN": decodeURIComponent(token) } : {},
    });
    if (!res.ok) throw new Error("Download failed");
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName || "file";
    a.click();
    URL.revokeObjectURL(a.href);
  },

  async searchUsers(search) {
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await api(`/api/users${params}`);
    return res?.data ?? res ?? [];
  },

  async deleteFile(fileId) {
    await api(`${PREFIX}/files/${fileId}`, { method: "DELETE" });
  },

  async deleteFolder(folderId) {
    await api(`${PREFIX}/folders/${folderId}`, { method: "DELETE" });
  },
};

export default libraryService;
