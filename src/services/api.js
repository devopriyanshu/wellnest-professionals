// API Configuration
const API_VERSION = '/api/v1';
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
export const API_BASE_URL = `${BASE_URL}${API_VERSION}`;

export const APIENDPOINT = {
  // Auth
  LOGIN: 'auth/login',
  SIGNUP: 'auth/signup',
  GOOGLE_AUTH: 'auth/google',
  LOGOUT: 'auth/logout',

  // Users (Using the new auth/me for professional portal)
  GET_USER_ME: 'auth/me',

  // Experts
  EXPERTS_ME: 'experts/me',
  EXPERTS_LIST: 'experts/list',
  EXPERTS_DETAIL: 'experts',
  EXPERTS_REGISTER: 'experts/register',

  // Centers
  CENTERS_ME: 'centers/me',
  CENTERS_LIST: 'centers',
  CENTERS_DETAIL: 'centers',
  CENTERS_REGISTER: 'centers/register',

  // Appointments
  APPOINTMENTS: 'appointments',

  // Logs
  LOGS_DASHBOARD: 'logs/dashboard',
  LOGS_USER: 'logs/user',    // Expert-only: GET /logs/user/:userId
};
