import React, { useState, useEffect } from 'react';
import styles from './DepartmentMap.module.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FaSearch, FaFilter, FaSync } from 'react-icons/fa';

const getStatusIcon = (status) => {
  const color = {
    approved: '#28a745',
    pending: '#ffc107',
    rejected: '#dc3545',
    verified: '#ffc107',
  }[status];

  return L.divIcon({
    className: styles.customIcon,
    html: `<div style="background-color: ${color};" class="${styles.markerPin}"></div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });
};

const DepartmentMap = ({ departments = [] }) => {
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');

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