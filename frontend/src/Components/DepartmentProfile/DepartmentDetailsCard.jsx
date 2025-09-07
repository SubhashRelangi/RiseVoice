
import React from 'react';
import styles from './DepartmentDetailsCard.module.css';
import { MdEmail, MdLocationOn, MdOutlineAccessTime, MdCheckCircleOutline, MdOutlineVerified, MdOutlineAccountCircle } from 'react-icons/md';
import { FaRegEnvelope, FaMapMarkerAlt, FaClock, FaCheckCircle, FaChartLine } from 'react-icons/fa';

const DepartmentDetailsCard = ({ departmentId, email, locationCoords, lastLogin, departmentStatus, verificationStatus }) => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <FaRegEnvelope className={styles.headerIcon} />
          <h3>Contact Information</h3>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.detailItem}>
            <span className={styles.label}>Department ID</span>
            <span className={styles.value}>{departmentId}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Email Address</span>
            <span className={styles.value}>{email}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Location Coordinates</span>
            <span className={styles.value}><FaMapMarkerAlt className={styles.inlineIcon} /> {locationCoords}</span>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <FaChartLine className={styles.headerIcon} />
          <h3>Activity & Status</h3>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.detailItem}>
            <span className={styles.label}>Last Login</span>
            <span className={styles.value}><FaClock className={styles.inlineIcon} /> {lastLogin}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Department Status</span>
            <span className={styles.value}><FaCheckCircle className={`${styles.inlineIcon} ${departmentStatus === 'Active' ? styles.statusActive : styles.statusInactive}`} /> {departmentStatus}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Verification Status</span>
            <span className={styles.value}><FaCheckCircle className={`${styles.inlineIcon} ${verificationStatus === 'Verified' ? styles.statusVerified : styles.statusUnverified}`} /> {verificationStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetailsCard;
