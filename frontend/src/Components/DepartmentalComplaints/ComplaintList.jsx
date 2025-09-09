import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './ComplaintList.module.css';
import { FaClock, FaMapMarkerAlt, FaEye, FaCommentAlt } from 'react-icons/fa';
import axiosInstance from '../../axiosInstance';

const ComplaintList = ({
  departmentLocation,
  searchTerm,
  selectedStatus,
  selectedRadius,
  departmentType,
  complaints, // Receive complaints as prop
}) => {
  const [loading, setLoading] = useState(false); // No longer fetching here
  const [error, setError] = useState(null); // No longer fetching here
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'new', 'older'

  // No useEffect for fetching complaints here anymore

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return styles.pendingStatus;
      case 'in progress':
        return styles.inProgressStatus;
      case 'resolved':
      case 'resloved': // Handle typo
        return styles.resolvedStatus;
      default:
        return '';
    }
  };

  // Haversine formula
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const toRad = (Value) => (Value * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000));

  const newComplaints = complaints.filter(c => new Date(c.createdAt) > twoDaysAgo);
  const olderComplaints = complaints.filter(c => new Date(c.createdAt) <= twoDaysAgo);

  const displayedComplaints = complaints.filter((c) => {
    if (activeTab === 'new') return new Date(c.createdAt) > twoDaysAgo;
    if (activeTab === 'older') return new Date(c.createdAt) <= twoDaysAgo;
    return true;
  });

  return (
    <div className={styles.complaintListContainer}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Complaints ({complaints.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'new' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('new')}
        >
          New ({newComplaints.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'older' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('older')}
        >
          Older ({olderComplaints.length})
        </button>
      </div>

      {loading && <p>Loading complaints...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && displayedComplaints.length === 0 && <p>No complaints found.</p>}

      {!loading && !error && displayedComplaints.length > 0 && (
        <div className={styles.complaintsGrid}>
          {displayedComplaints.map((complaint) => (
            <div key={complaint._id} className={styles.complaintCard}>
              <div className={styles.cardHeader}>
                <h1 className={styles.problemId}>Problem ID: {complaint.problemId}</h1>
                {complaint.status && (
                <div className={styles.statusWrapper}>
                  <span className={`${styles.statusTag} ${getStatusClass(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </div>
              )}
              </div>

              <h3 className={styles.title}>{complaint.title}</h3>

              <div className={styles.cardMeta}>
                <p><FaClock /> {new Date(complaint.createdAt).toLocaleDateString()}</p>
                {complaint.location && complaint.location.address && departmentLocation && (
                  <p>
                    <FaMapMarkerAlt /> {complaint.location.address} -{' '}
                    {haversineDistance(
                      departmentLocation.latitude,
                      departmentLocation.longitude,
                      complaint.location.coordinates.lat,
                      complaint.location.coordinates.lng
                    ).toFixed(1)} km away
                  </p>
                )}
                {complaint.location && complaint.location.address && !departmentLocation && (
                  <p><FaMapMarkerAlt /> {complaint.location.address}</p>
                )}
              </div>

              <p className={styles.description}>{complaint.description}</p>

              <div className={styles.cardFooter}>
                <div className={styles.categoryResponses}>
                  <span className={styles.category}>{complaint.category}</span>
                  <p><FaCommentAlt /> {complaint.comments ? complaint.comments.length : 0} comments</p>
                </div>
                <Link to={`/department/complaints/${complaint.problemId}`} className={styles.viewDetailsButton}>
                  <FaEye /> View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintList;
