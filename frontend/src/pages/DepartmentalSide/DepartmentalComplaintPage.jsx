import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './DepartmentalComplaintPage.module.css';
import { FaRegCalendarAlt, FaMapMarkerAlt, FaRegComment, FaRegClock, FaCheckCircle, FaHeart } from 'react-icons/fa';
import axiosInstance from '../../axiosInstance';

const DepartmentalComplaintPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await axiosInstance.get(`/api/problems/${id}`);
        setComplaint(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!complaint) {
    return <div>Complaint not found</div>;
  }

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <div className={styles.card}>
          <div className={styles.complaintHeader}>
            <span className={styles.tag}>{complaint.category}</span>
            <span className={styles.creationDate}><FaRegCalendarAlt /> Created {timeAgo(complaint.createdAt)}</span>
          </div>
          <h1 className={styles.title}>{complaint.title}</h1>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Description</h2>
            <p>{complaint.description}</p>
          </div>
          {complaint.location && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Location</h2>
              <p className={styles.location}><FaMapMarkerAlt /> {complaint.location.address}</p>
              <p className={styles.coordinates}>Coordinates: {complaint.location.coordinates.lat}, {complaint.location.coordinates.lng}</p>
            </div>
          )}
        </div>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}><FaRegComment /> Comments & Updates ({complaint.comments.length})</h2>
          {complaint.comments.map(comment => (
            <div key={comment._id} className={styles.comment}>
              <div className={styles.commentHeader}>
                <span className={styles.commentAuthor}>{comment.user ? comment.user.name : 'Anonymous'}</span>
                <span className={styles.commentDate}>{timeAgo(comment.createdAt)}</span>
              </div>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.sidebar}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Complaint Information</h2>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Problem ID</span>
            <span className={styles.infoValue}>{complaint.problemId}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Category</span>
            <span className={styles.infoValue}>{complaint.category}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Status</span>
            <span className={styles.infoValue}>{complaint.status}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Created</span>
            <span className={styles.infoValue}>{new Date(complaint.createdAt).toLocaleString()}</span>
          </div>
          <div className={styles.likes}><FaHeart /> {complaint.likes} likes</div>
        </div>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <button className={styles.actionButton}><FaRegClock /> Mark In Progress</button>
          <button className={`${styles.actionButton} ${styles.resolvedButton}`}><FaCheckCircle /> Mark as Resolved</button>
        </div>
      </div>
    </div>
  );
}

export default DepartmentalComplaintPage;