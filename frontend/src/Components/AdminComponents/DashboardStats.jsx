import React, { useState, useEffect } from 'react';
import SummaryCard from './SummaryCard';
import styles from './DashboardStats.module.css';
import { FaCheck, FaHourglassHalf, FaTimes } from 'react-icons/fa';
import axiosInstance from '../../axiosInstance';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    active: { count: 0, percentage: 0 },
    pending: { count: 0, percentage: 0 },
    rejected: { count: 0, percentage: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/stats');
        setStats(response.data);
      } catch (err) {
        setError('Failed to fetch stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p>Loading stats...</p>;
  }

  if (error) {
    return <p>{error}</p>;
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
