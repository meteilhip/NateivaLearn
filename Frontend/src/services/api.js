/**
 * Client API centralisé pour le backend Laravel.
 * - Base URL depuis import.meta.env.VITE_API_URL
 * - Credentials (cookies) pour Sanctum SPA
 * - CSRF token via cookie X-XSRF-TOKEN
 * - Réponses standard { success, data | message | errors }
 */

const getBaseUrl = () => import.meta.env.VITE_API_URL || "http://localhost:8000";

const getCsrfToken = () => {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

/** Appelé avant une requête qui modifie les données (POST/PUT/PATCH/DELETE) pour obtenir le cookie CSRF. */
async function ensureCsrfCookie() {
  if (getCsrfToken()) return;
  await fetch(`${getBaseUrl()}/sanctum/csrf-cookie`, { credentials: "include" });
}

/**
 * @param {string} path - Chemin (ex: /api/auth/login)
 * @param {RequestInit & { body?: object }} [options]
 * @returns {Promise<{ success: boolean, data?: any, message?: string, errors?: Record<string, string[]> }>}
 */
export async function api(path, options = {}) {
  const { body, headers = {}, method = "GET", ...rest } = options;
  const needsCsrf = /^(POST|PUT|PATCH|DELETE)$/i.test(method);
  if (needsCsrf) await ensureCsrfCookie();

  const url = path.startsWith("http") ? path : `${getBaseUrl()}${path}`;
  const isJson = body !== undefined && typeof body === "object" && !(body instanceof FormData);
  const reqHeaders = {
    Accept: "application/json",
    ...(isJson && body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...headers,
  };
  const csrf = getCsrfToken();
  if (csrf) reqHeaders["X-XSRF-TOKEN"] = csrf;

  const res = await fetch(url, {
    ...rest,
    method,
    credentials: "include",
    headers: reqHeaders,
    body: body !== undefined ? (isJson ? JSON.stringify(body) : body) : undefined,
  });

  let data;
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = { success: false, message: res.statusText || "Erreur réseau" };
  }

  if (!res.ok) {
    const err = new Error(data.message || "Erreur API");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export default api;
