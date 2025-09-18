import React from 'react';
import styles from './GenericSkeletonLoader.module.css';

const GenericSkeletonLoader = ({ type = 'default', count = 1, height }) => {
  const renderSkeleton = () => {
    const skeletonStyle = height ? { height } : {};

    switch (type) {
      case 'card':
        return (
          <div className={styles.skeletonCard} style={skeletonStyle}>
            <div className={styles.skeletonHeader}></div>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLine} style={{ width: '80%' }}></div>
          </div>
        );
      case 'list-item':
        return (
          <div className={styles.skeletonListItem} style={skeletonStyle}>
            <div className={styles.skeletonAvatar}></div>
            <div className={styles.skeletonContent}>
              <div className={styles.skeletonLine}></div>
              <div className={styles.skeletonLine} style={{ width: '70%' }}></div>
            </div>
          </div>
        );
      case 'text-block':
        return (
          <div className={styles.skeletonTextBlock} style={skeletonStyle}>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLine} style={{ width: '90%' }}></div>
            <div className={styles.skeletonLine} style={{ width: '60%' }}></div>
          </div>
        );
      case 'dashboard-stats':
        return (
          <div className={styles.skeletonDashboardStats} style={skeletonStyle}>
            {[...Array(count)].map((_, i) => (
              <div key={i} className={styles.skeletonStatCard}></div>
            ))}
          </div>
        );
      case 'map':
        return <div className={styles.skeletonMap} style={skeletonStyle}></div>;
      case 'charts':
        return (
          <div className={styles.skeletonCharts} style={skeletonStyle}>
            {[...Array(count)].map((_, i) => (
              <div key={i} className={styles.skeletonChartCard}></div>
            ))}
          </div>
        );
      case 'department-profile':
        return (
          <div className={styles.skeletonDepartmentProfile} style={skeletonStyle}>
            <div className={styles.skeletonProfileCard}></div>
            <div className={styles.skeletonDetailsCard}></div>
            <div className={styles.skeletonAuditCard}></div>
            <div className={styles.skeletonClassificationCard}></div>
          </div>
        );
      default:
        return (
          <div className={styles.skeletonDefault} style={skeletonStyle}>
            <div className={styles.skeletonHeader}></div>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLine} style={{ width: '70%' }}></div>
          </div>
        );
    }
  };

  return <>{renderSkeleton()}</>;
};

export default GenericSkeletonLoader;