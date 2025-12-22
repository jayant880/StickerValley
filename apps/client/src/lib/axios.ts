import axios from 'axios';

declare global {
    interface Window {
        Clerk: unknown;
    }
}

export const api = axios.create({
    baseURL: (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '') + '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const token = await (window.Clerk as any)?.session?.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error(error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);
