import React from 'react'
import '../../StyleSheets/HomeStyles/Dashboard.css'

const Dashboard = () => {
    return (
        <div className='DashboardDiv'>
            <div className='DashboardContainer'>
                <div className='DashboardContent'>
                    <h1 className='Heading'>5000+</h1>
                    <p className='Para'>Problems</p>
                </div>
                <div className='DashboardContent'>
                    <h1 className='Heading'>2500+</h1>
                    <p className='Para'>Sloved</p>
                </div>
                <div className='DashboardContent'>
                    <h1 className='Heading'>600+</h1>
                    <p className='Para'>In-Progess</p>
                </div>
                <div className='DashboardContent'>
                    <h1 className='Heading'>1500+</h1>
                    <p className='Para'>Today Raised</p>
                </div>
            </div>
        </div>
    )
}

export default Dashboard

