import { publicAxios, secureAxios } from './authAxios';
import { APIENDPOINT } from './api';

// Fetch MY center profile (linked to logged-in token)
export const fetchMyCenterProfile = async () => {
  try {
    const res = await secureAxios.get(APIENDPOINT.CENTERS_ME);
    return res.data;
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw error.response?.data?.error || error.message;
  }
};

export const fetchCenterDetails = async (id) => {
  try {
    const response = await publicAxios.get(`${APIENDPOINT.CENTERS_DETAIL}/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const registerCenter = async (formData) => {
  try {
    const response = await secureAxios.post(APIENDPOINT.CENTERS_REGISTER, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const updateCenter = async (id, data) => {
  try {
    const response = await secureAxios.put(`${APIENDPOINT.CENTERS_DETAIL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};
