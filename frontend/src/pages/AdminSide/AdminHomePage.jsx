import React from 'react';
import DashboardStats from '../../Components/AdminComponents/DashboardStats';
import styles from './AdminHomePage.module.css';

const AdminHomePage = () => {
  return (
    <div className={styles.homeContainer}>
      <DashboardStats />
    </div>
  );
};

export default AdminHomePage;