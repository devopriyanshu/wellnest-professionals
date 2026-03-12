import { createContext, useContext, useEffect, useState } from 'react';
import { login as loginApi, signup as signupApi, getUserMe } from '../services/authService.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('pro_token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const userData = await getUserMe();
      setUser(userData);
    } catch (e) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { token: newToken, user: userData } = await loginApi(email, password);

      // ── Role enforcement ──────────────────────────────────────────────
      const selectedRole = sessionStorage.getItem('selectedRole');
      if (selectedRole && userData.role !== selectedRole) {
        setLoading(false);
        throw new Error(
          `This account is registered as "${userData.role}", not "${selectedRole}". Please select the correct role.`
        );
      }

      // Block regular users entirely
      if (!['expert', 'center'].includes(userData.role)) {
        setLoading(false);
        throw new Error('This portal is for Experts and Centers only.');
      }

      localStorage.setItem('pro_token', newToken);
      setToken(newToken);
      return userData;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signup = async (email, password, role) => {
    if (!['expert', 'center'].includes(role)) {
      throw new Error('Invalid role. Must be expert or center.');
    }
    try {
      const data = await signupApi(email, password, role);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('pro_token');
    sessionStorage.removeItem('selectedRole');
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  const isExpert = () => user?.role === 'expert';
  const isCenter = () => user?.role === 'center';

  return (
    <AuthContext.Provider value={{ token, user, login, signup, logout, loading, isExpert, isCenter, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
