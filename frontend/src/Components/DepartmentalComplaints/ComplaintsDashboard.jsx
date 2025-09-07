
import React, { useState, useEffect } from 'react';
import styles from './ComplaintsDashboard.module.css';
import { FaFilter, FaSearch, FaMapMarkerAlt, FaExclamationTriangle, FaClock, FaCheckCircle } from 'react-icons/fa';
import axiosInstance from '../../axiosInstance';

const ComplaintsDashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [address, setAddress] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [departmentType, setDepartmentType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, profileResponse] = await Promise.all([
          axiosInstance.get('/api/problems/stats'),
          axiosInstance.get('/api/departments/profile'),
        ]);

        const statsData = statsResponse.data;
        setStats({
          total: statsData.resolved + statsData.inProgress + statsData.pending,
          resolved: statsData.resolved,
          inProgress: statsData.inProgress,
          pending: statsData.pending,
        });

        const profileData = profileResponse.data;
        setDepartmentName(profileData.name);
        setDepartmentType(profileData.serviceType);

        if (profileData.location) {
          const { latitude, longitude } = profileData.location;
          const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const geoData = await geoResponse.json();
          setAddress(geoData.display_name);
        }

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Complaints Dashboard</h1>
        <p>Managing complaints for {departmentName} ({departmentType}) within 3km radius</p>
        {address && (
          <div className={styles.location}>
            <FaMapMarkerAlt />
            <span>{address}</span>
          </div>
        )}
      </div>

      <div className={styles.filters}>
        <div className={styles.filterHeader}>
          <FaFilter />
          <h2>Filters</h2>
        </div>
        <div className={styles.filterControls}>
          <div className={styles.search}>
            <FaSearch />
            <input type="text" placeholder="Search complaints..." />
          </div>
          <select>
            <option>All Status</option>
          </select>
          
          <div className={styles.radius}>
            <span>Within 3km</span>
          </div>
          <span className={styles.complaintsFound}>{stats.total} complaints found</span>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <div className={styles.summary}>
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon} style={{ color: '#E74C3C' }}>
              <FaExclamationTriangle />
            </div>
            <div className={styles.cardContent}>
              <p>Total Complaints</p>
              <span>{stats.total}</span>
            </div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon} style={{ color: '#F1C40F' }}>
              <FaClock />
            </div>
            <div className={styles.cardContent}>
              <p>Pending</p>
              <span>{stats.pending}</span>
            </div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon} style={{ color: '#E67E22' }}>
              <FaExclamationTriangle />
            </div>
            <div className={styles.cardContent}>
              <p>In Progress</p>
              <span>{stats.inProgress}</span>
            </div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon} style={{ color: '#2ECC71' }}>
              <FaCheckCircle />
            </div>
            <div className={styles.cardContent}>
              <p>Resolved</p>
              <span>{stats.resolved}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsDashboard;
