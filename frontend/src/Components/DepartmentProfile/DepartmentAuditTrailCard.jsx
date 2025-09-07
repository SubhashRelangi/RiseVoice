import React from 'react';
import styles from './DepartmentAuditTrailCard.module.css';
import { FaCalendarAlt } from 'react-icons/fa';

const DepartmentAuditTrailCard = ({ createdDate, lastUpdatedDate }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <FaCalendarAlt className={styles.headerIcon} />
        <h3>Audit Trail</h3>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.detailItem}>
          <span className={styles.label}>Created</span>
          <span className={styles.value}>{createdDate}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>Last Updated</span>
          <span className={styles.value}>{lastUpdatedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default DepartmentAuditTrailCard;
