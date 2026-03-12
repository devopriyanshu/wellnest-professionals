import { secureAxios } from './authAxios';
import { APIENDPOINT } from './api';

/**
 * Fetch a patient's wellness logs.
 * Only allowed if the expert has at least one appointment with this user.
 * Backend returns 403 if no appointment relationship exists.
 */
export const fetchPatientLogs = async (userId) => {
  try {
    const res = await secureAxios.get(`${APIENDPOINT.LOGS_USER}/${userId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};
