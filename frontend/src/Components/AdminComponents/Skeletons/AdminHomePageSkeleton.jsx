import React from 'react';
import styles from './AdminHomePageSkeleton.module.css';

const AdminHomePageSkeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.statsSection}>
        <div className={styles.statCard}></div>
        <div className={styles.statCard}></div>
        <div className={styles.statCard}></div>
      </div>
      <div className={styles.mapSection}></div>
      <div className={styles.chartsSection}>
        <div className={styles.chartCard}></div>
        <div className={styles.chartCard}></div>
      </div>
    </div>
  );
};

export default AdminHomePageSkeleton;