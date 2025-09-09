
import React, { useState, useEffect } from 'react';
import styles from './ComplaintsDashboard.module.css';
import { FaFilter, FaSearch, FaMapMarkerAlt, FaExclamationTriangle, FaClock, FaCheckCircle } from 'react-icons/fa';
import axiosInstance from '../../axiosInstance';

const ComplaintsDashboard = ({
  departmentLocation,
  departmentName,
  departmentType,
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  selectedRadius,
  setSelectedRadius,
  stats, // Receive stats as prop
}) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        if (departmentLocation) {
          const { latitude, longitude } = departmentLocation;
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

    fetchAddress();
  }, [departmentLocation]); // Re-run when departmentLocation changes

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Complaints Dashboard</h1>
        <p>Managing complaints for {departmentName} ({departmentType}) within {selectedRadius}km radius</p>
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
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
          
          <select
            className={styles.radius}
            value={selectedRadius}
            onChange={(e) => setSelectedRadius(e.target.value)}
          >
            <option value="3">Within 3km</option>
            <option value="2">Within 2km</option>
            <option value="1">Within 1km</option>
          </select>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && ( // Only render summary if not loading and no error
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
