import { publicAxios, secureAxios } from './authAxios';
import { APIENDPOINT } from './api';

export const signup = async (email, password, role) => {
  try {
    const response = await publicAxios.post(APIENDPOINT.SIGNUP, { email, password, role });
    return response;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const login = async (email, password) => {
  try {
    const response = await publicAxios.post(APIENDPOINT.LOGIN, { email, password });
    return response;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getUserMe = async () => {
  try {
    const res = await secureAxios.get(APIENDPOINT.GET_USER_ME);
    return res.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};
