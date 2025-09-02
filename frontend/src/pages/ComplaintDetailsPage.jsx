import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ComplaintDetailsPage.module.css";

// Import icons
import { FaArrowLeft, FaPrint, FaShareAlt  } from 'react-icons/fa';

const ComplaintDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const complaintResponse = await axios.get(`http://localhost:5000/api/problems/${id}`);
        setComplaint(complaintResponse.data);
      } catch (err) {
        console.error("Error fetching complaint details:", err);
        setError("Failed to load complaint details.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintDetails();
  }, [id]);

  const handleAddComment = async () => {
    if (!newCommentText.trim() || !complaint) return;

    try {
      const response = await axios.post(`http://localhost:5000/api/problems/${id}/comments`, {
        text: newCommentText,
      });
      setComplaint(response.data);
      setNewCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#0dcaf0'; // Cyan
      case 'In Progress':
        return '#ffc107'; // Yellow
      case 'Resolved':
        return '#198754'; // Green
      case 'Rejected':
        return '#dc3545'; // Red
      default:
        return '#6c757d'; // Gray
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!complaint) {
    return <div className={styles.notFound}>Complaint not found.</div>;
  }

  const {
    problemId,
    title,
    description,
    category,
    location,
    status,
    createdAt,
    image,
    comments,
  } = complaint;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1>{problemId} - {title}</h1>
          <div className={styles.headerMeta}>
            <span>Raised: {new Date(createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className={styles.headerLocation}>
            Location: {location?.address || 'N/A'}
          </div>
        </div>
        <div className={styles.headerActions}>
          <div 
            className={styles.statusBadge}
            style={{ backgroundColor: getStatusColor(status) }}
          >
            {status}
          </div>
          <div className={styles.actionButtons}>
            <button onClick={() => navigate(-1)}><FaArrowLeft /> Back</button>
            <button><FaPrint /> Print</button>
            <button><FaShareAlt /> Share</button>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.detailsSection}>
          <div className={styles.complaintDetails}>
            <h2>Complaint Details</h2>
            <div className={styles.detailItem}>
              <strong>Complaint ID:</strong>
              <span>{problemId}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>Date Raised:</strong>
              <span>{new Date(createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>Category:</strong>
              <span>{category}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>Address:</strong>
              <span>{location?.address || 'N/A'}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>Coordinates:</strong>
              <span>
                {location?.coordinates?.lat && location?.coordinates?.lng
                  ? `${location.coordinates.lat}, ${location.coordinates.lng}`
                  : 'N/A'}
              </span>
            </div>
          </div>
          <div className={styles.descriptionSection}>
            <h2>Description</h2>
            <p>{description}</p>
          </div>
        </div>

        <div className={styles.attachmentsSection}>
          <h2>Attachments</h2>
          {image && image.url ? (
            <div className={styles.attachmentContainer}>
              {image.resource_type === 'video' ? (
                <video src={image.url} controls className={styles.media} />
              ) : (
                <img src={image.url} alt="Attachment" className={styles.media} />
              )}
            </div>
          ) : (
            <div className={styles.noAttachment}>No attachments found.</div>
          )}
        </div>
      </div>

      <div className={styles.commentsSection}>
        <h2>Comments</h2>
        <div className={styles.commentsList}>
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className={styles.commentItem}>
                <p>{comment.text}</p>
                <span className={styles.commentDate}>{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
        <div className={styles.addCommentForm}>
          <textarea
            placeholder="Add a comment..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
          ></textarea>
          <button onClick={handleAddComment}>Add Comment</button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsPage;