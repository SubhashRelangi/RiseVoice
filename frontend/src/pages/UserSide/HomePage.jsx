import React from 'react'
import HeroSection from '../../Components/HomeComponents/HeroSection'
import Dashboard from '../../Components/HomeComponents/Dashboard'
import Departments from '../../Components/HomeComponents/Departments'
import Services from '../../Components/HomeComponents/Services'

const HomePage = () => {
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