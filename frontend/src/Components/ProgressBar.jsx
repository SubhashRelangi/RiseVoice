import React from 'react';
import styles from './ProgressBar.module.css';

const ProgressBar = ({ status }) => {
  const statuses = ["Pending", "In Progress", "Resolved"];
  const currentStatusIndex = statuses.findIndex(s => s.toLowerCase() === status.toLowerCase().replace(/-/g, ' '));

  return (
    <div className={styles.progressBarContainer}>
      <ul className={styles.progressBar}>
        {statuses.map((s, index) => (
          <li key={s} className={`${styles.progressBarItem} ${index <= currentStatusIndex ? styles.active : ''}`}>
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressBar;
