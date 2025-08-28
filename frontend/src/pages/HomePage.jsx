import React from 'react'
import Navigation from '../Components/Navigation'
import HeroSection from '../Components/HomePageComponents/HeroSection'
import Dashboard from '../Components/HomePageComponents/Dashboard'
import Departments from '../Components/HomePageComponents/Departments'

const HomePage = () => {
  return (
    <div>
      <Navigation />
      <HeroSection />
      <Dashboard />
      <Departments />
    </div>
  )
}

export default HomePage