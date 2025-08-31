import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./ComplaintDetailsPage.module.css";
import ProgressBar from "../Components/ProgressBar";

const ComplaintDetailsPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const complaintResponse = await axios.get(`http://localhost:5000/api/problems/${id}`);
        setComplaint(complaintResponse.data);

        const likedProblems = JSON.parse(localStorage.getItem("likedProblems") || "[]");
        if (likedProblems.includes(id)) {
          setIsLiked(true);
        }

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

  const handleLikeProblem = async () => {
    if (isLiked) return;

    try {
      const response = await axios.post(`http://localhost:5000/api/problems/${id}/like`);
      setComplaint(response.data);
      setIsLiked(true);

      const likedProblems = JSON.parse(localStorage.getItem("likedProblems") || "[]");
      localStorage.setItem("likedProblems", JSON.stringify([...likedProblems, id]));

    } catch (err) {
      console.error("Error liking problem:", err);
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
        <ProgressBar status={complaint.status} />
        <p><strong>Likes:</strong> {complaint.likes}</p>
        <p><strong>Created At:</strong> {new Date(complaint.createdAt).toLocaleDateString()}</p>
        <p><strong>Last Updated:</strong> {new Date(complaint.updatedAt).toLocaleDateString()}</p>
        <button onClick={handleLikeProblem} className={styles.likeButton} disabled={isLiked}>
          {isLiked ? "Liked" : "Like"}
        </button>
      </div>

      <h3 className={styles.commentsTitle}>Comments</h3>
      <div className={styles.commentsList}>
        {complaint.comments && complaint.comments.length > 0 ? (
          complaint.comments.map((comment) => (
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
  );
};

export default ComplaintDetailsPage;
