import React from 'react';
import DashboardStats from '../../Components/AdminComponents/DashboardStats';
import DepartmentMap from '../../Components/AdminComponents/DepartmentMap';
import styles from './AdminHomePage.module.css';

const AdminHomePage = () => {
  return (
    <div className={styles.homeContainer}>
      <DashboardStats />
      <DepartmentMap />
    </div>
  );
};

export default AdminHomePage;