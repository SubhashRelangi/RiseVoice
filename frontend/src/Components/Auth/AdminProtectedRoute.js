import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Assuming you'll create an AuthContext for admin

const AdminProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated } = useAuth(); // This will come from your AuthContext

  if (!isAdminAuthenticated) {
    // Redirect them to the /admin/login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them along
    // to that page after they login, which is a nicer user experience
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;