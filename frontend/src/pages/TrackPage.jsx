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
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/problems");
        setAllComplaints(response.data);
        setFilteredComplaints(response.data); // Initially display all
      } catch (error) {
        console.error("Error fetching complaints:", error);
        // Optionally, set an error state to display a message to the user
      }
    };
    fetchComplaints();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const applyFilters = () => {
      let updatedComplaints = [...allComplaints];

      // Apply search term filter
      if (searchTerm) {
        updatedComplaints = updatedComplaints.filter(
          (complaint) =>
            complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (complaint.location && complaint.location.address && complaint.location.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
            complaint.problemId.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply status filter
      if (selectedStatus && selectedStatus !== "Status") {
        updatedComplaints = updatedComplaints.filter(
          (complaint) => complaint.status === selectedStatus
        );
      }

      // Apply category filter
      if (selectedCategory && selectedCategory !== "Category") {
        updatedComplaints = updatedComplaints.filter(
          (complaint) => complaint.category === selectedCategory
        );
      }

      // Apply location filter (assuming location is just address for now)
      if (selectedLocation && selectedLocation !== "Location") {
        updatedComplaints = updatedComplaints.filter(
          (complaint) => complaint.location && complaint.location.address && complaint.location.address.toLowerCase().includes(selectedLocation.toLowerCase())
        );
      }

      // Apply date range filter
      if (startDate) {
        const start = new Date(startDate);
        updatedComplaints = updatedComplaints.filter(
          (complaint) => new Date(complaint.createdAt) >= start
        );
      }
      if (endDate) {
        const end = new Date(endDate);
        updatedComplaints = updatedComplaints.filter(
          (complaint) => new Date(complaint.createdAt) <= end
        );
      }

      setFilteredComplaints(updatedComplaints);
    };

    applyFilters();
  }, [searchTerm, selectedStatus, selectedCategory, selectedLocation, startDate, endDate, allComplaints]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("Status");
    setSelectedCategory("Category");
    setSelectedLocation("Location");
    setStartDate("");
    setEndDate("");
  };

  // Function to handle navigating to the details page
  const handleViewDetails = (complaintId) => {
    navigate(`/complaint/${complaintId}`);
  };

  // Extract unique categories and locations for filter options
  const uniqueCategories = [...new Set(allComplaints.map(c => c.category))].filter(Boolean);
  const uniqueLocations = [...new Set(allComplaints.map(c => c.location && c.location.address).filter(Boolean))];

  return (
    <div className={styles.trackContainer}>
      <h2 className={styles.title}>Track Complaints</h2>

      {/* Search Filters */}
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
              {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
              <option>Location</option>
              {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
            <div className={styles.dateFilter}>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /> <span>to</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <button className={styles.resetBtn} onClick={handleResetFilters}>Reset Filters</button>
          </div>
          </div>
      </div>

      {/* Complaints List */}
      <div className={styles.complaintsList}>
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((c) => (
            <div className={styles.complaintCard} key={c.problemId}>
              <div className={styles.cardContent}> {/* New wrapper for text content */}
                <div className={styles.cardHeader}>
                  <h4>{c.problemId}</h4>
                  <span
                    className={`${styles.status} ${styles[c.status.toLowerCase().replace(/ /g, '')]}`}
                  >
                    {c.status}
                  </span>
                </div>
                <p className={styles.date}>📅 {new Date(c.createdAt).toLocaleDateString()}</p>
                <p>
                  <strong>Category:</strong> {c.category} &nbsp;
                </p>
                <p>
                  <strong>Location:</strong> {c.location ? c.location.address : 'N/A'}
                </p>
                <p className={styles.description}>{c.description}</p>
                <p>
                  <strong>Assigned Officer:</strong> {c.assignedTo || 'Not Assigned'}
                  <br />
                  <strong>Last Updated:</strong> {new Date(c.updatedAt).toLocaleDateString()}
                </p>
              </div> {/* End cardContent */}

              <div className={styles.cardFooter}>
                {c.image && c.image.url && <span className={styles.clickableText} onClick={() => handleViewDetails(c.problemId)}>🖼️ Image Available</span>}
                <span className={styles.clickableText} onClick={() => handleViewDetails(c.problemId)}>💬 Comments: N/A</span> {/* Placeholder as comments are not in model */}
                <button className={styles.detailsBtn} onClick={() => handleViewDetails(c.problemId)} >View Details</button>
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
