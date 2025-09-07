import React, { useState, useEffect } from 'react';
import {
  FaBuilding,
  FaTint,
  FaCheckCircle,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaLightbulb,
  FaRoad,
  FaRecycle,
  FaHospital,
  FaGraduationCap,
  FaBus,
  FaSeedling,
  FaMoneyBillAlt,
} from 'react-icons/fa';
import styles from './DepartmentProfileCard.module.css';
import axios from 'axios';

const serviceTypeIconMap = {
  WATER: FaTint,
  ELECTRICITY: FaLightbulb,
  ROADS_INFRASTRUCTURE: FaRoad,
  WASTE_MANAGEMENT: FaRecycle,
  HEALTHCARE: FaHospital,
  EDUCATION: FaGraduationCap,
  TRANSPORT: FaBus,
  AGRICULTURE: FaSeedling,
  REVENUE: FaMoneyBillAlt,
  POLICE: FaShieldAlt, // Using FaShieldAlt for Police as it's already imported
};

const DepartmentProfileCard = ({ departmentName, serviceType, location, isActive, isVerified }) => {
  const [locationName, setLocationName] = useState('Loading location...');

  useEffect(() => {
    const fetchLocationName = async () => {
      if (location && location.latitude && location.longitude) {
        try {
          const { latitude, longitude } = location; // ✅ Use object
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            { withCredentials: false }
          );
          if (response.data.display_name) {
            setLocationName(response.data.display_name);
          } else {
            setLocationName('Location not found');
          }
        } catch (error) {
          console.error('Error fetching location name:', error);
          setLocationName('Error loading location');
        }
      } else {
        setLocationName('Location not available');
      }
    };

    fetchLocationName();
  }, [location]);

  const ServiceIconComponent = serviceTypeIconMap[serviceType] || FaBuilding; // Default to FaBuilding if type not found

  return (
    <div className={styles.card}>
      <div className={styles.leftBorder}></div>
      <div className={styles.content}>
        <div className={styles.header}>
          <FaBuilding className={styles.icon} />
          <h2 className={styles.departmentName}>{departmentName}</h2>
        </div>
        <div className={styles.serviceType}>
          <ServiceIconComponent className={styles.icon} />
          {serviceType}
        </div>
        <div className={styles.location}>
          <FaMapMarkerAlt className={styles.icon} />
          {locationName}
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
