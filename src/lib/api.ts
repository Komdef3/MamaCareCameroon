import axios from "axios";

export const API_BASE = "https://mamacare-backend-cmrd.onrender.com";
export const api = axios.create({
  baseURL: API_BASE,
});

export function isApiConnectionError(error: unknown) {
  const e = error as { response?: unknown; code?: string; message?: string };
  return !e?.response || e.code === "ERR_NETWORK" || e.message === "Network Error";
}

export function createFallbackToken(email: string) {
  return `local-session-${btoa(`${email}:${Date.now()}`)}`;
}

function isLocalSessionToken(token: string | null) {
  return Boolean(token?.startsWith("local-session-"));
}

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && !isLocalSessionToken(token)) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (typeof window !== "undefined" && error?.response?.status === 401) {
      const url: string = error?.config?.url || "";
      const token = localStorage.getItem("token");
      // Don't hard-redirect for auth probe endpoints; let the caller handle it.
      const isAuthProbe = url.includes("/auth/me") || url.includes("/auth/login") || url.includes("/auth/register");
      if (!isAuthProbe && !isLocalSessionToken(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export interface User {
  id?: string | number;
  full_name: string;
  email: string;
  phone?: string;
  age?: number;
}