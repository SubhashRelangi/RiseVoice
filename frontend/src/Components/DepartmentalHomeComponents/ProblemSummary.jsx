import React from 'react';
import styles from './ProblemSummary.module.css';

const ProblemSummary = ({ problems }) => {
  const resolvedProblems = problems.filter(problem => problem.status === 'Resolved' || problem.status === 'Resloved');
  const inProgressProblems = problems.filter(problem => problem.status === 'In Progress');
  const pendingProblems = problems.filter(problem => problem.status === 'Pending');

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.summaryItem}>
        <span className={`${styles.colorBox} ${styles.resolved}`}></span>
        Resolved ({resolvedProblems.length})
      </div>
      <div className={styles.summaryItem}>
        <span className={`${styles.colorBox} ${styles.inProgress}`}></span>
        In Progress ({inProgressProblems.length})
      </div>
      <div className={styles.summaryItem}>
        <span className={`${styles.colorBox} ${styles.Pending}`}></span>
        Pending ({pendingProblems.length})
      </div>
    </div>
  );
};

export default ProblemSummary;
