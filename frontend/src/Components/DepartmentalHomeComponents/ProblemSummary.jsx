import React from 'react';
import styles from './ProblemSummary.module.css';

const ProblemSummary = ({ problems }) => {
  const resolvedProblems = problems.filter(problem => problem.status === 'Resolved' || problem.status === 'Resloved');
  const inProgressProblems = problems.filter(problem => problem.status === 'In Progress' || problem.status === 'In Progress');
  const pendingProblems = problems.filter(problem => problem.status === 'Pending' || problem.status === 'Pending');

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.summaryItem}>
        <span className={`${styles.colorBox} ${styles.resolved}`}></span>
        Resolved ({resolvedProblems.length})
        <ul className={styles.problemList}>
          {resolvedProblems.map(problem => (
            <li key={problem._id}>{problem.title}</li>
          ))}
        </ul>
      </div>
      <div className={styles.summaryItem}>
        <span className={`${styles.colorBox} ${styles.inProgress}`}></span>
        In Progress ({inProgressProblems.length})
        <ul className={styles.problemList}>
          {inProgressProblems.map(problem => (
            <li key={problem._id}>{problem.title}</li>
          ))}
        </ul>
      </div>
      <div className={styles.summaryItem}>
        <span className={`${styles.colorBox} ${styles.Pending}`}></span>
        Pending ({pendingProblems.length})
        <ul className={styles.problemList}>
          {pendingProblems.map(problem => (
            <li key={problem._id}>{problem.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProblemSummary;
