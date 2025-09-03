import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProblemSummary.module.css';

const ProblemSummary = () => {
  const [stats, setStats] = useState({
    resolved: 0,
    inProgress: 0,
    Pending: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/problems/stats');
        const apiStats = response.data;
        setStats({
          resolved: apiStats.resolved || 0,
          inProgress: apiStats.inProgress || 0,
          Pending: apiStats.pending || 0, // Assuming "pending" from API maps to "completed"
        });
      } catch (error) {
        console.error('Error fetching problem stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.summaryItem}>
        <span className={`${styles.colorBox} ${styles.resolved}`}></span>
        Resolved ({stats.resolved})
      </div>
      <div className={styles.summaryItem}>
        <span className={`${styles.colorBox} ${styles.inProgress}`}></span>
        In Progress ({stats.inProgress})
      </div>
      <div className={styles.summaryItem}>
        <span className={`${styles.colorBox} ${styles.Pending}`}></span>
        Pending ({stats.Pending})
      </div>
    </div>
  );
};

export default ProblemSummary;
