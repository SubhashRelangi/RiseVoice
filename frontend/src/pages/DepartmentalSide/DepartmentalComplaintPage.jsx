import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './DepartmentalComplaintPage.module.css';
import {
  FaRegCalendarAlt,
  FaMapMarkerAlt,
  FaRegComment,
  FaRegClock,
  FaCheckCircle,
  FaFire,
} from 'react-icons/fa';
import axiosInstance from '../../axiosInstance';
import Loader from '../../Components/Loader';

const DepartmentalComplaintPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [departmentProfile, setDepartmentProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [complaintResponse, profileResponse] = await Promise.all([
          axiosInstance.get(`/api/problems/${id}`),
          axiosInstance.get('/api/departments/profile')
        ]);
        setComplaint(complaintResponse.data);
        setDepartmentProfile(profileResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load complaint details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axiosInstance.post(`/api/problems/${id}/comments`, {
        text: newComment,
        user: {
          name: departmentProfile?.name || 'Department',
          role: 'Department',
        },
      });
      setComplaint(response.data);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment. Please try again.');
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const response = await axiosInstance.put(`/api/problems/${id}/status`, { status: newStatus });
      setComplaint(response.data);
    } catch (err) {
      console.error(`Error updating status to ${newStatus}:`, err);
      alert(`Failed to update status to ${newStatus}. Please try again.`);
    }
  };

  const handleMarkInProgress = () => updateStatus('In Progress');
  const handleMarkResolved = () => updateStatus('Resolved');

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><p>{error}</p></div>;
  }

  if (!complaint) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><p>Complaint not found.</p></div>;

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    return Math.floor(seconds) + ' seconds ago';
  };

  return (
    <div className={styles.pageContainer}>
      {/* Left/Main Section */}
      <div className={styles.mainContent}>
        <div className={styles.card}>
          <div className={styles.complaintHeader}>
            <span className={`${styles.tag} ${styles[complaint.category]}`}>
              {complaint.category}
            </span>
            <span className={styles.creationDate}>
              <FaRegCalendarAlt /> Created {timeAgo(complaint.createdAt)}
            </span>
          </div>
          <h1 className={styles.title}>{complaint.title}</h1>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Description</h2>
            <p>{complaint.description}</p>
          </div>
          {complaint.location && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Location</h2>
              <p className={styles.location}>
                <FaMapMarkerAlt /> {complaint.location.address}
              </p>
              <p className={styles.coordinates}>
                Coordinates: {complaint.location.coordinates.lat},{' '}
                {complaint.location.coordinates.lng}
              </p>
            </div>
          )}
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Complaint Information</h2>
          <div className={styles.infoItem}>
            <p className={styles.infoLabel}>Problem ID</p>
            <p className={styles.infoValue}>{complaint.problemId}</p>
          </div>
          <div className={styles.infoItem}>
            <p className={styles.infoLabel}>Category</p>
            <p className={styles.infoValue}>{complaint.category}</p>
          </div>
          <div className={styles.infoItem}>
            <p className={styles.infoLabel}>Status</p>
            <p className={styles.infoValue}>{complaint.status}</p>
          </div>
          <div className={styles.infoItem}>
            <p className={styles.infoLabel}>Created</p>
            <p className={styles.infoValue}>
              {new Date(complaint.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Attachments</h2>
          {complaint.image && complaint.image.url ? (
            <div className={styles.attachmentContainer}>
              {complaint.image.resource_type === 'video' ? (
                <video
                  src={complaint.image.url}
                  controls
                  className={styles.media}
                />
              ) : (
                <img
                  src={complaint.image.url}
                  alt="Attachment"
                  className={styles.media}
                />
              )}
            </div>
          ) : (
            <div className={styles.noAttachment}>No attachments found.</div>
          )}
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <button
            className={styles.actionButton}
            onClick={handleMarkInProgress}
            disabled={complaint.status === 'In Progress' || complaint.status === 'Resolved' || complaint.status === 'Rejected'}
          >
            <FaRegClock /> Mark In Progress
          </button>
          <button
            className={`${styles.actionButton} ${styles.resolvedButton}`}
            onClick={handleMarkResolved}
            disabled={complaint.status === 'Resolved' || complaint.status === 'Rejected'}
          >
            <FaCheckCircle /> Mark as Resolved
          </button>
        </div>
      </div>

      {/* Comments Section (always bottom) */}
      <div className={`${styles.card} ${styles.commentsSection}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
          <h2 className={styles.sectionTitle} style={{ border: 'none', margin: 0, padding: 0 }}>
            <FaRegComment /> Comments & Updates ({complaint.comments.length})
          </h2>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'red', fontWeight: 'bold' }}>
            <FaFire />
            {complaint.likes || 0}
          </span>
        </div>
        {complaint.comments.map((comment) => (
          <div key={comment._id} className={styles.comment}>
            <div className={styles.commentHeader}>
              <span className={styles.commentAuthor}>
                {comment.user ? comment.user.name : 'Anonymous'}
              </span>
              <span className={styles.commentDate}>
                {timeAgo(comment.createdAt)}
              </span>
            </div>
            <p>{comment.text}</p>
          </div>
        ))}
        <div className={styles.addComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a public comment..."
          />
          <button onClick={handleAddComment}>Comment</button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentalComplaintPage;