import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./ComplaintDetailsPage.module.css"; // Will create this CSS module

const ComplaintDetailsPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const complaintResponse = await axios.get(`http://localhost:5000/api/problems/${id}`);
        setComplaint(complaintResponse.data);
        fetchCommentsForComplaint(complaintResponse.data.problemId); // Changed to problemId
      } catch (err) {
        console.error("Error fetching complaint details:", err);
        setError("Failed to load complaint details.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintDetails();
  }, [id]);

  const fetchCommentsForComplaint = async (problemId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/comments/${problemId}`);
      setComments(response.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    }
  };

  const handleAddComment = async () => {
    if (!newCommentText.trim() || !complaint) return;

    try {
      const response = await axios.post("http://localhost:5000/api/comments", {
        problemId: complaint.problemId, // Changed to problemId
        text: newCommentText,
      });
      setComments((prevComments) => [response.data, ...prevComments]);
      setNewCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/comments/${commentId}/like`);
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId ? response.data : comment
        )
      );
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading complaint details...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!complaint) {
    return <div className={styles.notFound}>Complaint not found.</div>;
  }

  return (
    <div className={styles.detailsContainer}>
      <h2 className={styles.title}>Complaint Details</h2>

      <div className={styles.detailsCard}>
        {complaint.image && complaint.image.url && (
          <div className={styles.mediaContainer}>
            {complaint.image.resource_type === 'video' ? (
              <video src={complaint.image.url} controls className={styles.complaintImage} />
            ) : (
              <img src={complaint.image.url} alt="Complaint" className={styles.complaintImage} />
            )}
          </div>
        )}
        <p><strong>ID:</strong> {complaint.problemId}</p>
        <p><strong>Title:</strong> {complaint.title}</p>
        <p><strong>Description:</strong> {complaint.description}</p>
        <p><strong>Category:</strong> {complaint.category}</p>
        <p><strong>Location:</strong> {complaint.location ? complaint.location.address : 'N/A'}</p>
        <p><strong>Status:</strong> {complaint.status}</p>
        <p><strong>Assigned To:</strong> {complaint.assignedTo || 'Not Assigned'}</p>
        <p><strong>Created At:</strong> {new Date(complaint.createdAt).toLocaleDateString()}</p>
        <p><strong>Last Updated:</strong> {new Date(complaint.updatedAt).toLocaleDateString()}</p>
      </div>

      <h3 className={styles.commentsTitle}>Comments</h3>
      <div className={styles.commentsList}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className={styles.commentItem}>
              <p>{comment.text}</p>
              <div className={styles.commentActions}>
                <span>🔥 {comment.likes}</span>
                <button onClick={() => handleLikeComment(comment._id)}>Like</button>
              </div>
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
  );
};

export default ComplaintDetailsPage;