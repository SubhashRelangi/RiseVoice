import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Import icons
import { FaArrowLeft, FaPrint, FaShareAlt } from 'react-icons/fa';

const ComplaintDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';


  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const complaintResponse = await axios.get(`${API_BASE_URL}/api/problems/${id}`);
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
      const response = await axios.post(`${API_BASE_URL}/api/problems/${id}/comments`, {
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
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!complaint) {
    return <div className="notFound">Complaint not found.</div>;
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
    <>
      <style>
        {`
        /* General Page Layout */
        .pageContainer {
          background-color: #f8f9fa;
          min-height: 100%;
          width: 100%;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          padding: 1rem;
          box-sizing: border-box;
        }

        /* Header Section */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          background-color: #ffffff;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          margin-bottom: 2rem;
        }

        .headerTitle h1 {
          margin: 0 0 0.5rem 0;
          font-size: 1.75rem;
          font-weight: 600;
          color: #333;
        }

        .headerMeta, .headerLocation {
          font-size: 0.9rem;
          color: #666;
        }

        .headerMeta span {
          margin-right: 1.5rem;
        }

        .headerLocation {
          margin-top: 0.5rem;
        }

        .headerActions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1rem;
        }

        .statusBadge {
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 15px;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .actionButtons {
          display: flex;
          gap: 0.5rem;
        }

        .actionButtons button {
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .actionButtons button:hover {
          background-color: #f1f1f1;
        }

        /* Main Content Layout */
        .mainContent {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        /* Details Section (Left) */
        .detailsSection {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .complaintDetails, .descriptionSection, .attachmentsSection {
          background-color: #ffffff;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .complaintDetails h2, .descriptionSection h2, .attachmentsSection h2, .commentsSection h2 {
          margin: 0 0 1.5rem 0;
          font-size: 1.25rem;
          font-weight: 600;
          border-bottom: 1px solid #eee;
          padding-bottom: 0.75rem;
        }

        .detailItem {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .detailItem strong {
          font-weight: 600;
          color: #555;
        }

        .detailItem span {
          color: #333;
        }

        .descriptionSection p {
          margin: 0;
          line-height: 1.6;
          color: #333;
        }

        /* Comments Section */
        .commentsSection {
          background-color: #ffffff;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .commentsList {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .commentItem {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 1rem;
        }

        .commentItem p {
          margin: 0 0 0.5rem 0;
        }

        .commentDate {
          font-size: 0.8rem;
          color: #6c757d;
        }

        .addCommentForm {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .addCommentForm textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 1rem;
          resize: vertical;
          min-height: 80px;
          box-sizing: border-box;
        }

        .addCommentForm button {
          align-self: flex-end;
          background-color: #0d6efd;
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
        }

        .addCommentForm button:hover {
          background-color: #0b5ed7;
        }


        /* Attachments Section (Right) */
        .attachmentsSection {
          display: flex;
          flex-direction: column;
        }

        .attachmentContainer {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f0f0f0;
          border-radius: 8px;
          overflow: hidden;
        }

        .media {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .noAttachment {
          text-align: center;
          color: #666;
          font-size: 1rem;
          padding: 2rem;
        }

        /* Loading/Error States */
        .loading, .error, .notFound {
          text-align: center;
          padding: 3rem;
          font-size: 1.2rem;
          color: #666;
        }

        /* --- Responsive Design --- */

        /* Tablet and larger mobile */
        @media (max-width: 1024px) {
          .mainContent {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .headerTitle h1 {
            font-size: 1.5rem;
          }
        }

        /* Mobile phones */
        @media (max-width: 767px) {
          .pageContainer {
            padding: 0.5rem;
          }

          .header {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }

          .headerActions {
            flex-direction: row;
            width: 100%;
            justify-content: space-between;
            align-items: center;
          }

          .actionButtons {
            gap: 0.25rem;
            flex-wrap: wrap; /* Allow buttons to wrap */
          }

          .actionButtons button {
            padding: 0.4rem 0.6rem;
            font-size: 0.8rem;
          }

          .headerTitle h1 {
            font-size: 1.3rem;
          }

          .complaintDetails, .descriptionSection, .attachmentsSection, .commentsSection {
            padding: 1rem;
          }

          .detailItem {
            grid-template-columns: 1fr;
            gap: 0.25rem;
            margin-bottom: 0.75rem;
          }

          .detailItem strong {
            margin-bottom: 0.1rem;
          }

          .complaintDetails h2, .descriptionSection h2, .attachmentsSection h2, .commentsSection h2 {
            font-size: 1.1rem;
            margin-bottom: 1rem;
          }

          .statusBadge {
            font-size: 0.7rem;
            padding: 0.3rem 0.6rem;
          }
        }
      `}
      </style>
      <div className="pageContainer">
        <div className="header">
          <div className="headerTitle">
            <h1>{problemId} - {title}</h1>
            <div className="headerMeta">
              <span>Raised: {new Date(createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="headerLocation">
              Location: {location?.address || 'N/A'}
            </div>
          </div>
          <div className="headerActions">
            <div
              className="statusBadge"
              style={{ backgroundColor: getStatusColor(status) }}
            >
              {status}
            </div>
            <div className="actionButtons">
              <button onClick={() => navigate(-1)}><FaArrowLeft /> Back</button>
              <button><FaPrint /> Print</button>
              <button><FaShareAlt /> Share</button>
            </div>
          </div>
        </div>

        <div className="mainContent">
          <div className="detailsSection">
            <div className="complaintDetails">
              <h2>Complaint Details</h2>
              <div className="detailItem">
                <strong>Complaint ID:</strong>
                <span>{problemId}</span>
              </div>
              <div className="detailItem">
                <strong>Date Raised:</strong>
                <span>{new Date(createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="detailItem">
                <strong>Category:</strong>
                <span>{category}</span>
              </div>
              <div className="detailItem">
                <strong>Address:</strong>
                <span>{location?.address || 'N/A'}</span>
              </div>
              <div className="detailItem">
                <strong>Coordinates:</strong>
                <span>
                  {location?.coordinates?.lat && location?.coordinates?.lng
                    ? `${location.coordinates.lat}, ${location.coordinates.lng}`
                    : 'N/A'}
                </span>
              </div>
            </div>
            <div className="descriptionSection">
              <h2>Description</h2>
              <p>{description}</p>
            </div>
          </div>

          <div className="attachmentsSection">
            <h2>Attachments</h2>
            {image && image.url ? (
              <div className="attachmentContainer">
                {image.resource_type === 'video' ? (
                  <video src={image.url} controls className="media" />
                ) : (
                  <img src={image.url} alt="Attachment" className="media" />
                )}
              </div>
            ) : (
              <div className="noAttachment">No attachments found.</div>
            )}
          </div>
        </div>

        <div className="commentsSection">
          <h2>Comments</h2>
          <div className="commentsList">
            {comments && comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="commentItem">
                  <p>{comment.text}</p>
                  <span className="commentDate">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
          <div className="addCommentForm">
            <textarea
              placeholder="Add a comment..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
            ></textarea>
            <button onClick={handleAddComment}>Add Comment</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComplaintDetailsPage;