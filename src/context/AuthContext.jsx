import React, { createContext, useState, useEffect, useContext } from 'react';
import api, { setAccessToken as setAxiosToken } from '../lib/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('refreshToken');
      if (storedToken) {
        try {
          const { data } = await api.post('/api/auth/refresh', { refreshToken: storedToken });
          setAxiosToken(data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          decodeAndSetUser(data.accessToken);
        } catch (e) {
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const decodeAndSetUser = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      setUser(JSON.parse(jsonPayload));
    } catch(e) {
      setUser(null);
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    setAxiosToken(data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    decodeAndSetUser(data.accessToken);
  };

  const logout = async () => {
    const storedToken = localStorage.getItem('refreshToken');
    if (storedToken) {
      await api.post('/api/auth/logout', { refreshToken: storedToken }).catch(()=>null);
    }
    setAxiosToken(null);
    setUser(null);
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
