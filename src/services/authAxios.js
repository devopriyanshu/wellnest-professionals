import axios from 'axios';
import { API_BASE_URL } from './api';

// ─── Public Axios (no auth) ───────────────────────────────────────────────
export const publicAxios = axios.create({
  baseURL: API_BASE_URL,
});

publicAxios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status !== 404) {
      console.error('[Public API Error]', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

// ─── Secure Axios (JWT Bearer) ────────────────────────────────────────────
export const secureAxios = axios.create({
  baseURL: API_BASE_URL,
});

secureAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pro_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

secureAxios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 404 is often expected (e.g. checking if profile exists), so don't log it universally
    if (error.response?.status !== 404) {
      console.error('[Secure API Error]', error.response?.data || error.message);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('pro_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
