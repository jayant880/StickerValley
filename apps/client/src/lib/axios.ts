import axios from "axios";

declare global {
  interface Window {
    Clerk: any;
  }
}

export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "") + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error(error);
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });