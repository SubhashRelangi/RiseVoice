import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './DepartmentDetailsPage.module.css';
import axiosInstance from '../../axiosInstance';
import { FaBuilding, FaEnvelope, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaClock, FaLightbulb, FaTrash, FaLock, FaShieldAlt, FaUnlock } from 'react-icons/fa'; // Import FaUnlock

const DepartmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axiosInstance.get(`/api/admin/department/${id}`);
        setDepartment(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  const handleRemove = async () => {
    if (window.confirm('Are you sure you want to remove this department?')) {
      try {
        await axiosInstance.delete(`/api/admin/department/${id}`);
        navigate('/admin/departments');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleLockToggle = async () => { // Renamed to handleLockToggle
    try {
      let response;
      if (department.status === 'locked') {
        response = await axiosInstance.put(`/api/admin/department/${id}/unlock`);
      } else {
        response = await axiosInstance.put(`/api/admin/department/${id}/lock`);
      }
      setDepartment(response.data.department);
    } catch (err) {
      setError(err.message);
    }
  };

  const getFullAddress = (address) => {
    if (!address) return 'N/A';
    const parts = [address.road, address.city, address.state, address.postcode, address.country];
    return parts.filter(Boolean).join(', ');
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!department) {
    return <div>Department not found</div>;
  }

  const isLocked = department.status === 'locked';

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcons}>
            <FaBuilding />
            <FaLightbulb />
            <FaMapMarkerAlt />
          </div>
          <div>
            <h1>{department.departmentName}</h1>
            <p className={styles.departmentType}>{department.departmentType}</p>
            <p className={styles.address}>{getFullAddress(department.address)}</p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.statusBadgesContainer}>
            <span className={`${styles.statusBadge} ${styles[department.status]}`}><FaCheckCircle /> {department.status === 'approved' ? 'Active' : department.status}</span>
            {department.isVerified && <span className={`${styles.statusBadge} ${styles.verified}`}><FaShieldAlt /> Verified</span>}
          </div>
        </div>
      </header>

      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}><FaEnvelope /> Contact Information</h2>
          <div className={styles.infoGrid}>
            <div>
              <label>Department ID</label>
              <p>{department.departmentId}</p>
            </div>
            <div>
              <label>Email Address</label>
              <p>{department.email}</p>
            </div>
            <div>
              <label>Location Coordinates</label>
              <p>{department.location.latitude}, {department.location.longitude}</p>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}><FaClock /> Activity & Status</h2>
          <div className={styles.infoGrid}>
            <div>
              <label>Last Login</label>
              <p>{new Date(department.lastLogin).toLocaleString()}</p>
            </div>
            <div>
              <label>Department Status</label>
              <p><FaCheckCircle className={styles.activeIcon} /> {department.status}</p>
            </div>
            <div>
              <label>Verification Status</label>
              <p>{department.isVerified ? <><FaCheckCircle className={styles.activeIcon} /> Verified</> : <><FaTimesCircle className={styles.inactiveIcon} /> Not Verified</>}</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.headerActions}>
        <button onClick={handleRemove} className={`${styles.actionButton} ${styles.removeButton}`}>
          <FaTrash /> Remove
        </button>
        <button onClick={handleLockToggle} className={`${styles.actionButton} ${isLocked ? styles.unlockButton : styles.lockButton}`}>
          {isLocked ? <><FaUnlock /> Unlock</> : <><FaLock /> Lock</>}
        </button>
      </div>
    </div>
  );
};

export default DepartmentDetailsPage;