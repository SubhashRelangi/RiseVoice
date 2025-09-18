import React from 'react';
import styles from './DepartmentHomePageSkeleton.module.css';

const DepartmentHomePageSkeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.dashboardSection}></div>
      <div className={styles.mapSection}></div>
      <div className={styles.listSection}></div>
      <div className={styles.statsSection}></div>
      <div className={styles.summarySection}></div>
    </div>
  );
};

export default DepartmentHomePageSkeleton;