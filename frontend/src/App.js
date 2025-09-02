import React from 'react'
import { Routes, Route } from "react-router-dom";
import HomePage from './pages/UserSide/HomePage';
import LoginPage from './pages/LoginPage';
import TrackPage from './pages/UserSide/TrackPage';
import RaiseComplaintPage from './pages/UserSide/RaiseComplaintPage';
import ComplaintDetailsPage from './pages/UserSide/ComplaintDetailsPage';
import Navigation from './Components/Header';
import Footer from './Components/Footer';
import FloatingButton from './Components/FloatingButton';

const App = () => {
  return (
    <div>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/track" element={<TrackPage />} />
        <Route path="/raise-complaint" element={<RaiseComplaintPage />} />
        <Route path="/complaint/:id" element={<ComplaintDetailsPage />} />
        <Route path="/department" element={<ComplaintDetailsPage />} />
        <Route path="/department/complaints" element={<ComplaintDetailsPage />} />
        <Route path="/department/complaints/:id" element={<ComplaintDetailsPage />} />
      </Routes>
      <FloatingButton />
      <Footer />
    </div>
  )
}

export default App