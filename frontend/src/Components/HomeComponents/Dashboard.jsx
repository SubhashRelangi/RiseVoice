import React from 'react'
import styles from './Dashboard.module.css'

const Dashboard = () => {
    return (
        <div className={styles.DashboardDiv}>
            <div className={styles.DashboardContainer}>
                <div className={styles.DashboardContent}>
                    <h1 className={styles.Heading}>5000+</h1>
                    <p className={styles.Para}>Problems</p>
                </div>
                <div className={styles.DashboardContent}>
                    <h1 className={styles.Heading}>2500+</h1>
                    <p className={styles.Para}>Sloved</p>
                </div>
                <div className={styles.DashboardContent}>
                    <h1 className={styles.Heading}>600+</h1>
                    <p className={styles.Para}>In-Progress</p>
                </div>
                <div className={styles.DashboardContent}>
                    <h1 className={styles.Heading}>1500+</h1>
                    <p className={styles.Para}>Today Raised</p>
                </div>
            </div>
        </div>
    )
}

export default Dashboard

