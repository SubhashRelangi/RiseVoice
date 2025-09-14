import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const nonAuthRoutes = ['/', '/track', '/department/login', '/admin/login'];
    if (nonAuthRoutes.includes(location.pathname)) {
      setLoadingAuth(false);
      return;
    }

    const checkAdminAuth = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/auth/check');
        if (response.status === 200 && response.data.isAuthenticated) {
          setIsAdminAuthenticated(true);
        } else {
          setIsAdminAuthenticated(false);
        }
      } catch (error) {
        console.error('Admin authentication check failed:', error);
        setIsAdminAuthenticated(false);
      } finally {
        setLoadingAuth(false);
      }
    };
    checkAdminAuth();
  }, [location.pathname]);

  const value = {
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    loadingAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};