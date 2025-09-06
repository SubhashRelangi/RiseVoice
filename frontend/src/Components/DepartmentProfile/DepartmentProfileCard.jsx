import React from 'react';
import { FaBuilding, FaTint, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';
import styles from './DepartmentProfileCard.module.css';

const DepartmentProfileCard = ({ departmentName, serviceType, isActive, isVerified }) => {
  return (
    <div className={styles.card}>
      <div className={styles.leftBorder}></div>
      <div className={styles.content}>
        <div className={styles.header}>
          <FaBuilding className={styles.icon} />
          <h2 className={styles.departmentName}>{departmentName}</h2>
        </div>
        <div className={styles.serviceType}>
          <FaTint className={styles.icon} />
          {serviceType}
        </div>
      </div>
      <div className={styles.statusTags}>
        {isActive && (
          <div className={`${styles.tag} ${styles.activeTag}`}>
            <FaCheckCircle className={styles.tagIcon} /> Active
          </div>
        )}
        {isVerified && (
          <div className={`${styles.tag} ${styles.verifiedTag}`}>
            <FaShieldAlt className={styles.tagIcon} /> Verified
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentProfileCard;
