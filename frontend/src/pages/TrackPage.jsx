import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./TrackPage.module.css";

const TrackPage = () => {
  const [allComplaints, setAllComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Status");
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [selectedLocation, setSelectedLocation] = useState("Location");
  const [startDate, setStartDate] = useState("");

  const navigate = useNavigate();

  // Fetch complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/problems");
        setAllComplaints(response.data);
        setFilteredComplaints(response.data); // Initially display all
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };
    fetchComplaints();
  }, []);

  // Apply filters
  useEffect(() => {
    let updatedComplaints = [...allComplaints];

    // Search filter
    if (searchTerm) {
      updatedComplaints = updatedComplaints.filter(
        (complaint) =>
          complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (complaint.location &&
            complaint.location.address &&
            complaint.location.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
          complaint.problemId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus && selectedStatus !== "Status") {
      updatedComplaints = updatedComplaints.filter(
        (complaint) => complaint.status === selectedStatus
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== "Category") {
      updatedComplaints = updatedComplaints.filter(
        (complaint) => complaint.category === selectedCategory
      );
    }

    // Location filter
    if (selectedLocation && selectedLocation !== "Location") {
      updatedComplaints = updatedComplaints.filter(
        (complaint) =>
          complaint.location &&
          complaint.location.address &&
          complaint.location.address.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // ✅ Date filter (EXACT date only)
    if (startDate) {
      updatedComplaints = updatedComplaints.filter((complaint) => {
        const complaintDate = new Date(complaint.createdAt)
          .toISOString()
          .split("T")[0];
        return complaintDate === startDate;
      });
    }

    setFilteredComplaints(updatedComplaints);
  }, [searchTerm, selectedStatus, selectedCategory, selectedLocation, startDate, allComplaints]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("Status");
    setSelectedCategory("Category");
    setSelectedLocation("Location");
    setStartDate("");
  };

  const handleViewDetails = (complaintId) => {
    navigate(`/complaint/${complaintId}`);
  };

  // Extract unique categories & locations
  const uniqueCategories = [...new Set(allComplaints.map((c) => c.category))].filter(Boolean);
  const uniqueLocations = [
    ...new Set(allComplaints.map((c) => c.location && c.location.address).filter(Boolean)),
  ];

  return (
    <div className={styles.trackContainer}>
      <h2 className={styles.title}>Track Complaints</h2>

      {/* Filters */}
      <div className={styles.filterBox}>
        <div className={styles.filterContent}>
          <input
            type="text"
            placeholder="Search by ID, description, location..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className={styles.filterRow}>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option>Status</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Rejected</option>
            </select>

            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option>Category</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
              <option>Location</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* Single date filter */}
            <div className={styles.dateFilter}>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <button className={styles.resetBtn} onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className={styles.complaintsList}>
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((c) => (
            <div className={styles.complaintCard} key={c.problemId}>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h4>{c.problemId}</h4>
                  <span
                    className={`${styles.status} ${styles[
                      c.status
                        .toLowerCase()
                        .replace(/ /g, "")
                        .replace(/-/g, "")
                        .replace("resloved", "resolved")
                    ]}`}
                  >
                    {c.status}
                  </span>
                </div>
                <p>{c.title}</p>
                <p className={styles.description}><strong>Description: </strong>{c.description}</p>
                <p>
                  <strong>Category:</strong> {c.category} &nbsp;
                </p>
                <p>
                  <strong>Location:</strong> {c.location ? c.location.address : "N/A"}
                </p>
                <p>
                  <strong>Raised Date:</strong>{" "}
                  {new Date(c.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Last Updated:</strong>{" "}
                  {new Date(c.updatedAt).toLocaleDateString()}
                </p>
              </div>

              <div className={styles.cardFooter}>
                <span
                  className={styles.clickableText}
                  onClick={() => handleViewDetails(c.problemId)}
                >
                  Comments: N/A
                </span>
                <button
                  className={styles.detailsBtn}
                  onClick={() => handleViewDetails(c.problemId)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No complaints found.</p>
        )}
      </div>
    </div>
  );
};

export default TrackPage;
