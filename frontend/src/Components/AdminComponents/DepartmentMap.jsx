import React, { useState, useEffect } from 'react';
import styles from './DepartmentMap.module.css';
import axiosInstance from '../../axiosInstance';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FaSearch, FaFilter, FaSync } from 'react-icons/fa'; // Import icons

// Custom icon function
const getStatusIcon = (status) => {
  const color = {
    approved: '#28a745',
    pending: '#ffc107',
    rejected: '#dc3545',
    verified: '#ffc107', // pending
  }[status];

  return L.divIcon({
    className: styles.customIcon,
    html: `<div style="background-color: ${color};" class="${styles.markerPin}"></div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });
};

const DepartmentMap = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/all-departments');
        const departmentsWithAddress = [];
        for (const dept of response.data) {
          try {
            // Add a delay of 1 second between requests to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
            const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${dept.location.latitude}&lon=${dept.location.longitude}`, { withCredentials: false });
            const address = geoResponse.data.display_name || 'N/A';
            departmentsWithAddress.push({ ...dept, address, state: geoResponse.data.address.state || 'N/A' });
          } catch (error) {
            console.error('Error fetching address for department', dept._id, error);
            departmentsWithAddress.push({ ...dept, address: 'N/A', state: 'N/A' });
          }
        }
        setDepartments(departmentsWithAddress);
        setFilteredDepartments(departmentsWithAddress);
      } catch (err) {
        setError('Failed to fetch departments');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    let filtered = departments;

    if (searchTerm) {
      filtered = filtered.filter(dept =>
        dept.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dept.state && dept.state.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (dept.address && dept.address.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedState) {
      filtered = filtered.filter(dept => dept.state === selectedState);
    }

    setFilteredDepartments(filtered);
  }, [searchTerm, selectedState, departments]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedState('');
  };

  if (loading) {
    return <p>Loading departments and their locations...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const states = [...new Set(departments.map(dept => dept.state).filter(Boolean))];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Department Locations</h2>
        <div className={styles.legend}>
          <span><span className={`${styles.dot} ${styles.active}`}></span> Active</span>
          <span><span className={`${styles.dot} ${styles.pending}`}></span> Pending</span>
          <span><span className={`${styles.dot} ${styles.rejected}`}></span> Rejected</span>
        </div>
      </div>
      <div className={styles.filters}>
        <div className={styles.searchInputContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search departments or states..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.selectContainer}>
          <FaFilter className={styles.filterIcon} />
          <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className={styles.selectInput}>
            <option value="">Filter by state</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        <button onClick={handleReset} className={styles.resetButton}>
          <FaSync className={styles.resetIcon} /> Reset
        </button>
      </div>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} className={styles.map}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {filteredDepartments.map(dept => (
          <Marker
            key={dept._id}
            position={[dept.location.latitude, dept.location.longitude]}
            icon={getStatusIcon(dept.status)}
          >
            <Popup>
              {dept.departmentName}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className={styles.listContainer}>
        <h3>Departments ({filteredDepartments.length})</h3>
        <ul className={styles.departmentList}>
          {filteredDepartments.map(dept => (
            <li key={dept._id} className={styles.departmentItem}>
              <div className={styles.departmentInfo}>
                <span className={`${styles.dot} ${styles[dept.status]}`}></span>
                <div>
                  <p className={styles.departmentName}>{dept.departmentName}</p>
                  <p className={styles.departmentAddress}>{dept.address}</p>
                </div>
              </div>
              <span className={`${styles.statusBadge} ${styles[dept.status]}`}>{dept.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DepartmentMap;
