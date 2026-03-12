import { secureAxios } from './authAxios';
import { APIENDPOINT } from './api';

export const fetchExpertAppointments = async (expertId) => {
  try {
    const res = await secureAxios.get(`${APIENDPOINT.APPOINTMENTS}/expert/${expertId}`);
    return res.data || [];
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const updateAppointmentStatus = async (id, status) => {
  try {
    const res = await secureAxios.patch(`${APIENDPOINT.APPOINTMENTS}/${id}/status`, { status });
    return res.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const deleteAppointment = async (id) => {
  try {
    const res = await secureAxios.delete(`${APIENDPOINT.APPOINTMENTS}/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};
