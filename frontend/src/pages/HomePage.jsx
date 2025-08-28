import React from 'react'
import Navigation from '../Components/Navigation'
import HeroSection from '../Components/HomePageComponents/HeroSection'
import Dashboard from '../Components/HomePageComponents/Dashboard'
import Departments from '../Components/HomePageComponents/Departments'
import Services from '../Components/HomePageComponents/Services'

const HomePage = () => {
  return (
    <div>
      <Navigation />
      <HeroSection />
      <Dashboard />
      <Departments />
      <Services />
    </div>
  )
}

export default HomePage