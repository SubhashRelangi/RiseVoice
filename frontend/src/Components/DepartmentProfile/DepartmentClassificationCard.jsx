import React from 'react';
import styles from './DepartmentClassificationCard.module.css';
import {
  FaWater,
  FaLightbulb,
  FaRoad,
  FaRecycle,
  FaHospital,
  FaGraduationCap,
  FaBus,
  FaSeedling,
  FaMoneyBillAlt,
  FaShieldAlt
} from 'react-icons/fa';

const departmentIconMap = {
  WATER: FaWater,
  ELECTRICITY: FaLightbulb,
  ROADS_INFRASTRUCTURE: FaRoad,
  WASTE_MANAGEMENT: FaRecycle,
  HEALTHCARE: FaHospital,
  EDUCATION: FaGraduationCap,
  TRANSPORT: FaBus,
  AGRICULTURE: FaSeedling,
  REVENUE: FaMoneyBillAlt,
  POLICE: FaShieldAlt,
};

const DepartmentClassificationCard = ({ departmentType, description }) => {
  const IconComponent = departmentIconMap[departmentType]  // Default to FaCalendarAlt if type not found

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.leftBorder}></div>
        <div className={styles.cardHeader}>
          <h3>Department Classification</h3>
        </div>
        <div className={styles.classificationItem}>
          <div className={styles.iconContainer}>
            <IconComponent className={styles.itemIcon} />
          </div>
          <div className={styles.textContainer}>
            <span className={styles.departmentType}>{departmentType}</span>
            <p className={styles.description}>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentClassificationCard;
