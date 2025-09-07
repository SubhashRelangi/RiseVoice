import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/UserSide/HomePage';
import TrackPage from './pages/UserSide/TrackPage';
import RaiseComplaintPage from './pages/UserSide/RaiseComplaintPage';
import ComplaintDetailsPage from './pages/UserSide/ComplaintDetailsPage';
import Navigation from './Components/Header';
import Footer from './Components/Footer';
import FloatingButton from './Components/FloatingButton';
import DepartmentsHomePage from './pages/DepartmentalSide/DepartmentsHomePage';
import DepartmentalComplaints from './pages/DepartmentalSide/DepartmentalComplaints';
import DepartmentalComplaintPage from './pages/DepartmentalSide/DepartmentalComplaintPage';
import DepartmentSignup from './pages/DepartmentalSide/DepartmentSignup';
import DepartmentVerify from './pages/DepartmentalSide/DepartmentVerify';
import DepartmentLogin from './pages/DepartmentalSide/DepartmentLogin';
import DepartmentProfile from './pages/DepartmentalSide/DepartmentProfile';
import ProtectedRoute from './Components/Auth/ProtectedRoute';
import axiosInstance from './axiosInstance';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initialize to false
  const location = useLocation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axiosInstance.get('/api/departments/checkAuth'); // Use the new endpoint
        if (response.status === 200 && response.data.isAuthenticated) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []); // Run once on component mount

  const departmentPrefixes = ['/department', '/raise-complaint'];

  const isDepartmentalRoute = departmentPrefixes.some(prefix =>
    location.pathname.startsWith(prefix)
  );

  return (
    <div>
      <Navigation isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/track" element={<TrackPage />} />
        <Route path="/raise-complaint" element={<RaiseComplaintPage />} />
        <Route path="/complaint/:id" element={<ComplaintDetailsPage />} />
        <Route path="/department/signup" element={<DepartmentSignup />} />
        <Route path="/department/verify" element={<DepartmentVerify setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/department/login" element={<DepartmentLogin setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/department" element={<ProtectedRoute><DepartmentsHomePage /></ProtectedRoute>} />
        <Route path="/department/complaints" element={<ProtectedRoute><DepartmentalComplaints /></ProtectedRoute>} />
        <Route path="/department/complaints/:id" element={<ProtectedRoute><DepartmentalComplaintPage /></ProtectedRoute>} />
        <Route path="/department/profile" element={<ProtectedRoute><DepartmentProfile /></ProtectedRoute>} />
      </Routes>
      {!isDepartmentalRoute && <FloatingButton />}
      <Footer />
    </div>
  );
};

export default App;