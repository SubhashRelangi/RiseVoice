import React from 'react'
import { Routes, Route, useLocation } from "react-router-dom";
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

const App = () => {

  const location = useLocation();
  const departmentPrefixes = ['/department', '/raise-complaint'];

  const isDepartmentalRoute = departmentPrefixes.some(prefix =>
    location.pathname.startsWith(prefix)
  );

  return (
    <div>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/track" element={<TrackPage />} />
        <Route path="/raise-complaint" element={<RaiseComplaintPage />} />
        <Route path="/complaint/:id" element={<ComplaintDetailsPage />} />
        <Route path="/department" element={<DepartmentsHomePage />} />
        <Route path="/department/complaints" element={<DepartmentalComplaints />} />
        <Route path="/department/complaints/:id" element={<DepartmentalComplaintPage />} />
        <Route path="/department/signup" element={<DepartmentSignup />} />
        <Route path="/department/verify" element={<DepartmentVerify />} />
        <Route path="/department/login" element={<DepartmentLogin />} />
      </Routes>
      {!isDepartmentalRoute && <FloatingButton />}
      <Footer />
    </div>
  )
}

export default App