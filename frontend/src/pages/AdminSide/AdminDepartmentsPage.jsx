import React, { useState, useEffect } from 'react';
import styles from './AdminDepartmentsPage.module.css';
import { BsBuilding, BsFiles, BsCheckCircle, BsCalendar, BsFunnel, BsSearch } from 'react-icons/bs';
import axiosInstance from '../../axiosInstance';
import DepartmentList from './DepartmentsManagement/DepartmentList';

const AdminDepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [uniqueStates, setUniqueStates] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/all-departments');
        setDepartments(response.data);
        setFilteredDepartments(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    if (departments.length > 0) {
      const states = [...new Set(departments.map(d => d.state))];
      setUniqueStates(states);
    }

    let filtered = departments;

    if (searchTerm) {
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.address && d.address.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(d => d.status === statusFilter);
    }

    if (stateFilter !== 'all') {
      filtered = filtered.filter(d => d.state === stateFilter);
    }

    setFilteredDepartments(filtered);

  }, [searchTerm, statusFilter, stateFilter, departments]);

  useEffect(() => {
    if (filteredDepartments.length > 0) {
        const total = filteredDepartments.length;
        const active = filteredDepartments.filter(d => d.status === 'approved').length;
        const pending = filteredDepartments.filter(d => d.status === 'pending').length;
        const rejected = filteredDepartments.filter(d => d.status === 'rejected').length;
        setStats({ total, active, pending, rejected });
    } else {
        setStats({ total: 0, active: 0, pending: 0, rejected: 0 });
    }
  }, [filteredDepartments]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setStateFilter('all');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleContainer}>
          <BsBuilding className={styles.titleIcon} />
          <div>
            <h1>Departments Management</h1>
            <p>Manage and monitor all government departments across India</p>
          </div>
        </div>
      </header>

      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span>Total Departments</span>
            <span className={styles.statNumber}>{stats.total}</span>
          </div>
          <BsFiles className={`${styles.statIcon} ${styles.totalIcon}`} />
        </div>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span>Active</span>
            <span className={`${styles.statNumber} ${styles.activeNumber}`}>{stats.active}</span>
          </div>
          <BsCheckCircle className={`${styles.statIcon} ${styles.activeIcon}`} />
        </div>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span>Pending</span>
            <span className={`${styles.statNumber} ${styles.pendingNumber}`}>{stats.pending}</span>
          </div>
          <BsCalendar className={`${styles.statIcon} ${styles.pendingIcon}`} />
        </div>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span>Rejected</span>
            <span className={`${styles.statNumber} ${styles.rejectedNumber}`}>{stats.rejected}</span>
          </div>
          <BsFunnel className={`${styles.statIcon} ${styles.rejectedIcon}`} />
        </div>
      </div>

      <div className={styles.filtersContainer}>
        <h2>Filters & Search</h2>
        <div className={styles.filtersBody}>
          <div className={styles.searchBar}>
            <BsSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search departments, states, or addresses..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.dropdowns}>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="approved">Active</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <select value={stateFilter} onChange={e => setStateFilter(e.target.value)}>
              <option value="all">All States</option>
              {uniqueStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <button className={styles.resetButton} onClick={handleResetFilters}>Reset Filters</button>
          </div>
        </div>
      </div>

      <DepartmentList departments={filteredDepartments} />
    </div>
  );
};

export default AdminDepartmentsPage;
