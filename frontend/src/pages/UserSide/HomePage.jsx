import React, { useEffect } from 'react'
import HeroSection from '../../Components/HomeComponents/HeroSection'
import Dashboard from '../../Components/HomeComponents/Dashboard'
import Departments from '../../Components/HomeComponents/Departments'
import Services from '../../Components/HomeComponents/Services'
import { useLocation } from 'react-router-dom';

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.sectionId) {
      const section = document.getElementById(location.state.sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.state]);

  return (
    <div>
      <HeroSection />
      <Dashboard />
      <Departments />
      <Services />
    </div>
  )
}

export default HomePage
