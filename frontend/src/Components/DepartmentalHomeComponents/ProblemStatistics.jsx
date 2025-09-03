import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProblemStatistics.module.css';
import { FaChartBar, FaChartPie } from 'react-icons/fa';

const ProblemStatistics = () => {
  const [stats, setStats] = useState({
    resolved: 0,
    inProgress: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/problems/stats');
        // The API returns "Resloved" but the UI shows "Resolved"
        // Also, the image shows "Completed" but the API returns "In Progress" and "Pending"
        // I will map the API response to the UI labels.
        const apiStats = response.data;
        setStats({
          resolved: apiStats.resolved || 0,
          inProgress: apiStats.inProgress || 0,
          pending: apiStats.pending || 0, // Assuming "pending" should be "completed"
        });
      } catch (error) {
        console.error('Error fetching problem stats:', error);
      }
    };

    fetchStats();
  }, []);

  const totalProblems = stats.resolved + stats.inProgress + stats.pending;
  const resolvedPercentage = totalProblems > 0 ? Math.round((stats.resolved / totalProblems) * 100) : 0;
  const inProgressPercentage = totalProblems > 0 ? Math.round((stats.inProgress / totalProblems) * 100) : 0;
  const pendingPercentage = totalProblems > 0 ? Math.round((stats.pending / totalProblems) * 100) : 0;

  const pieChartStyle = {
    background: `conic-gradient(
      #28a745 0% ${resolvedPercentage}%,
      #ffc107 ${resolvedPercentage}% ${resolvedPercentage + inProgressPercentage}%,
      #17a2b8 ${resolvedPercentage + inProgressPercentage}% 100%
    )`,
  };

  return (
    <div className={styles.statsContainer}>
      <div className={styles.overallStats}>
        <h2>Overall Statistics</h2>
        <div className={styles.totalProblems}>{totalProblems}</div>
        <div className={styles.totalProblemsLabel}>Total Problems Tracked</div>
      </div>

      <div className={styles.chartsContainer}>
        <div className={styles.chartCard}>
          <h3><FaChartBar /> Problems by Status (Bar Chart)</h3>
          <div className={styles.barChart}>
            <div className={styles.barWrapper}>
              <div className={styles.bar} style={{ height: `${resolvedPercentage}%`, backgroundColor: '#28a745' }}></div>
              <div className={styles.barLabel}>Resolved</div>
            </div>
            <div className={styles.barWrapper}>
              <div className={styles.bar} style={{ height: `${inProgressPercentage}%`, backgroundColor: '#ffc107' }}></div>
              <div className={styles.barLabel}>InProgress</div>
            </div>
            <div className={styles.barWrapper}>
              <div className={styles.bar} style={{ height: `${pendingPercentage}%`, backgroundColor: '#17a2b8' }}></div>
              <div className={styles.barLabel}>Pending</div>
            </div>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3><FaChartPie /> Problems Distribution (Pie Chart)</h3>
          <div className={styles.pieChartContainer}>
            <div className={styles.pieChart} style={pieChartStyle}></div>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: '#28a745' }}></span>
                Resolved {resolvedPercentage}%
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: '#ffc107' }}></span>
                In Progress {inProgressPercentage}%
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: '#17a2b8' }}></span>
                Pending {pendingPercentage}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemStatistics;
