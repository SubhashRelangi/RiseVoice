import React from 'react';
import SummaryCard from './SummaryCard';
import styles from './DashboardStats.module.css';
import { FaCheck, FaHourglassHalf, FaTimes } from 'react-icons/fa';

const DashboardStats = ({ stats }) => {

  if (!stats) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
      <p>Loading stats...</p>
    </div>;
  }

  return (
    <div className={styles.statsContainer}>
      <SummaryCard
        title="Active Departments"
        count={stats.active.count}
        percentage={stats.active.percentage}
        icon={<FaCheck />}
        color="#28a745"
        percentageColor={stats.active.percentage >= 0 ? 'green' : 'red'}
      />
      <SummaryCard
        title="Pending Departments"
        count={stats.pending.count}
        percentage={stats.pending.percentage}
        icon={<FaHourglassHalf />}
        color="#ffc107"
        percentageColor={stats.pending.percentage >= 0 ? 'green' : 'red'}
      />
      <SummaryCard
        title="Rejected Departments"
        count={stats.rejected.count}
        percentage={stats.rejected.percentage}
        icon={<FaTimes />}
        color="#dc3545"
        percentageColor={stats.rejected.percentage >= 0 ? 'green' : 'red'}
      />
    </div>
  );
};

export default DashboardStats;