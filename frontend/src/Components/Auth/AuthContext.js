import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        // This endpoint would ideally check if the admin's JWT is valid
        // For now, we'll assume a successful call means authenticated
        const response = await axiosInstance.get('/api/admin/auth/check'); // Need to create this endpoint
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
  }, []);

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