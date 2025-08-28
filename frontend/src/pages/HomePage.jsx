import React from 'react'
import Navigation from '../Components/Navigation'
import HeroSection from '../Components/HomePageComponents/HeroSection'
import Dashboard from '../Components/HomePageComponents/Dashboard'

const HomePage = () => {
  return (
    <div>
      <Navigation />
      <HeroSection />
      <Dashboard />
    </div>
  )
}

export default HomePage