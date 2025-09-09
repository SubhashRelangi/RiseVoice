import React from 'react';
import styles from './ProblemStatistics.module.css';
import { FaChartBar, FaChartPie } from 'react-icons/fa';

const ProblemStatistics = ({ problems }) => {
  const stats = {
    resolved: problems.filter(p => p.status === 'Resolved' || p.status === 'Resloved').length,
    inProgress: problems.filter(p => p.status === 'In Progress' || p.status === 'In Progress').length,
    pending: problems.filter(p => p.status === 'Pending' || p.status === 'Pending').length,
  };

  const totalProblems = problems.length;
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
