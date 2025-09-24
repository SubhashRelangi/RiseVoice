import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./TrackPage.module.css";
import { FaFire, FaComment } from "react-icons/fa"; // Import icons

const TrackPage = () => {
  const [allComplaints, setAllComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Status");
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [selectedLocation, setSelectedLocation] = useState("Location");
  const [startDate, setStartDate] = useState("");
  const [selectedRadius, setSelectedRadius] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [likedProblems, setLikedProblems] = useState(() => {
    try {
      const storedLikes = localStorage.getItem('likedProblems');
      return storedLikes ? new Set(JSON.parse(storedLikes)) : new Set();
    } catch (error) {
      console.error("Failed to parse liked problems from localStorage", error);
      return new Set();
    }
  });

  const navigate = useNavigate();

  // Fetch complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_BASE_URL}/api/problems`);
        setAllComplaints(response.data);
        setFilteredComplaints(response.data); // Initially display all
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };
    fetchComplaints();
  }, []);

  // Save liked problems to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('likedProblems', JSON.stringify(Array.from(likedProblems)));
    } catch (error) {
      console.error("Failed to save liked problems to localStorage", error);
    }
  }, [likedProblems]);

  // Apply filters
  useEffect(() => {
    const applyFilters = async () => {
      let complaintsToFilter;

      if (selectedRadius && userLocation) {
        setIsLocationLoading(true);
        try {
          const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
          const response = await axios.get(`${API_BASE_URL}/api/problems`, {
            params: {
              radius: selectedRadius,
              departmentLat: userLocation.latitude,
              departmentLng: userLocation.longitude,
            }
          });
          complaintsToFilter = response.data;
        } catch (error) {
          console.error("Error fetching complaints by radius:", error);
          complaintsToFilter = [];
        } finally {
          setIsLocationLoading(false);
        }
      } else {
        complaintsToFilter = [...allComplaints];
      }

      let updatedComplaints = complaintsToFilter;

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

      if (selectedStatus && selectedStatus !== "Status") {
        updatedComplaints = updatedComplaints.filter(
          (complaint) => complaint.status === selectedStatus
        );
      }

      if (selectedCategory && selectedCategory !== "Category") {
        updatedComplaints = updatedComplaints.filter(
          (complaint) => complaint.category === selectedCategory
        );
      }

      if (selectedLocation && selectedLocation !== "Location") {
        updatedComplaints = updatedComplaints.filter(
          (complaint) =>
            complaint.location &&
            complaint.location.address &&
            complaint.location.address.toLowerCase().includes(selectedLocation.toLowerCase())
        );
      }

      if (startDate) {
        updatedComplaints = updatedComplaints.filter((complaint) => {
          const complaintDate = new Date(complaint.createdAt)
            .toISOString()
            .split("T")[0];
          return complaintDate === startDate;
        });
      }

      setFilteredComplaints(updatedComplaints);
    };
    
    applyFilters();

  }, [searchTerm, selectedStatus, selectedCategory, selectedLocation, startDate, allComplaints, selectedRadius, userLocation]);

  const handleRadiusChange = (e) => {
    const radius = e.target.value;
    setSelectedRadius(radius);

    if (radius) {
      if (navigator.geolocation) {
        setIsLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            // The useEffect will handle the loading state once data is fetched
          },
          (error) => {
            console.error("Error getting user location:", error);
            alert("Could not get your location. Please enable location services.");
            setSelectedRadius(''); // Reset radius filter
            setIsLocationLoading(false);
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
        setSelectedRadius(''); // Reset radius filter
      }
    } else {
      setUserLocation(null);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("Status");
    setSelectedCategory("Category");
    setSelectedLocation("Location");
    setStartDate("");
    setSelectedRadius("");
    setUserLocation(null);
    setFilteredComplaints(allComplaints);
  };

  const handleViewDetails = (complaintId) => {
    navigate(`/complaint/${complaintId}`);
  };

  const handleLike = async (problemId) => {
    if (likedProblems.has(problemId)) return;

    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      await axios.post(`${API_BASE_URL}/api/problems/${problemId}/like`);

      setAllComplaints(prevComplaints =>
        prevComplaints.map(complaint =>
          complaint.problemId === problemId
            ? { ...complaint, likes: (complaint.likes || 0) + 1 }
            : complaint
        )
      );
      
      setLikedProblems(prevLiked => new Set(prevLiked).add(problemId));
    } catch (error) {
      console.error("Error liking problem:", error);
    }
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

            <select value={selectedRadius} onChange={handleRadiusChange}>
              <option value="">Radius</option>
              <option value="1">1 km</option>
              <option value="2">2 km</option>
              <option value="3">3 km</option>
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
      {isLocationLoading ? (
        <p>Loading complaints...</p>
      ) : (
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
                  <div className={styles.cardActionsLeft}>
                    <span
                      onClick={() => handleLike(c.problemId)}
                      className={styles.likeButton}
                      style={{
                        cursor: likedProblems.has(c.problemId) ? 'default' : 'pointer',
                      }}
                    >
                      <FaFire style={{ color: likedProblems.has(c.problemId) ? 'red' : 'grey' }} />
                      {' '}{c.likes}
                    </span>
                    <span
                      className={styles.commentButton}
                      onClick={() => handleViewDetails(c.problemId)}
                    >
                      <FaComment /> {c.comments.length}
                    </span>
                  </div>
                  <button
                    className={styles.detailsBtn}
                    onClick={() => handleViewDetails(c.problemId)}
                  >
                    View More
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No complaints found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackPage;
