import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axiosInstance from '../../axiosInstance';
import styles from './Admin.module.css';

const AdminHomePage = () => {
  const [pendingDepartments, setPendingDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/admin/auth/logout');
      navigate('/admin/login'); // Redirect to admin login page after logout
    } catch (err) {
      console.error('Admin logout error:', err);
      setError(err.response?.data?.message || 'Failed to logout.');
    }
  };

  const fetchPendingDepartments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/api/admin/departments');
      setPendingDepartments(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending departments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDepartments();
  }, []);

  const handleAction = async (departmentId, actionType) => {
    setMessage('');
    setError('');
    try {
      const response = await axiosInstance.put(`/api/admin/department/${departmentId}/${actionType}`);
      setMessage(response.data.message);
      // Refresh the list after action
      fetchPendingDepartments();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${actionType} department.`);
    }
  };

  if (loading) {
    return <div className={styles.adminContainer}><p>Loading pending departments...</p></div>;
  }

  if (error) {
    return <div className={styles.adminContainer}><p className={styles.adminError}>Error: {error}</p></div>;
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminCard}>
        <h2 className={styles.adminTitle}>Admin Dashboard</h2>
        <button
          className={`${styles.adminButton} ${styles.logoutButton}`}
          onClick={handleLogout}
        >
          Logout
        </button>
        {message && <p className={styles.adminMessage}>{message}</p>}

        <h3>Departments Pending Approval ({pendingDepartments.length})</h3>
        {pendingDepartments.length === 0 ? (
          <p>No departments currently pending approval.</p>
        ) : (
          <ul className={styles.departmentList}>
            {pendingDepartments.map((dept) => (
              <li key={dept._id} className={styles.departmentItem}>
                <div className={styles.departmentDetails}>
                  <h4>{dept.departmentName} ({dept.departmentType})</h4>
                  <p>ID: {dept.departmentId}</p>
                  <p>Email: {dept.email}</p>
                  <p>Location: Lat {dept.location.latitude}, Lng {dept.location.longitude}</p>
                  <p>Status: {dept.status}</p>
                </div>
                <div className={styles.departmentActions}>
                  <button
                    className={`${styles.adminButton} ${styles.approveButton}`}
                    onClick={() => handleAction(dept.departmentId, 'approve')}
                  >
                    Approve
                  </button>
                  <button
                    className={`${styles.adminButton} ${styles.rejectButton}`}
                    onClick={() => handleAction(dept.departmentId, 'reject')}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminHomePage;