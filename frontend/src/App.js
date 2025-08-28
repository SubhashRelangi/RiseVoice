import React from 'react'
import { Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import TrackPage from './pages/TrackPage';
import RaiseComplaintPage from './pages/RaiseComplaintPage';
import Navigation from './Components/Navigation';
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
      </Routes>
      <FloatingButton />
      <Footer />
    </div>
  )
}

export default App