import React from 'react'
import Navigation from '../Components/Navigation'
import HeroSection from '../Components/HomePageComponents/HeroSection'
import Dashboard from '../Components/HomePageComponents/Dashboard'
import Departments from '../Components/HomePageComponents/Departments'
import Services from '../Components/HomePageComponents/Services'
import Footer from '../Components/Footer'

const HomePage = () => {
  return (
    <div>
      <Navigation />
      <HeroSection />
      <Dashboard />
      <Departments />
      <Services />
      <Footer />
    </div>
  )
}

export default HomePage