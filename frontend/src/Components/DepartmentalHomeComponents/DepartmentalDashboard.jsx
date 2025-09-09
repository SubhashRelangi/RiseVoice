import React from 'react';
import styles from './DepartmentalDashboard.module.css';
import { FaCheckCircle, FaHourglassHalf, FaExclamationCircle } from 'react-icons/fa';

const DepartmentalDashboard = ({ stats }) => {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1>Empowering Change, One Resolution at a Time.</h1>
        <p>Track and monitor department problems across all locations in real-time</p>
      </div>
      <div className={styles.dashboardGrid}>
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <span>Resolved</span>
            <FaCheckCircle className={styles.resolvedIcon} />
          </div>
          <div className={styles.cardBody}>
            <p>{stats.resolved}</p>
          </div>
        </div>
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <span>In Progress</span>
            <FaHourglassHalf className={styles.inProgressIcon} />
          </div>
          <div className={styles.cardBody}>
            <p>{stats.inProgress}</p>
          </div>
        </div>
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <span>Pending</span>
            <FaExclamationCircle className={styles.completedIcon} />
          </div>
          <div className={styles.cardBody}>
            <p>{stats.pending}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentalDashboard;
