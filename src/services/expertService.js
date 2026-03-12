import { publicAxios, secureAxios } from './authAxios';
import { APIENDPOINT } from './api';

// Fetch MY expert profile (linked to logged-in token)
export const fetchMyExpertProfile = async () => {
  try {
    const res = await secureAxios.get(APIENDPOINT.EXPERTS_ME);
    return res.data;
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw error.response?.data?.error || error.message;
  }
};

export const fetchExpertsList = async (search, category, sortBy, page = 1, limit = 10) => {
  try {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (sortBy) params.sortBy = sortBy;
    params.page = page;
    params.limit = limit;
    const response = await publicAxios.get(APIENDPOINT.EXPERTS_LIST, { params });
    return response.data || [];
  } catch (error) {
    return [];
  }
};

export const fetchExpertDetails = async (id) => {
  try {
    const response = await publicAxios.get(`${APIENDPOINT.EXPERTS_DETAIL}/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const registerExpert = async (formData) => {
  try {
    const response = await publicAxios.post(APIENDPOINT.EXPERTS_REGISTER, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const updateExpert = async (id, data) => {
  try {
    const response = await secureAxios.put(`${APIENDPOINT.EXPERTS_DETAIL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};
