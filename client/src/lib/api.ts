const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Token helpers ─────────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem("thumblify_token");
export const setToken = (token: string) => localStorage.setItem("thumblify_token", token);
export const removeToken = () => localStorage.removeItem("thumblify_token");

// ── Core fetch wrapper ────────────────────────────────────────────────────────
const request = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (payload: { name: string; email: string; password: string }) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),

  login: (payload: { email: string; password: string }) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),

  getMe: () => request("/auth/me"),
};

// ── Thumbnails ────────────────────────────────────────────────────────────────
export const thumbnailAPI = {
  generate: (payload: {
    title: string;
    style: string;
    aspect_ratio?: string;
    color_scheme?: string;
    user_prompt?: string;
  }) => request("/thumbnails/generate", { method: "POST", body: JSON.stringify(payload) }),

  getAll: (page = 1, limit = 12) =>
    request(`/thumbnails?page=${page}&limit=${limit}`),

  getById: (id: string) => request(`/thumbnails/${id}`),

  delete: (id: string) => request(`/thumbnails/${id}`, { method: "DELETE" }),
};
